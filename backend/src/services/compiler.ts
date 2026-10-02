import axios from 'axios';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { config } from '../config';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  error?: string;
}

// Local Execution Runner with timeout safety
async function runCodeLocally(
  language: string,
  code: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const startTime = Date.now();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexprep-run-'));
  const lang = language.toLowerCase();

  return new Promise((resolve) => {
    let childProcess: any;
    let stdoutData = '';
    let stderrData = '';
    let timeoutId: any = undefined;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    };

    try {
      if (lang === 'python') {
        const filePath = path.join(tempDir, 'solution.py');
        fs.writeFileSync(filePath, code, 'utf-8');
        childProcess = spawn('python', [filePath]);
      } else if (lang === 'javascript' || lang === 'js') {
        const filePath = path.join(tempDir, 'solution.js');
        fs.writeFileSync(filePath, code, 'utf-8');
        childProcess = spawn('node', [filePath]);
      } else if (lang === 'java') {
        const filePath = path.join(tempDir, 'Solution.java');
        fs.writeFileSync(filePath, code, 'utf-8');
        // Compile then run
        exec(`javac Solution.java`, { cwd: tempDir, timeout: 5000 }, (compileErr, cStdout, cStderr) => {
          if (compileErr) {
            cleanup();
            return resolve({
              stdout: '',
              stderr: cStderr || compileErr.message,
              output: cStderr || compileErr.message,
              exitCode: 1,
              executionTimeMs: Date.now() - startTime,
              error: 'Compilation Error'
            });
          }
          const runChild = spawn('java', ['Solution'], { cwd: tempDir });
          setupListeners(runChild, resolve, cleanup, startTime, stdin);
        });
        return;
      } else if (lang === 'cpp' || lang === 'c++') {
        const filePath = path.join(tempDir, 'solution.cpp');
        const outPath = path.join(tempDir, 'solution.exe');
        fs.writeFileSync(filePath, code, 'utf-8');
        exec(`g++ solution.cpp -o solution.exe`, { cwd: tempDir, timeout: 5000 }, (compileErr, cStdout, cStderr) => {
          if (compileErr) {
            cleanup();
            return resolve({
              stdout: '',
              stderr: cStderr || compileErr.message,
              output: cStderr || compileErr.message,
              exitCode: 1,
              executionTimeMs: Date.now() - startTime,
              error: 'Compilation Error'
            });
          }
          const runChild = spawn(outPath, [], { cwd: tempDir });
          setupListeners(runChild, resolve, cleanup, startTime, stdin);
        });
        return;
      } else {
        cleanup();
        return resolve({
          stdout: '',
          stderr: `Unsupported execution runtime: ${language}`,
          output: `Unsupported execution runtime: ${language}`,
          exitCode: 1,
          executionTimeMs: Date.now() - startTime
        });
      }

      setupListeners(childProcess, resolve, cleanup, startTime, stdin);
    } catch (err: any) {
      cleanup();
      resolve({
        stdout: '',
        stderr: err.message,
        output: err.message,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        error: err.message
      });
    }
  });
}

function setupListeners(
  childProcess: any,
  resolve: (res: ExecutionResult) => void,
  cleanup: () => void,
  startTime: number,
  stdin: string
) {
  let stdoutData = '';
  let stderrData = '';

  const timeoutId = setTimeout(() => {
    try {
      childProcess.kill();
    } catch {}
    cleanup();
    resolve({
      stdout: stdoutData,
      stderr: 'Time Limit Exceeded (5000ms limit)',
      output: stdoutData || 'Time Limit Exceeded',
      exitCode: 124,
      executionTimeMs: 5000,
      error: 'Time Limit Exceeded'
    });
  }, 5000);

  if (stdin) {
    try {
      childProcess.stdin.write(stdin);
      childProcess.stdin.end();
    } catch {}
  } else {
    try {
      childProcess.stdin.end();
    } catch {}
  }

  childProcess.stdout.on('data', (d: any) => {
    stdoutData += d.toString();
  });

  childProcess.stderr.on('data', (d: any) => {
    stderrData += d.toString();
  });

  childProcess.on('close', (code: number) => {
    clearTimeout(timeoutId);
    cleanup();
    const executionTimeMs = Date.now() - startTime;
    resolve({
      stdout: stdoutData.trim(),
      stderr: stderrData.trim(),
      output: (stdoutData.trim() || stderrData.trim()),
      exitCode: code || 0,
      executionTimeMs
    });
  });

  childProcess.on('error', (err: any) => {
    clearTimeout(timeoutId);
    cleanup();
    resolve({
      stdout: stdoutData.trim(),
      stderr: err.message,
      output: err.message,
      exitCode: 1,
      executionTimeMs: Date.now() - startTime,
      error: err.message
    });
  });
}

export async function runCodeWithPiston(
  language: string,
  code: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  // Try remote Piston if not localhost default, otherwise execute locally with high performance
  const shouldUseRemotePiston = config.pistonApiUrl && !config.pistonApiUrl.includes('emkc.org');

  if (shouldUseRemotePiston) {
    try {
      const response = await axios.post(
        `${config.pistonApiUrl}/execute`,
        {
          language: language.toLowerCase(),
          version: '*',
          files: [{ content: code }],
          stdin
        },
        { timeout: 8000 }
      );
      const run = response.data.run || {};
      return {
        stdout: (run.stdout || '').trim(),
        stderr: (run.stderr || '').trim(),
        output: (run.output || run.stdout || run.stderr || '').trim(),
        exitCode: run.code || 0,
        executionTimeMs: 150
      };
    } catch {
      // Fallback directly to local runner
    }
  }

  // Use local execution engine
  return runCodeLocally(language, code, stdin);
}

export async function testCodeAgainstCases(
  language: string,
  code: string,
  testCases: Array<{ id: string; input: string; expected_output: string; is_hidden: boolean }>
) {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const execRes = await runCodeWithPiston(language, code, tc.input);
    const actualOutput = (execRes.stdout || '').trim();
    const expectedOutput = (tc.expected_output || '').trim();

    // Normalizing JSON or whitespace
    let isMatch = actualOutput === expectedOutput;
    if (!isMatch) {
      try {
        const normActual = JSON.stringify(JSON.parse(actualOutput));
        const normExpected = JSON.stringify(JSON.parse(expectedOutput));
        isMatch = normActual === normExpected;
      } catch {
        isMatch = actualOutput.replace(/\s+/g, '') === expectedOutput.replace(/\s+/g, '');
      }
    }

    if (isMatch) passedCount++;

    results.push({
      id: tc.id,
      is_hidden: tc.is_hidden,
      input: tc.is_hidden ? '[Hidden for test evaluation]' : tc.input,
      expected_output: tc.is_hidden ? '[Hidden]' : tc.expected_output,
      actual_output: tc.is_hidden ? (isMatch ? '[Passed Hidden Test]' : '[Failed Hidden Test]') : actualOutput,
      passed: isMatch,
      executionTimeMs: execRes.executionTimeMs,
      stderr: execRes.stderr
    });
  }

  const status = passedCount === testCases.length
    ? 'Accepted'
    : results.some(r => r.stderr)
      ? 'Runtime Error'
      : 'Wrong Answer';

  return {
    status,
    passed_test_cases: passedCount,
    total_test_cases: testCases.length,
    results
  };
}

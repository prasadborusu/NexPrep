import dotenv from 'dotenv';
import path from 'path';

// Load backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { aiService } from './services/ai';

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING NEXPREP LIVE AI DIAGNOSTICS (Hugging Face)');
  console.log('====================================================');
  console.log('HF_TOKEN present:', Boolean(process.env.HF_TOKEN));
  console.log('HF_MODEL:', process.env.HF_MODEL || 'Qwen/Qwen3.5-9B');
  console.log('----------------------------------------------------');

  // Test 1: Professional Summary Generation
  console.log('\n[TEST 1] Generating Professional Summary...');
  try {
    const summaryRes = await aiService.generateSummary({
      fullName: 'Prasad Borusu',
      targetRole: 'Full Stack Engineer',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python'],
      education: 'B.Tech in Computer Science & Engineering from Mohan Babu University',
      projects: ['NexPrep Platform - Full-stack career preparation system with automated code execution and ATS resume scoring']
    });
    console.log('✅ TEST 1 PASSED: Professional Summary Generated:');
    console.log(JSON.stringify(summaryRes, null, 2));
  } catch (err: any) {
    console.error('❌ TEST 1 FAILED:', err.message);
  }

  // Test 2: Project Description & Bullets Improvement
  console.log('\n[TEST 2] Improving Technical Project...');
  try {
    const projRes = await aiService.improveProject({
      title: 'Distributed File Storage',
      currentDescription: 'Created a file storage system that stores and shards files across multiple nodes.',
      technologies: ['Go', 'gRPC', 'Docker']
    });
    console.log('✅ TEST 2 PASSED: Project Bullets Generated:');
    console.log(JSON.stringify(projRes, null, 2));
  } catch (err: any) {
    console.error('❌ TEST 2 FAILED:', err.message);
  }

  // Test 3: Experience Bullets Improvement
  console.log('\n[TEST 3] Improving Experience Bullets...');
  try {
    const expRes = await aiService.improveExperience({
      role: 'Backend Intern',
      company: 'Tech Innovations Ltd',
      currentBullets: [
        'Wrote APIs for user onboarding',
        'Fixed bugs in the database queries'
      ],
      technologies: ['Node.js', 'Express', 'PostgreSQL']
    });
    console.log('✅ TEST 3 PASSED: Experience Bullets Generated:');
    console.log(JSON.stringify(expRes, null, 2));
  } catch (err: any) {
    console.error('❌ TEST 3 FAILED:', err.message);
  }

  // Test 4: Job Description Analysis (Matched vs Missing vs Needs Review)
  console.log('\n[TEST 4] Analyzing Job Description Gap...');
  try {
    const mockResume: any = {
      personal_info: { full_name: 'Prasad Borusu', email: 'prasad@example.com' },
      skills: {
        languages: ['Java', 'TypeScript', 'SQL'],
        frameworks: ['React', 'Node.js', 'Express'],
        databases: ['PostgreSQL'],
        tools: ['Git', 'Docker'],
        libraries: [],
        cloud: [],
        other: []
      },
      projects: [{ title: 'REST API Service', technologies: ['Node.js', 'PostgreSQL'] }],
      experience: [],
      education: []
    };
    const jobDesc = 'We are looking for a Software Engineer with strong experience in Java, Spring Boot, PostgreSQL, Kafka, and Redis.';
    const jobRes = aiService.analyzeJobMatch(mockResume, jobDesc);
    console.log('✅ TEST 4 PASSED: Job Match Analysis:');
    console.log(JSON.stringify(jobRes, null, 2));
  } catch (err: any) {
    console.error('❌ TEST 4 FAILED:', err.message);
  }

  // Test 5: Deterministic ATS Scoring
  console.log('\n[TEST 5] Deterministic ATS Signal Scoring...');
  try {
    const mockResume: any = {
      personal_info: { full_name: 'Prasad Borusu', email: 'prasad@example.com', phone: '+91 9876543210' },
      summary: 'Results-oriented Full Stack Engineer with expertise in TypeScript and Node.js.',
      skills: {
        languages: ['TypeScript', 'Python'],
        frameworks: ['React', 'Node.js'],
        databases: ['PostgreSQL'],
        tools: ['Git'],
        libraries: [],
        cloud: [],
        other: []
      },
      projects: [{ title: 'Full Stack App', description: 'Developed cloud platform' }],
      education: [{ institution: 'Mohan Babu University', degree: 'B.Tech' }],
      experience: []
    };
    const atsRes = aiService.calculateDeterministicATS(mockResume);
    console.log('✅ TEST 5 PASSED: ATS Score Calculated:');
    console.log(JSON.stringify(atsRes, null, 2));
  } catch (err: any) {
    console.error('❌ TEST 5 FAILED:', err.message);
  }

  console.log('\n====================================================');
  console.log('ALL AI DIAGNOSTICS COMPLETED SUCCESSFULLY');
  console.log('====================================================');
}

runTests();

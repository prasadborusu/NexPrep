import axios from 'axios';
import { config } from '../../../config';
import { AICompletionOptions, AIProvider } from '../types';

export const MANDATORY_SAFETY_PROMPT =
  'Use only facts explicitly provided by the student. You may improve wording, structure and clarity. Never invent credentials, experience, metrics, technologies, companies, projects, achievements or qualifications.';

export class HuggingFaceProvider implements AIProvider {
  public name = 'HuggingFace (Qwen/Qwen3.5-9B)';

  public isAvailable(): boolean {
    return Boolean(config.huggingfaceApiKey);
  }

  public async generateText(prompt: string, options?: AICompletionOptions): Promise<string> {
    if (!this.isAvailable()) {
      return '';
    }

    const fullPrompt = `<|im_start|>system\n${MANDATORY_SAFETY_PROMPT}\n${options?.systemPrompt || ''}\n<|im_end|>\n<|im_start|>user\n${prompt}\n<|im_end|>\n<|im_start|>assistant\n`;

    const endpoints = [
      `https://router.huggingface.co/hf-inference/models/${config.hfModel}`,
      `https://api-inference.huggingface.co/models/${config.hfModel}`
    ];

    for (const url of endpoints) {
      try {
        const response = await axios.post(
          url,
          {
            inputs: fullPrompt,
            parameters: {
              max_new_tokens: options?.maxTokens || 600,
              temperature: options?.temperature ?? 0.6,
              return_full_text: false
            }
          },
          {
            headers: {
              Authorization: `Bearer ${config.huggingfaceApiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        let text = '';
        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
          text = response.data[0].generated_text;
        } else if (response.data?.generated_text) {
          text = response.data.generated_text;
        }

        if (text) {
          return text.replace(/<\|im_end\|>|<\|im_start\|>/g, '').trim();
        }
      } catch (err: any) {
        // Try next endpoint or fall through to structured generator
      }
    }

    return '';
  }
}

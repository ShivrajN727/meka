// llm.js
import { getOllamaBaseUrlForModel, getOllamaGenerateOptions } from './ollamaConfig.js';

const DEFAULT_MODEL = 'gemma3:270m';

/** Ollama often returns this when the GPU runner crashes; CPU retry usually works. */
const RUNNER_CRASH_PATTERN =
  /runner process has terminated|llama runner terminated/i;

function mergeOptions(overrides = {}) {
  const fromEnv = getOllamaGenerateOptions();
  const merged = { ...(fromEnv || {}), ...overrides };
  return Object.keys(merged).length ? merged : undefined;
}

async function postGenerate(body, baseUrl) {
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Ollama returned non-JSON (${response.status})`);
  }

  return { response, data };
}

export async function callLLM(prompt, model = DEFAULT_MODEL) {
  try {
    const baseUrl = getOllamaBaseUrlForModel(model);
    const base = {
      model,
      prompt,
      stream: false
    };

    const opts = mergeOptions();
    let body = opts ? { ...base, options: opts } : { ...base };

    let { response, data } = await postGenerate(body, baseUrl);

    const errText = !response.ok || data.error ? String(data.error || '') : '';
    if (
      errText &&
      RUNNER_CRASH_PATTERN.test(errText) &&
      body.options?.num_gpu !== 0
    ) {
      console.warn(
        `[llm] Retrying ${model} with num_gpu=0 after runner crash`
      );
      body = {
        ...base,
        options: mergeOptions({ num_gpu: 0 })
      };
      ({ response, data } = await postGenerate(body, baseUrl));
    }

    if (!response.ok || data.error) {
      throw new Error(data.error || `Ollama error (${response.status})`);
    }
    if (typeof data.response !== 'string') {
      throw new Error('Invalid LLM response');
    }
    return data.response;
  } catch (err) {
    console.error('Ollama error:', err);
    if (err instanceof Error) throw err;
    throw new Error(String(err));
  }
}

export async function callMultipleLLMs(prompt, models = []) {
  const requestedModels =
    Array.isArray(models) && models.length > 0 ? models : [DEFAULT_MODEL];

  const settled = await Promise.allSettled(
    requestedModels.map(async (model) => ({
      model,
      response: await callLLM(prompt, model)
    }))
  );

  return settled.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        model: result.value.model,
        response: result.value.response,
        error: null
      };
    }

    return {
      model: requestedModels[index],
      response: null,
      error: result.reason?.message || 'LLM failed'
    };
  });
}

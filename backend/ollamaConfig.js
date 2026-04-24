/** Base URL for Ollama HTTP API (no trailing slash). */
export const OLLAMA_BASE_URL = (
  process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
).replace(/\/$/, '');

/**
 * Optional JSON map: model name -> Ollama base URL (for hosts where that model works).
 * Use when some tags only run on another machine (e.g. CPU Docker) while Gemma stays local.
 *
 * Example (single extra host for Llama + Phi):
 *   OLLAMA_MODEL_BASES='{"llama3.2:1b":"http://192.168.1.10:11434","phi3:mini":"http://192.168.1.10:11434"}'
 */
let _perModelBasesCache;
let _perModelBasesRaw;

export function getPerModelOllamaBases() {
  const raw = process.env.OLLAMA_MODEL_BASES;
  if (raw === _perModelBasesRaw && _perModelBasesCache) {
    return _perModelBasesCache;
  }
  _perModelBasesRaw = raw;
  if (!raw || !String(raw).trim()) {
    _perModelBasesCache = {};
    return _perModelBasesCache;
  }
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && v.trim()) {
          out[k] = v.replace(/\/$/, '');
        }
      }
      _perModelBasesCache = out;
      return _perModelBasesCache;
    }
  } catch (e) {
    console.warn('OLLAMA_MODEL_BASES must be JSON object of model name -> base URL:', e.message);
  }
  _perModelBasesCache = {};
  return _perModelBasesCache;
}

export function getOllamaBaseUrlForModel(model) {
  const map = getPerModelOllamaBases();
  if (model && map[model]) return map[model];
  return OLLAMA_BASE_URL;
}

/** Model names that have a dedicated Ollama host (for API/UI hints). */
export function getRoutedOllamaModelNames() {
  return Object.keys(getPerModelOllamaBases());
}

/** All distinct Ollama roots to query for /api/tags (merge model lists). */
export function collectOllamaHostsForTags() {
  const hosts = new Set([OLLAMA_BASE_URL]);
  for (const u of Object.values(getPerModelOllamaBases())) {
    hosts.add(u);
  }
  return [...hosts];
}

function parseIntEnv(name) {
  const v = process.env[name];
  if (v === undefined || v === '') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Optional defaults for every /api/generate call.
 * Set OLLAMA_NUM_GPU=0 to force CPU (helps "llama runner process has terminated" on some GPUs).
 * Set OLLAMA_NUM_THREAD=8 to cap threads, etc.
 */
export function getOllamaGenerateOptions() {
  const opts = {};
  const numGpu = parseIntEnv('OLLAMA_NUM_GPU');
  if (numGpu !== undefined) opts.num_gpu = numGpu;
  const numThread = parseIntEnv('OLLAMA_NUM_THREAD');
  if (numThread !== undefined) opts.num_thread = numThread;
  return Object.keys(opts).length ? opts : undefined;
}

'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Live API Playground — Neo-Brutalist                 ║
 * ║  Interactive endpoint testing with JSON preview       ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useRef } from 'react';

const BASE = '/api/v1';

const endpoints = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/v1/health',
    label: 'Health Check',
    desc: 'API status and cache stats',
    params: [],
  },
  {
    id: 'stats',
    method: 'GET',
    path: '/api/v1/stats',
    label: 'API Stats',
    desc: 'Uptime, cache, rate limit info',
    params: [],
  },
  {
    id: 'search',
    method: 'GET',
    path: '/api/v1/search',
    label: 'Search',
    desc: 'Full-text search',
    params: [
      { name: 'q', type: 'text', placeholder: 'e.g. solo leveling', required: true },
    ],
  },
  {
    id: 'series',
    method: 'GET',
    path: '/api/v1/series',
    label: 'Browse Series',
    desc: 'List all series',
    params: [
      { name: 'page', type: 'text', placeholder: '1', required: false },
      { name: 'sort', type: 'select', options: ['popularity_rank', 'rating', 'trending_rank', 'updated_at'], required: false },
      { name: 'genre', type: 'text', placeholder: 'e.g. action', required: false },
    ],
  },
  {
    id: 'series-detail',
    method: 'GET',
    path: '/api/v1/series/{slug}',
    label: 'Series Detail',
    desc: 'Get single series',
    params: [
      { name: 'slug', type: 'text', placeholder: 'e.g. solo-leveling', required: true },
    ],
  },
  {
    id: 'chapters',
    method: 'GET',
    path: '/api/v1/series/{slug}/chapters',
    label: 'Chapters',
    desc: 'Get chapter list',
    params: [
      { name: 'slug', type: 'text', placeholder: 'e.g. nano-machine', required: true },
    ],
  },
  {
    id: 'popular',
    method: 'GET',
    path: '/api/v1/popular',
    label: 'Popular',
    desc: 'Popular series',
    params: [
      { name: 'type', type: 'select', options: ['popular', 'trending'], required: false },
      { name: 'page', type: 'text', placeholder: '1', required: false },
    ],
  },
  {
    id: 'random',
    method: 'GET',
    path: '/api/v1/random',
    label: 'Random',
    desc: 'Random discovery',
    params: [],
  },
  {
    id: 'top',
    method: 'GET',
    path: '/api/v1/top',
    label: 'Top Rated',
    desc: 'Highest rated series',
    params: [
      { name: 'limit', type: 'text', placeholder: '10', required: false },
    ],
  },
  {
    id: 'schedule',
    method: 'GET',
    path: '/api/v1/schedule',
    label: 'Schedule',
    desc: 'Release schedule',
    params: [
      { name: 'day', type: 'select', options: ['', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: false },
    ],
  },
  {
    id: 'genres',
    method: 'GET',
    path: '/api/v1/genres',
    label: 'Genres',
    desc: 'All genres',
    params: [],
  },
];

/* ─── Syntax token colors (inline styles for dangerouslySetInnerHTML) ─── */

const TOK = {
  key:  { color: '#c084fc', fontWeight: 600 },
  str:  { color: '#34d399' },
  num:  { color: '#fbbf24' },
  bool: { color: '#60a5fa', fontWeight: 'bold' },
  null: { color: '#94a3b8', fontStyle: 'italic' },
  op:   { color: '#f472b6' },
  brk:  { color: '#94a3b8' },
};

/* ─── JSON Syntax Highlighter ─── */

function JsonHighlight({ json }) {
  if (!json) return null;
  const str = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  const highlighted = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // keys (before colon)
    .replace(/"([^"\\]*(\\.[^"\\]*)*)"\s*:/g, (match, p1) => {
      return `<span style="color:#c084fc;font-weight:600">"${p1}"</span>:`;
    })
    // strings (remaining quoted values)
    .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
      return `<span style="color:#34d399">${match}</span>`;
    })
    // numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#fbbf24">$1</span>')
    // booleans and null
    .replace(/\b(true|false|null)\b/g, (match) => {
      const color = match === 'null' ? '#94a3b8' : '#60a5fa';
      return `<span style="color:${color};font-weight:bold">${match}</span>`;
    });

  return (
    <pre
      className="p-5 text-[13px] leading-relaxed overflow-x-auto font-mono"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

/* ─── Status Badge ─── */

function StatusBadge({ status }) {
  if (!status) return null;
  const isOk = status >= 200 && status < 300;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold border-2 border-primary ${
      isOk ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {status} {isOk ? 'OK' : status === 404 ? 'Not Found' : status === 429 ? 'Rate Limited' : 'Error'}
    </span>
  );
}

/* ─── Main Component ─── */

export default function ApiPlayground({ compact = false }) {
  const [activeEndpoint, setActiveEndpoint] = useState('search');
  const [params, setParams] = useState({ q: 'solo leveling' });
  const [response, setResponse] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [timing, setTiming] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [responseHeaders, setResponseHeaders] = useState(null);
  const abortRef = useRef(null);

  const ep = endpoints.find(e => e.id === activeEndpoint);

  function buildUrl() {
    if (!ep) return BASE;
    let path = ep.path;
    path = path.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shineiapi.vercel.app';
    const url = new URL(path, origin);
    ep.params.forEach(p => {
      if (p.name !== 'slug' && params[p.name]) {
        url.searchParams.set(p.name, params[p.name]);
      }
    });
    return url.toString();
  }

  async function handleSend() {
    if (loading) return;
    setLoading(true);
    setResponse(null);
    setStatusCode(null);
    setTiming(null);
    setError(null);
    setResponseHeaders(null);

    const url = buildUrl();
    const start = performance.now();

    try {
      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), 10000);
      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);
      const elapsed = Math.round(performance.now() - start);
      setTiming(elapsed);
      setStatusCode(res.status);

      const hdrs = {};
      res.headers.forEach((v, k) => { hdrs[k] = v; });
      setResponseHeaders(hdrs);

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setTiming(elapsed);
      setError(err.name === 'AbortError' ? 'Request timed out (10s)' : err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleParamChange(name, value) {
    setParams(prev => ({ ...prev, [name]: value }));
  }

  const url = buildUrl();

  return (
    <div className={compact ? '' : 'max-w-containerWidth mx-auto'}>
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[320px_1fr]'} gap-0`} style={{ borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* ═══ Left: Endpoint Selector ═══ */}
        <div className="bg-surface-dim border-b-4 lg:border-b-0 lg:border-r-4 border-primary">
          <div className="p-4 border-b-4 border-primary bg-primary text-white">
            <h3 className="font-display font-bold uppercase tracking-tight text-sm">Select Endpoint</h3>
          </div>
          <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
            {endpoints.map(e => (
              <button
                key={e.id}
                onClick={() => {
                  setActiveEndpoint(e.id);
                  setResponse(null);
                  setStatusCode(null);
                  setTiming(null);
                  setError(null);
                  setResponseHeaders(null);
                  const defaults = {};
                  e.params.forEach(p => {
                    if (p.type === 'select' && p.options?.length) defaults[p.name] = p.options[0];
                    else defaults[p.name] = '';
                  });
                  if (e.id === 'search') defaults.q = 'solo leveling';
                  if (e.id === 'series-detail' || e.id === 'chapters') defaults.slug = 'solo-leveling';
                  setParams(defaults);
                }}
                className={`w-full text-left p-3 border-b-2 border-primary/20 transition-all min-h-[52px] ${
                  activeEndpoint === e.id
                    ? 'bg-accent border-l-8 border-l-primary'
                    : 'hover:bg-accent/20 border-l-8 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border border-primary ${
                    activeEndpoint === e.id ? 'bg-primary text-white' : 'bg-surface text-primary'
                  }`}>
                    {e.method}
                  </span>
                  <span className="font-display font-bold text-xs uppercase tracking-tight">{e.label}</span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono truncate">{e.path}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Right: Playground ═══ */}
        <div className="flex flex-col">
          {/* URL Bar */}
          <div className="p-3 sm:p-4 border-b-4 border-primary bg-surface-bright">
            <div className="flex flex-col sm:flex-row items-stretch gap-0 border-4 border-primary">
              <span className="bg-primary text-white font-mono font-bold text-xs px-3 py-2 sm:py-0 flex items-center shrink-0 justify-center sm:justify-start">
                GET
              </span>
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 font-mono text-xs sm:text-sm bg-white text-primary outline-none min-w-0 border-t-4 sm:border-t-0 border-primary sm:border-0"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className={`font-display font-bold uppercase text-xs tracking-widest px-6 py-2.5 sm:py-0 border-t-4 sm:border-t-0 sm:border-l-4 border-primary transition-all ${
                  loading
                    ? 'bg-stone-400 text-white cursor-wait'
                    : 'bg-accent text-primary hover:bg-primary hover:text-white active:translate-y-0.5 active:translate-x-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending
                  </span>
                ) : 'Send'}
              </button>
            </div>
          </div>

          {/* Parameters */}
          {ep && ep.params.length > 0 && (
            <div className="p-4 border-b-4 border-primary bg-surface-dim">
              <div className="text-[10px] font-display font-bold uppercase tracking-widest text-stone-500 mb-3">Parameters</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ep.params.map(p => (
                  <div key={p.name} className="flex items-center gap-2">
                    <label className="text-xs font-mono font-bold text-primary shrink-0 w-16">
                      {p.name}
                      {p.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {p.type === 'select' ? (
                      <select
                        value={params[p.name] || ''}
                        onChange={e => handleParamChange(p.name, e.target.value)}
                        className="flex-1 px-2 py-1.5 text-sm font-mono border-2 border-primary bg-white text-primary outline-none focus:border-accent"
                      >
                        {p.options.map(opt => (
                          <option key={opt} value={opt}>{opt || '(all)'}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={params[p.name] || ''}
                        onChange={e => handleParamChange(p.name, e.target.value)}
                        placeholder={p.placeholder}
                        className="flex-1 px-2 py-1.5 text-sm font-mono border-2 border-primary bg-white text-primary outline-none focus:border-accent placeholder:text-stone-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response */}
          <div className="flex-1 min-h-0">
            {/* Response Header Bar */}
            <div className="px-4 py-3 border-b-4 border-primary bg-surface flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-xs uppercase tracking-widest text-stone-500">Response</span>
                {statusCode && <StatusBadge status={statusCode} />}
                {timing !== null && (
                  <span className="text-xs font-mono text-stone-500 border-2 border-primary/20 px-2 py-0.5">
                    {timing}ms
                  </span>
                )}
              </div>
              {responseHeaders && (
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 hover:text-primary border-2 border-primary/20 px-2 py-1 hover:border-primary transition-all"
                >
                  {showHeaders ? 'Hide' : 'Show'} Headers
                </button>
              )}
            </div>

            {/* Headers Panel */}
            {showHeaders && responseHeaders && (
              <div className="border-b-4 border-primary bg-surface-dim p-4">
                <div className="text-[10px] font-display font-bold uppercase tracking-widest text-stone-500 mb-2">Response Headers</div>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(responseHeaders).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-xs font-mono">
                      <span className="text-emerald-600 font-bold shrink-0">{k}:</span>
                      <span className="text-stone-600 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JSON Response Body */}
            <div className="bg-[#0d1117] min-h-[200px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] overflow-auto">
              {error ? (
                <div className="p-6 text-center">
                  <div className="inline-block bg-red-500/20 border-2 border-red-500 px-4 py-3 mb-3">
                    <span className="text-red-400 font-display font-bold uppercase text-sm">Error</span>
                  </div>
                  <p className="text-red-300 text-sm font-mono">{error}</p>
                </div>
              ) : response ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                    }}
                    className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase tracking-wider text-white/30 hover:text-white border border-white/10 hover:border-white/30 px-2 py-1 transition-all z-10 hover:bg-white/5"
                  >
                    Copy
                  </button>
                  <JsonHighlight json={response} />
                </div>
              ) : (
                <div className="p-6 text-center flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px]">
                  <div className="w-16 h-16 border-4 border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 15l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-sm font-mono">Select an endpoint and click Send</p>
                  <p className="text-white/15 text-xs font-mono mt-1">Live JSON response will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

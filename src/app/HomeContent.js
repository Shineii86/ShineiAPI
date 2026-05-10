'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Landing Page — Client Component (interactive)       ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import ApiPlayground from '@/components/ApiPlayground';
import LandingNav from '@/components/LandingNav';
import { useState, useEffect, useRef } from 'react';
import {
  IconBook, IconArrowRight, IconGithub, IconStarFilled,
  IconExternalLink, IconStar, IconCopy, IconCheck,
  IconCode, IconSparkles, IconHeart,
} from '@/components/icons';
import { features, endpoints, stats, recipes } from './page.data';

/* ─── Intersection Observer Hook ─── */

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1, ...options });
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

/* ─── Animated Counter ─── */

function AnimCounter({ value, suffix = '' }) {
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value.replace(/\D/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * num) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value, suffix]);
  return <span ref={ref}>{display}</span>;
}

/* ─── Copy Button ─── */

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked — silently fail
    }
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label={copied ? 'Copied!' : 'Copy code'}>
      {copied ? <><IconCheck size={12} className="text-green-400" /> Copied</> : <><IconCopy size={12} /> Copy</>}
    </button>
  );
}

/* ─── Reveal Wrapper ─── */

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Stat Item ─── */

function StatItem({ stat, index }) {
  const Icon = stat.icon;
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-12 h-12 bg-accent flex items-center justify-center text-primary" style={{ borderRadius: 12 }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-3xl font-bold font-display leading-none">
          <AnimCounter value={stat.value} />
        </div>
        <div className="text-[11px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{stat.label}</div>
      </div>
    </div>
  );
}

/* ─── Feature Card ─── */

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`card-brutal group transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="w-12 h-12 bg-accent flex items-center justify-center mb-4 text-primary transition-all duration-300 group-hover:-translate-y-1" style={{ borderRadius: 12 }}>
        <Icon size={20} />
      </div>
      <h3 className="text-base font-bold uppercase font-display mb-2">{feature.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
    </div>
  );
}

/* ─── Endpoint Row ─── */

function EndpointRow({ ep, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-surface-bright hover:shadow-brutal hover:-translate-y-0.5 transition-all duration-200 group ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
      style={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'var(--shadow-sm)' }}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <span className="method-get w-fit">{ep.method}</span>
      <code className="text-sm font-mono flex-1 font-medium">{ep.path}</code>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider hidden sm:block sm:shrink-0">{ep.desc}</span>
    </div>
  );
}

/* ─── Page ─── */

export default function HomeContent() {
  const [activeRecipe, setActiveRecipe] = useState('search');
  const [starCount, setStarCount] = useState(null);
  const [heroRef, heroInView] = useInView();

  useEffect(() => {
    fetch('https://api.github.com/repos/Shineii86/ShineiAPI')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.stargazers_count) setStarCount(d.stargazers_count); })
      .catch(() => {});
  }, []);

  const currentRecipe = recipes.find(r => r.id === activeRecipe);

  return (
    <main className="min-h-screen">
      <LandingNav />

      {/* ═══════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 md:pt-36 md:pb-28 px-4 sm:px-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          {/* Status badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 pill-tag text-xs font-bold font-mono uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              v2.0.2 — Live &amp; Free
            </div>
          </Reveal>

          {/* Main headline */}
          <Reveal delay={100}>
            <h1 className="font-display text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.95] mb-8 tracking-tighter">
              <span className="block">The API for</span>
              <span className="block text-secondary">Manga &amp; Manhwa</span>
              <span className="block">Data</span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={200}>
            <div className="pl-6 mb-10" style={{ borderLeft: '3px solid rgba(0,0,0,0.12)' }}>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Search thousands of series. Get chapters, ratings, cover art.
                No API key. No signup. Just build.
              </p>
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={300}>
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="/docs" className="btn-brutal">
                View Documentation <IconArrowRight size={18} />
              </Link>
              <Link href="/browse" className="btn-brutal-outline">
                <IconBook size={18} /> Explore Series
              </Link>
              <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="btn-brutal-outline">
                <IconGithub size={18} /> Star on GitHub
              </a>
            </div>
          </Reveal>

          {/* Terminal demo */}
          <Reveal delay={500}>
            <div className="code-brutal max-w-3xl overflow-hidden">
              <div className="code-brutal-header">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-secondary rounded-full" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-accent rounded-full" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-white/40 font-mono truncate">GET /api/v1/series/nano-machine</span>
                </div>
                <span className="method-get !text-[9px] !py-0.5 !px-2 shrink-0 hidden sm:inline-flex">200 OK</span>
              </div>
              <pre className="p-3 sm:p-5 text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto">
                <code>
                  <span className="t-brk">{'{'}</span>{'\n  '}
                  <span className="t-key">&quot;success&quot;</span><span className="t-op">: </span><span className="t-bool">true</span><span className="t-op">,</span>{'\n  '}
                  <span className="t-key">&quot;data&quot;</span><span className="t-op">: </span><span className="t-brk">{'{'}</span>{'\n    '}
                  <span className="t-key">&quot;title&quot;</span><span className="t-op">: </span><span className="t-str">&quot;Nano Machine&quot;</span><span className="t-op">,</span>{'\n    '}
                  <span className="t-key">&quot;rating&quot;</span><span className="t-op">: </span><span className="t-num">9.6</span><span className="t-op">,</span>{'\n    '}
                  <span className="t-key">&quot;status&quot;</span><span className="t-op">: </span><span className="t-str">&quot;Releasing&quot;</span><span className="t-op">,</span>{'\n    '}
                  <span className="t-key">&quot;genres&quot;</span><span className="t-op">: </span><span className="t-brk">[</span><span className="t-str">&quot;Action&quot;</span><span className="t-op">, </span><span className="t-str">&quot;Fantasy&quot;</span><span className="t-op">, </span><span className="t-str">&quot;Martial Arts&quot;</span><span className="t-brk">]</span><span className="t-op">,</span>{'\n    '}
                  <span className="t-key">&quot;chapters_available&quot;</span><span className="t-op">: </span><span className="t-num">310</span>{'\n  '}
                  <span className="t-brk">{'}'}</span>{'\n'}
                  <span className="t-brk">{'}'}</span>
                </code>
              </pre>
            </div>
          </Reveal>

          {/* Scroll indicator */}
          <Reveal delay={700} className="mt-14 flex flex-col items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-gray-500 animate-bounce">
              <path d="M8 4v12m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 bg-surface-dim" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <StatItem key={i} stat={s} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ARCHITECTURE
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="reveal inline-block mb-4">
              <span className="pill-tag bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-wider">
                <IconLayers size={13} /> Architecture
              </span>
            </div>
            <h2 className="reveal d1 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 tracking-tight leading-tight">
              How It Works<br />
              <span className="text-secondary">Under the Hood</span>
            </h2>
            <p className="reveal d2 text-gray-600 max-w-xl mx-auto text-lg">
              ShineiAPI sits between raw upstream data and your application — normalizing, caching, and protecting.
            </p>
          </div>

          <div className="reveal d3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="card-brutal">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-tertiary text-white flex items-center justify-center text-sm font-bold font-mono" style={{ borderRadius: 10 }}>01</span>
                <span className="text-xs font-mono text-tertiary uppercase tracking-[0.15em] font-bold">Source</span>
              </div>
              <div className="w-14 h-14 bg-tertiary/10 flex items-center justify-center mb-5 text-tertiary" style={{ borderRadius: 14, border: '1.5px solid rgba(0,85,255,0.15)' }}>
                <IconDatabase size={24} />
              </div>
              <h3 className="text-lg font-bold uppercase font-display mb-2">Toraka API</h3>
              <p className="text-sm text-gray-600">Raw manga &amp; manhwa data from the upstream provider</p>
            </div>

            {/* Step 2 */}
            <div className="card-brutal relative" style={{ borderColor: 'rgba(230,59,46,0.2)', boxShadow: '0 4px 16px rgba(230,59,46,0.08)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="pill-tag bg-secondary text-white text-[10px] font-bold uppercase tracking-wider">Core</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-secondary text-white flex items-center justify-center text-sm font-bold font-mono" style={{ borderRadius: 10 }}>02</span>
                <span className="text-xs font-mono text-secondary uppercase tracking-[0.15em] font-bold">Middleware</span>
              </div>
              <div className="w-14 h-14 bg-secondary/10 flex items-center justify-center mb-5 text-secondary" style={{ borderRadius: 14, border: '1.5px solid rgba(230,59,46,0.15)' }}>
                <IconZap size={24} />
              </div>
              <h3 className="text-lg font-bold uppercase font-display mb-3">ShineiAPI</h3>
              <div className="flex flex-wrap gap-2">
                {['Caching', 'Rate Limiting', 'Normalization', 'Error Handling'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 text-[11px] font-mono font-bold text-gray-600 bg-surface-dim" style={{ borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-brutal">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-green-500 text-primary flex items-center justify-center text-sm font-bold font-mono" style={{ borderRadius: 10 }}>03</span>
                <span className="text-xs font-mono text-green-700 uppercase tracking-[0.15em] font-bold">Output</span>
              </div>
              <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center mb-5 text-green-700" style={{ borderRadius: 14, border: '1.5px solid rgba(34,197,94,0.15)' }}>
                <IconCode size={24} />
              </div>
              <h3 className="text-lg font-bold uppercase font-display mb-2">Clean JSON</h3>
              <p className="text-sm text-gray-600">Consistent, well-structured responses ready for your app</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-surface-dim" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="reveal inline-block mb-4">
              <span className="pill-tag bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <IconSparkles size={13} /> Capabilities
              </span>
            </div>
            <h2 className="reveal d1 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 tracking-tight leading-tight">
              Everything You Need<br />
              <span className="text-secondary">to Ship Faster</span>
            </h2>
            <p className="reveal d2 text-gray-600 max-w-xl mx-auto text-lg">
              A complete API for building manga trackers, recommendation engines, and discovery tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          API REFERENCE
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="reveal inline-block mb-4">
              <span className="pill-tag bg-green-500/15 text-green-700 text-xs font-bold uppercase tracking-wider">
                <IconTerminal size={13} /> API Reference
              </span>
            </div>
            <h2 className="reveal d1 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 tracking-tight leading-tight">
              Clean, Predictable<br />
              <span className="text-tertiary">Endpoints</span>
            </h2>
            <p className="reveal d2 text-gray-600 max-w-xl mx-auto text-lg">
              Every response follows the same envelope format. No surprises.
            </p>
          </div>

          <div className="space-y-3">
            {endpoints.map((ep, i) => (
              <EndpointRow key={i} ep={ep} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          QUICK START
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-surface-dim" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="reveal inline-block mb-4">
              <span className="pill-tag bg-accent/20 text-primary text-xs font-bold uppercase tracking-wider">
                <IconCode size={13} /> Quick Start
              </span>
            </div>
            <h2 className="reveal d1 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 tracking-tight leading-tight">
              Common<br />
              <span className="text-tertiary">Recipes</span>
            </h2>
            <p className="reveal d2 text-gray-600 max-w-xl mx-auto text-lg">
              Real-world code snippets to get you building immediately. Copy, paste, ship.
            </p>
          </div>

          {/* Tabs */}
          <div className="reveal d2 flex sm:flex-row gap-2 mb-8 justify-start sm:justify-center overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0" role="tablist" aria-label="Code recipes">
            {recipes.map(recipe => {
              const Icon = recipe.icon;
              const isActive = activeRecipe === recipe.id;
              return (
                <button key={recipe.id} role="tab" aria-selected={isActive} onClick={() => setActiveRecipe(recipe.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${isActive ? 'bg-accent text-primary shadow-brutal-sm' : 'bg-surface text-gray-600 hover:bg-accent/30'}`}
                  style={{ borderRadius: 10, border: isActive ? '1.5px solid rgba(0,0,0,0.1)' : '1.5px solid rgba(0,0,0,0.06)' }}>
                  <Icon size={15} /> {recipe.title}
                </button>
              );
            })}
          </div>

          {/* Active Recipe */}
          {currentRecipe && (
            <div role="tabpanel" className="reveal d3 grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2 card-brutal flex flex-col justify-center">
                <div className="w-14 h-14 bg-accent flex items-center justify-center mb-6 text-primary" style={{ borderRadius: 14 }}>
                  <currentRecipe.icon size={24} />
                </div>
                <h3 className="text-xl font-bold uppercase font-display mb-3">{currentRecipe.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{currentRecipe.desc}</p>
              </div>
              <div className="lg:col-span-3 code-brutal">
                <div className="code-brutal-header">
                  <span className="text-xs font-mono text-white/40 font-medium">{currentRecipe.lang}</span>
                  <CopyButton text={currentRecipe.code} />
                </div>
                <pre className="p-3 sm:p-5 text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto">
                  <code className="text-green-400 whitespace-pre">{currentRecipe.code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          LIVE API PLAYGROUND
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-surface" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 mb-6">
              <span className="pill-tag bg-tertiary/10 text-tertiary text-xs font-bold font-mono uppercase tracking-wider"><IconCode size={13} /> Live</span>
            </div>
            <h2 className="reveal d1 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight uppercase">
              Try It <span className="bg-accent text-primary px-2 sm:px-4 py-1 sm:py-2 inline-block sm:transform sm:-rotate-1" style={{ borderRadius: 12 }}>Now</span>
            </h2>
            <p className="reveal d2 text-stone-600 max-w-xl mx-auto text-lg">
              Select an endpoint, configure parameters, and see live JSON responses. No API key needed.
            </p>
          </div>
          <div className="reveal d3">
            <ApiPlayground />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SOCIAL PROOF / CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="reveal card-brutal group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-accent flex items-center justify-center" style={{ borderRadius: 14 }}>
                <IconStarFilled size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold font-display">
                  {starCount !== null ? `${starCount}+` : '50+'}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">GitHub Stars</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">Join developers who trust ShineiAPI for their manga projects.</p>
            <a href="https://github.com/Shineii86/ShineiAPI/stargazers" target="_blank" rel="noopener noreferrer" className="btn-brutal-outline !py-2.5 !px-5 !text-xs">
              <IconStar size={15} /> Star on GitHub
            </a>
          </div>

          <div className="reveal d2 card-brutal group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-tertiary/10 flex items-center justify-center" style={{ borderRadius: 14, border: '1.5px solid rgba(0,85,255,0.15)' }}>
                <IconExternalLink size={24} className="text-tertiary" />
              </div>
              <div>
                <div className="text-xl font-bold font-display uppercase">Missing a Source?</div>
                <div className="text-xs text-gray-500 font-bold">We&apos;re actively expanding</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">Request new sources, endpoints, or features on GitHub.</p>
            <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="btn-brutal-outline !py-2.5 !px-5 !text-xs">
              <IconGithub size={15} /> Open an Issue
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-primary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase mb-6 tracking-tight leading-tight">
            Ready to<br />
            <span className="text-accent">Build?</span>
          </h2>
          <p className="text-white/70 mb-10 max-w-lg mx-auto text-lg">
            Start using ShineiAPI today. Free, fast, and requires no authentication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/docs" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider bg-accent text-primary transition-all duration-200 hover:bg-yellow-300 hover:shadow-lg" style={{ borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)' }}>
              Explore the API <IconArrowRight size={18} />
            </Link>
            <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider bg-transparent text-white hover:bg-white/10 transition-all duration-200" style={{ borderRadius: 12, border: '2px solid rgba(255,255,255,0.25)' }}>
              <IconBook size={16} /> Browse Series
            </Link>
            <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider bg-transparent text-white hover:bg-white/10 transition-all duration-200" style={{ borderRadius: 12, border: '2px solid rgba(255,255,255,0.25)' }}>
              Report an Issue
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: '"Noto Serif JP", serif' }}>
                水
              </div>
              <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
              <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.2</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">GitHub</a>
              <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">License</a>
              <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Terms</Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Privacy</Link>
              <Link href="/support" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-bold uppercase tracking-wider">Support</Link>
            </div>
            <p className="text-sm text-white/40">
              Built with <IconHeart size={14} className="heartbeat" /> by <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">Shinei Nouzen</a>
            </p>
          </div>
          <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/30">Data provided by <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors">Toraka</a>. ShineiAPI is not affiliated with or endorsed by Toraka.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Unused but available for architecture section ─── */
function IconDatabase(props) {
  return (
    <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || ''}>
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
  );
}

function IconZap(props) {
  return (
    <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || ''}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

function IconLayers(props) {
  return (
    <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || ''}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function IconTerminal(props) {
  return (
    <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || ''}>
      <polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>
    </svg>
  );
}

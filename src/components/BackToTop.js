'use client';
import { useState, useEffect } from 'react';
import { IconArrowRight } from '@/components/icons';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 bg-accent border-4 border-primary shadow-brutal flex items-center justify-center text-primary hover:bg-primary hover:text-white active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-150 animate-fade-in"
      aria-label="Back to top"
    >
      <IconArrowRight size={18} className="rotate-[-90deg]" />
    </button>
  );
}

// Minimal wrapper to import GSAP-based client code if present. If you have a larger gsap-client module in src/scripts, copy it here as well.
import gsap from 'https://cdn.skypack.dev/gsap';
// Example: simple fade-in for .hero-stage when present
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-stage');
  if (hero) {
    try { gsap.from(hero, { opacity: 0, y: 20, duration: 0.8 }); } catch (e) { /* ignore */ }
  }
});

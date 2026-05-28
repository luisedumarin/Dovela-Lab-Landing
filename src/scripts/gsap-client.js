import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// HERO timeline + simple scroll reveals (extracted from original site)
const heroImg = document.querySelector('.hero-stage img');
const heroCard = document.querySelector('.hero-form-card');
// Mantener la imagen del hero estática según el diseño. Solo animar la tarjeta del formulario.
if (heroCard) {
  const htl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  // No animar transform aqui: en mobile se usa para centrar la tarjeta del hero.
  htl.from(heroCard, { opacity: 0, duration: 0.6 }, '0');
}

// Scroll reveals
gsap.utils.toArray('.reveal').forEach((el, i) => {
  gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, y: 0, opacity: 1, duration: 0.78, ease: 'power2.out', delay: (i % 3) * 0.06 });
});
gsap.utils.toArray('.reveal-l').forEach((el) => {
  gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, x: 0, opacity: 1, duration: 0.72, ease: 'power2.out' });
});
gsap.utils.toArray('.reveal-r').forEach((el) => {
  gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, x: 0, opacity: 1, duration: 0.72, ease: 'power2.out' });
});
gsap.utils.toArray('.reveal-s').forEach((el, i) => {
  gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out', delay: i * 0.08 });
});

// Fechas y sesiones metric cards
gsap.utils.toArray('[data-metric-card]').forEach((el) => {
  gsap.fromTo(el, { y: 10, opacity: 0.85 }, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    y: 0,
    opacity: 1,
    duration: 0.45,
    ease: 'power2.out',
  });

  el.addEventListener('mouseenter', () => {
    gsap.to(el, { y: -6, scale: 1.03, duration: 0.2, ease: 'power2.out' });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { y: 0, scale: 1, duration: 0.22, ease: 'power2.out' });
  });
});

// Fechas y sesiones feature cards
gsap.utils.toArray('[data-fs-card]').forEach((el) => {
  gsap.fromTo(el, { y: 12, opacity: 0.9 }, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    y: 0,
    opacity: 1,
    duration: 0.45,
    ease: 'power2.out',
  });
});

// Stats counters (simple)
if (document.querySelector('.stats-band')) {
  ScrollTrigger.create({ trigger: '.stats-band', start: 'top 80%', onEnter: () => {
    document.querySelectorAll('.stat-n[data-target]').forEach(el => {
      const t = +el.dataset.target;
      el.textContent = (t === 98 ? `${t}%` : `${t}+`);
    });
  }});
}

// Progress bars
ScrollTrigger.create({ trigger: '#cursos', start: 'top 70%', onEnter: () => {
  document.querySelectorAll('.prog-fill').forEach(b => b.style.width = b.dataset.w + '%');
}});

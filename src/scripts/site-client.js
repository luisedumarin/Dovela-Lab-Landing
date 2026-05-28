// Cliente: cursor, nav, hamburger, FAQ, formularios y chat
document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  window.dovelaWhatsAppUrl = 'https://wa.me/528116076954?text=%C2%A1Hola!%20Necesito%20informaci%C3%B3n';

  window.softResetDovelaForms = () => {
    document.querySelectorAll('form').forEach(form => {
      try { form.reset(); } catch (e) { /* ignore */ }
    });

    document.querySelectorAll('#hero-ok, #cf-ok').forEach(ok => {
      try {
        ok.style.display = 'none';
      } catch (e) { /* ignore */ }
    });
  };

  document.querySelectorAll('.wa-btn[data-wa-url]').forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const url = btn.getAttribute('data-wa-url') || window.dovelaWhatsAppUrl;
      if (!url) return;
      window.softResetDovelaForms?.();
      window.open(url, '_blank', 'noopener,noreferrer');
      btn.blur();
    });
  });

  document.querySelectorAll('[data-reset-home]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.softResetDovelaForms?.();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.history?.replaceState) {
        history.replaceState(null, '', '/');
      }
      const hamburger = document.getElementById('hamburger');
      const mobileNav = document.getElementById('mobile-nav');
      if (hamburger && mobileNav) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
      }
      if (typeof link.blur === 'function') link.blur();
    });
  });

  // CURSOR (ocultar en touch)
  const cur = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if (cur && curR) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
    (function lp(){ rx += (mx - rx) * .13; ry += (my - ry) * .13; curR.style.left = rx + 'px'; curR.style.top = ry + 'px'; requestAnimationFrame(lp); })();
    document.querySelectorAll('a,button,.faq-q,.tc-card,.cc,.soc-link').forEach(el=>{
      el.addEventListener('mouseenter',()=>document.body.classList.add('cur-h'));
      el.addEventListener('mouseleave',()=>document.body.classList.remove('cur-h'));
    });
  }

  // NAV scroll effect
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 20));

  // HASH LINKS: center section on arrival instead of landing too low
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      history.replaceState(null, '', href);
    });
  });

  // HAMBURGER
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', ()=>{
      const open = hamburger.classList.toggle('open');
      if(open){
        mobileNav.style.display = 'flex';
        mobileNav.setAttribute('aria-hidden','false');
        hamburger.setAttribute('aria-expanded','true');
        requestAnimationFrame(()=>mobileNav.classList.add('open'));
        document.body.classList.add('mobile-menu-open');
        // Reducir hero en mobile cuando el menú está abierto
        const heroStage = document.querySelector('.hero-stage');
        const heroImg = document.getElementById('hero-img');
        if(heroStage) heroStage.style.minHeight = '56vh';
        if(heroImg) heroImg.style.height = '40vh';
      }
      else{
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden','true');
        hamburger.setAttribute('aria-expanded','false');
        setTimeout(()=>mobileNav.style.display='none',280);
        document.body.classList.remove('mobile-menu-open');
        const heroStage = document.querySelector('.hero-stage');
        const heroImg = document.getElementById('hero-img');
        if(heroStage){ heroStage.style.minHeight = ''; }
        if(heroImg){ heroImg.style.height = ''; }
      }
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
      hamburger.classList.remove('open'); mobileNav.classList.remove('open'); setTimeout(()=>mobileNav.style.display='none',280); document.body.style.overflow='';
    }));
  }

  // FAQ: use <details> fallback if present, else toggle classic
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.parentElement, was = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!was) item.classList.add('open');
    });
  });

  // FORMS: generic handler
  function escapeHtml(str){ return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function buildMailtoUrl(recipient, subject, bodyLines) {
    const subjectText = encodeURIComponent(subject);
    const bodyText = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:${recipient}?subject=${subjectText}&body=${bodyText}`;
  }

  function handleLeadSubmit(formId, okId, requiredIds, mailSubject, bodyBuilder){
    const form = document.getElementById(formId);
    if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const missing = requiredIds.some(id => { const el = document.getElementById(id); return !el || !el.value.trim(); });
        if(missing){ alert('Por favor completa todos los campos del formulario antes de enviar.'); return; }
      const btn = this.querySelector('.cf-submit');
      if (btn) {
        btn.textContent = 'Enviando…';
        btn.disabled = true;
      }

      // Decide endpoint: prefer form `data-endpoint` (e.g., Formspree). Fallback to server `/api/send-lead`.
      const formEndpoint = this.getAttribute('data-endpoint')?.trim();
      const targetUrl = formEndpoint && formEndpoint.length > 0 ? formEndpoint : '/api/send-lead';

      try {
        let res;
        // If using Formspree (or any external form endpoint), send as FormData for widest compatibility
        if (formEndpoint && formEndpoint.includes('formspree.io')) {
          const fd = new FormData(this);
          // Añadir _replyto y _subject para Formspree
          const emailEl = this.querySelector('input[name="email"], input[type="email"], input[id*="email"]');
          if (emailEl && emailEl.value) fd.set('_replyto', emailEl.value);
          if (mailSubject) fd.set('_subject', mailSubject);
          res = await fetch(targetUrl, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        } else {
          const payload = {};
          this.querySelectorAll('input,textarea,select').forEach(el => {
            const key = el.name || el.id;
            if (!key) return;
            payload[key] = el.value || '';
          });
          res = await fetch(targetUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }

        if (!res.ok) throw new Error('Error en el servidor');
        const ok = document.getElementById(okId);
        if (ok) {
          // Mostrar mensaje minimalista para hero/cta: solo "Mensaje enviado" y añadir separación
          if (okId === 'hero-ok' || okId === 'cf-ok') {
            ok.innerHTML = `
              <div style="font-size:2rem;margin-bottom:6px">✅</div>
              <p style="margin:0;font-weight:700">Mensaje enviado</p>
            `;
            ok.style.display = 'block';
            ok.style.background = '#ffffff';
            ok.style.color = '#111111';
            ok.style.marginTop = '1rem';
            ok.style.paddingTop = ok.style.paddingTop || '';
          } else {
            ok.style.display = 'block';
          }
          // Resetear formulario para devolver estado limpio
          try { this.reset(); } catch (e) { /* ignore */ }
          // Ocultar mensaje después de 4s
          setTimeout(()=>{ try{ ok.style.display='none'; }catch(e){} }, 4000);
        }
      } catch (err) {
        alert('Ocurrió un error al enviar. Intenta de nuevo.');
        console.error(err);
      } finally {
        if (btn) { btn.textContent = 'Quiero Información'; btn.disabled = false; }
      }
    });
  }

  handleLeadSubmit(
    'heroLeadForm',
    'hero-ok',
    ['hf-nombre', 'hf-apellido', 'hf-email', 'hf-tel', 'hf-interes'],
    'Nueva solicitud desde el formulario rápido',
    () => {
      const nombre = document.getElementById('hf-nombre')?.value.trim() || '';
      const email = document.getElementById('hf-email')?.value.trim() || '';
      const telefono = document.getElementById('hf-tel')?.value.trim() || '';
      const interes = document.getElementById('hf-interes')?.value.trim() || 'No especificado';
      return [
        'Hola equipo de Dovela Lab,',
        '',
        'Se registró una nueva solicitud desde el formulario rápido:',
        `Nombre: ${nombre}`,
        `Correo: ${email}`,
        `WhatsApp / Teléfono: ${telefono}`,
        `Interés principal: ${interes}`,
      ];
    }
  );

  handleLeadSubmit(
    'contactForm',
    'cf-ok',
    ['cf-nombre', 'cf-apellido', 'cf-email', 'cf-tel', 'cf-curso'],
    'Nueva Solicitud de Información',
    () => {
      const nombre = document.getElementById('cf-nombre')?.value.trim() || '';
      const apellido = document.getElementById('cf-apellido')?.value.trim() || '';
      const email = document.getElementById('cf-email')?.value.trim() || '';
      const telefono = document.getElementById('cf-tel')?.value.trim() || 'No especificado';
      const curso = document.getElementById('cf-curso')?.value.trim() || 'No especificado';
      const mensaje = document.getElementById('cf-msg')?.value.trim() || 'Sin mensaje adicional';
      return [
        'Hola Equipo de Dovela Lab,',
        '',
        'Se Registró una Nueva Solicitud de Información:',
        `Nombre: ${nombre}`,
        `Apellido: ${apellido}`,
        `Correo: ${email}`,
        `WhatsApp / Teléfono: ${telefono}`,
        `Curso de Interés: ${curso}`,
        `Mensaje: ${mensaje}`,
      ];
    }
  );

  // CHATBOX simple toggle
  const cfab = document.getElementById('cfab');
  const cbox = document.getElementById('cbox');
  const cxb = document.getElementById('cxb');
  const cmsg = document.getElementById('cmsg');
  const copts = document.getElementById('copts');
  const crst = document.getElementById('crst');
  if(cfab && cbox){
    cfab.addEventListener('click', ()=>{
      cbox.classList.toggle('open'); const nb = document.querySelector('.nb'); if(nb) nb.style.display='none';
      if(cbox.classList.contains('open') && cmsg && cmsg.children.length===0) setTimeout(()=>{ addMsg('¡Hola! 👋 Soy el Asistente de Dovela Lab. ¿En qué te Puedo Ayudar?','bot'); }, 150);
    });
  }
  if(cxb && cbox) cxb.addEventListener('click', ()=> cbox.classList.remove('open'));

  const A = {
    cursos:{q:'📚 ¿Qué Cursos Tienen?',a:'Tenemos 4 cursos por Ahora:\n\n📐 Proyecto Ejecutivo Básico en BIM\n🔗 Introducción a la Metodología BIM\n⚙️ Proyecto MEP Básico en Revit\n🏢 Taller de Láminas Arquitectónicas\n\nTodos incluyen certificado digital 🎓'},
    precio:{q:'💰 ¿Cuánto Cuestan?',a:'Los cursos los tenemos en promoción a $699 MXN:\n\n• becas 20% para estudiantes\n• Planes corporativos disponibles\n\n'},
    sesiones:{q:'🔧 ¿Cuándo Son las Sesiones Prácticas?',a:'Cada sábado y domingo en Monterrey o en línea.'},
    modalidad:{q:'💻 ¿Hay Clases en Línea?',a:'Sí. En línea, presencial y híbrida.'},
    nivel:{q:'🎯 ¿Qué Curso es Para Mí?',a:'Depende de tu perfil. Comunícate con nosotros Para una evaluación personalizada.'}
  };

  function addMsg(txt, type){ if(!cmsg) return; const d = document.createElement('div'); d.className='msg '+type; d.textContent = txt; cmsg.appendChild(d); cmsg.scrollTop = cmsg.scrollHeight; }
  function showTyping(cb){ if(!cmsg) return; const t = document.createElement('div'); t.className='msg bot dots'; t.innerHTML='<span></span><span></span><span></span>'; cmsg.appendChild(t); cmsg.scrollTop = cmsg.scrollHeight; setTimeout(()=>{ t.remove(); cb(); }, 920); }

  document.querySelectorAll('.cop').forEach(btn=>{
    btn.addEventListener('click', function(){ const k = this.dataset.k, a = A[k]; if(!a) return; addMsg(a.q,'usr'); if(copts) copts.style.display='none'; showTyping(()=>{ addMsg(a.a,'bot'); if(crst) crst.style.display='block'; }); });
  });
  const crb = document.getElementById('crb'); if(crb){ crb.addEventListener('click', ()=>{ if(cmsg) cmsg.innerHTML=''; addMsg('¡Hola! 👋 Soy el Asistente de Dovela Lab. ¿En Qué te Puedo Ayudar?','bot'); if(copts) copts.style.display='flex'; if(crst) crst.style.display='none'; }); }

  // Preseleccionar curso cuando se hace click en botones "Inscribirme"
  document.querySelectorAll('a[data-course]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const course = a.getAttribute('data-course');
      if(!course) return;
      // find the contact select and set value
      const sel = document.getElementById('cf-curso');
      const heroSel = document.getElementById('hf-interes');
      if(sel){
        // set value by matching option text or value (case-insensitive, trim)
        const target = course.trim().toLowerCase();
        let matched = false;
        for(const opt of sel.options){
          const txt = (opt.text || '').trim().toLowerCase();
          const val = (opt.value || '').trim().toLowerCase();
          if(txt === target || val === target || txt.includes(target) || target.includes(txt)){
            opt.selected = true; matched = true; break;
          }
        }
        if(matched){ try{ sel.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){} }
      }
      if(heroSel){
        const targetH = course.trim().toLowerCase();
        for(const opt of heroSel.options){
          const txt = (opt.text || '').trim().toLowerCase();
          const val = (opt.value || '').trim().toLowerCase();
          if(txt === targetH || val === targetH || txt.includes(targetH) || targetH.includes(txt)){
            opt.selected = true; try{ heroSel.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){} break;
          }
        }
      }
      // allow anchor default (scroll to #cta) to proceed
    });
  });

    // Interactividad: badge '4 Cursos Activos' -> solo feedback visual
    const metricBadge = document.getElementById('metric-badge');
    if (metricBadge) {
      metricBadge.addEventListener('click', () => {
        metricBadge.classList.add('badge-pulse');
        setTimeout(() => metricBadge.classList.remove('badge-pulse'), 600);
      });
      metricBadge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          metricBadge.click();
        }
      });
    }
});

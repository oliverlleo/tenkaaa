(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;

  const finishLoader = () => $('.loader')?.classList.add('is-done');
  addEventListener('load', () => setTimeout(finishLoader, 500), { once: true });
  setTimeout(finishLoader, 2600);

  const nav = $('.nav');
  const menu = $('.menu-btn');
  const primaryNav = $('#primary-nav');
  const setMenu = (open, restoreFocus = false) => {
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) setTimeout(() => primaryNav?.querySelector('a')?.focus({ preventScroll: true }), 420);
    else if (restoreFocus) menu?.focus({ preventScroll: true });
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    setMenu(open, !open);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') setMenu(false, true); });
  const updateNav = () => nav?.classList.toggle('is-scrolled', scrollY > 26);
  addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  let px = innerWidth / 2, py = innerHeight / 2;
  if (finePointer && !reduce) {
    const cursor = $('.cursor');
    let cx = px, cy = py, raf = 0;
    const loop = () => {
      cx += (px - cx) * .18;
      cy += (py - cy) * .18;
      cursor.style.transform = `translate3d(${cx - cursor.offsetWidth / 2}px,${cy - cursor.offsetHeight / 2}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', e => {
      px = e.clientX; py = e.clientY;
      root.style.setProperty('--mx', `${px}px`);
      root.style.setProperty('--my', `${py}px`);
      cursor.style.opacity = '1';
    }, { passive: true });
    $$('a,button,.project-card,.service-row').forEach(el => {
      el.addEventListener('mouseenter', () => cursor?.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor?.classList.remove('is-active'));
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate3d(${x * .12}px,${y * .16}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = 'translate3d(0,0,0)'; });
    });
    loop();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    });
  }

  const transformData = [
    { title: '01. Existente', copy: 'Entender o que permanece, o que limita e o que já possui valor antes de propor qualquer gesto.' },
    { title: '02. Intenção', copy: 'Organizar luz, circulação e materialidade em uma ideia clara. A transformação começa quando cada decisão passa a ter um motivo.' },
    { title: '03. Atmosfera', copy: 'Quando técnica e sensibilidade chegam ao mesmo lugar, o espaço deixa de parecer uma solução e começa a parecer pertencimento.' }
  ];
  const transformLayers = $$('.transform-layer');
  const transformTabs = $$('[data-transform-tab]');
  const setTransform = index => {
    transformLayers.forEach((layer, i) => layer.classList.toggle('is-active', i === index));
    transformTabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
    });
    const title = $('[data-transform-title]');
    const copy = $('[data-transform-copy]');
    if (title) title.textContent = transformData[index].title;
    if (copy) copy.textContent = transformData[index].copy;
  };
  transformTabs.forEach(tab => tab.addEventListener('click', () => setTransform(Number(tab.dataset.transformTab))));

  const preview = $('.service-preview');
  const previewImgs = $$('.service-preview img');
  if (preview && finePointer && !reduce) {
    addEventListener('pointermove', e => {
      preview.style.left = `${e.clientX}px`;
      preview.style.top = `${e.clientY}px`;
    }, { passive: true });
    $$('.service-row').forEach((row, index) => {
      row.addEventListener('mouseenter', () => {
        previewImgs.forEach((img, i) => img.classList.toggle('is-active', i === index));
        preview.style.opacity = '1';
        preview.style.transform = 'translate(-50%,-50%) scale(1) rotate(1.5deg)';
      });
      row.addEventListener('mouseleave', () => {
        preview.style.opacity = '0';
        preview.style.transform = 'translate(-50%,-50%) scale(.84) rotate(-2deg)';
      });
    });
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .to('.hero-blueprint path', { strokeDashoffset: 0, duration: 1.75, stagger: .018, ease: 'power2.inOut' }, 0)
    .from('.hero-eyebrow', { y: -14, opacity: 0, duration: .65 }, .12)
    .from('.hero-title .hero-line>span', { yPercent: 112, duration: 1.25, stagger: .12 }, .25)
    .from('.hero-side', { y: 24, opacity: 0, duration: .8 }, .72)
    .from('.hero-axis', { scaleX: .35, transformOrigin: 'left', opacity: 0, duration: .8 }, .78);

  const mm = gsap.matchMedia();

  mm.add('(min-width: 901px)', () => {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      .to('.hero-media', { clipPath: 'inset(0 0 0 0)', ease: 'none' }, 0)
      .to('.hero-blueprint', { opacity: .14, scale: 1.025, ease: 'none' }, 0)
      .to('.hero-title-wrap', { yPercent: -14, ease: 'none' }, 0)
      .to('.hero-media img', { yPercent: 4, scale: 1.12, ease: 'none' }, 0);

    $$('.display-copy').forEach((line, i) => {
      gsap.from(line, {
        yPercent: 55,
        opacity: .08,
        duration: 1.05,
        ease: 'power4.out',
        scrollTrigger: { trigger: line, start: 'top 88%' },
        xPercent: i ? 4 : -3
      });
    });
    gsap.from('.principle-note', { y: 36, opacity: 0, duration: .85, scrollTrigger: { trigger: '.principle-note', start: 'top 91%' } });

    const journeyShots = $$('.journey-shot');
    const journeySteps = $$('.journey-step');
    const journeyState = $('.journey-state');
    const labels = ['01 / Escuta', '02 / Intenção', '03 / Pertencimento'];
    let activeJourney = 0;
    const setJourney = index => {
      if (index === activeJourney) return;
      activeJourney = index;
      journeyShots.forEach((el, i) => el.classList.toggle('is-active', i === index));
      journeySteps.forEach((el, i) => el.classList.toggle('is-active', i === index));
      if (journeyState) journeyState.textContent = labels[index];
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.journey', start: 'top top', end: 'bottom bottom', scrub: .8,
        onUpdate: self => setJourney(Math.min(2, Math.floor(self.progress * 3)))
      }
    })
      .to('.journey-progress i', { scaleX: 1, ease: 'none', duration: 1 }, 0)
      .to(journeyShots[0]?.querySelector('img'), { scale: 1.16, ease: 'none', duration: .34 }, 0)
      .fromTo(journeyShots[1], { clipPath: 'inset(8% 14% 8% 14%)', scale: .96 }, { clipPath: 'inset(4%)', scale: 1.04, ease: 'power2.inOut', duration: .18 }, .31)
      .to(journeyShots[1]?.querySelector('img'), { scale: 1.14, ease: 'none', duration: .34 }, .34)
      .fromTo(journeyShots[2], { clipPath: 'circle(12% at 68% 48%)', scale: .97 }, { clipPath: 'circle(85% at 68% 48%)', scale: 1.04, ease: 'power2.inOut', duration: .2 }, .64)
      .to(journeyShots[2]?.querySelector('img'), { scale: 1.13, ease: 'none', duration: .34 }, .66);

    const track = $('.projects-track');
    const section = $('.projects');
    const shell = $('.projects-shell');
    const cards = $$('.project-card');
    const travel = () => Math.max(0, track.scrollWidth - innerWidth);
    section.style.height = `${Math.max(250, 120 + travel() / innerHeight * 100)}vh`;
    shell.style.position = 'sticky';
    shell.style.top = '0';
    const projectTween = gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true,
        onUpdate: self => {
          const n = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          const counter = $('.projects-counter b');
          if (counter) counter.textContent = String(n).padStart(2, '0');
        }
      }
    });
    cards.forEach(card => {
      const img = card.querySelector('img');
      gsap.to(img, { xPercent: -4, scale: 1.14, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: projectTween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(card.querySelector('.project-meta'), { y: 32, opacity: .25, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: projectTween, start: 'left 85%', end: 'left 55%', scrub: true } });
    });

    gsap.from('.transform-frame', { clipPath: 'inset(7% 9% 7% 9%)', duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.transformation-stage', start: 'top 82%' } });
    gsap.from('.transform-panel', { x: 55, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.transformation-stage', start: 'top 78%' } });

    $$('.service-row').forEach((row, i) => gsap.from(row, { x: i % 2 ? 55 : -55, opacity: 0, duration: .9, ease: 'power4.out', scrollTrigger: { trigger: row, start: 'top 92%' } }));

    gsap.timeline({ scrollTrigger: { trigger: '.matter', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .to('.matter-orbit', { rotation: 100, scale: 1.08, ease: 'none' }, 0)
      .to('.matter-title', { yPercent: -6, ease: 'none' }, 0)
      .to('.matter-words span:nth-child(1)', { xPercent: 90, ease: 'none' }, 0)
      .to('.matter-words span:nth-child(2)', { xPercent: -75, ease: 'none' }, 0)
      .to('.matter-words span:nth-child(3)', { xPercent: 55, ease: 'none' }, 0)
      .to('.matter-words span:nth-child(4)', { xPercent: -45, ease: 'none' }, 0);

    $$('.process-step').forEach((step, i) => gsap.from(step, { x: i % 2 ? 34 : -34, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 91%' } }));
    gsap.to('.process-line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 76%', end: 'bottom 76%', scrub: true } });

    gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top 72%', toggleActions: 'play none none reverse' } })
      .to('.contact-plan path', { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0)
      .from('.contact-inner h2', { y: 35, opacity: .12, filter: 'blur(12px)', duration: 1.2, ease: 'power4.out' }, .22)
      .from('.contact-actions', { y: 18, opacity: 0, duration: .7 }, .72);
  });

  mm.add('(max-width: 900px)', () => {
    gsap.to('.hero-blueprint path', { strokeDashoffset: 0, duration: 1.1, stagger: .01, ease: 'power2.out' });

    const shots = $$('.journey-shot');
    const steps = $$('.journey-step');
    const state = $('.journey-state');
    const labels = ['01 / Escuta', '02 / Intenção', '03 / Pertencimento'];
    const show = index => {
      shots.forEach((s, i) => s.classList.toggle('is-active', i === index));
      steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
      if (state) state.textContent = labels[index];
    };
    ScrollTrigger.create({ trigger: '.journey', start: 'top top', end: 'bottom bottom', onUpdate: self => show(Math.min(2, Math.floor(self.progress * 3))) });
    gsap.to('.journey-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.journey', start: 'top top', end: 'bottom bottom', scrub: true } });

    $$('.project-card').forEach(card => gsap.from(card, { opacity: 0, y: 24, duration: .6, scrollTrigger: { trigger: card, start: 'left 92%' } }));
    $$('.service-row').forEach(row => gsap.from(row, { y: 20, opacity: 0, duration: .6, scrollTrigger: { trigger: row, start: 'top 94%' } }));
    gsap.to('.process-line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 85%', end: 'bottom 85%', scrub: true } });
    gsap.to('.contact-plan path', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: '.contact', start: 'top 78%' } });
  });

  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();

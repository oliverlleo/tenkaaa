(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finishLoader = () => $('.loader')?.classList.add('is-done');
  addEventListener('load', () => setTimeout(finishLoader, 450), {once:true});
  setTimeout(finishLoader, 2600);
  const nav = $('.nav'), menu = $('.menu-btn');
  const setMenu = open => {
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menu?.setAttribute('aria-expanded', String(open));
    menu?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  $$('.nav-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('scroll', () => nav?.classList.toggle('is-scrolled', scrollY > 24), {passive:true});
  let pointerX = innerWidth/2, pointerY = innerHeight/2;
  addEventListener('pointermove', e => {
    pointerX = e.clientX; pointerY = e.clientY;
    root.style.setProperty('--mx', `${pointerX}px`); root.style.setProperty('--my', `${pointerY}px`);
  }, {passive:true});
  const canvas = $('.hero-canvas');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(devicePixelRatio || 1, 1.7), w=0, h=0, raf=0;
    const pts = Array.from({length:28}, (_,i) => ({x:Math.random(),y:Math.random(),r:20+Math.random()*50,s:.00008+Math.random()*.00016,p:i}));
    const resize = () => { w=canvas.clientWidth; h=canvas.clientHeight; canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); };
    const draw = t => {
      ctx.clearRect(0,0,w,h);
      for (let i=0;i<pts.length;i++) {
        const p=pts[i]; const x=(p.x*w + Math.sin(t*p.s+p.p)*42 + w)%w; const y=(p.y*h + Math.cos(t*p.s*1.2+p.p)*34 + h)%h;
        const dx=x-pointerX, dy=y-pointerY, dist=Math.hypot(dx,dy); const alpha=Math.max(.025,.17-dist/2400);
        ctx.beginPath();ctx.arc(x,y,1.15,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.fill();
        for(let j=i+1;j<pts.length;j++){const q=pts[j];const qx=(q.x*w+Math.sin(t*q.s+q.p)*42+w)%w;const qy=(q.y*h+Math.cos(t*q.s*1.2+q.p)*34+h)%h;const d=Math.hypot(x-qx,y-qy);if(d<145){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(qx,qy);ctx.strokeStyle=`rgba(255,255,255,${(1-d/145)*.06})`;ctx.stroke();}}
      }
      raf=requestAnimationFrame(draw);
    };
    resize(); addEventListener('resize',resize,{passive:true}); raf=requestAnimationFrame(draw);
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) cancelAnimationFrame(raf); else raf=requestAnimationFrame(draw); });
  }
  const compare = $('[data-compare]');
  if (compare) {
    const top = $('.compare-top', compare), handle = $('.compare-handle', compare);
    const setCompare = value => { const v=Math.max(0,Math.min(100,value)); top.style.clipPath=`inset(0 ${100-v}% 0 0)`; handle.style.left=`${v}%`; handle.setAttribute('aria-valuenow', String(Math.round(v))); };
    const fromX = x => { const r=compare.getBoundingClientRect(); setCompare((x-r.left)/r.width*100); };
    let dragging=false;
    handle.addEventListener('pointerdown',e=>{dragging=true;handle.setPointerCapture?.(e.pointerId);fromX(e.clientX);});
    handle.addEventListener('pointermove',e=>{if(dragging)fromX(e.clientX)});
    handle.addEventListener('pointerup',()=>dragging=false); handle.addEventListener('pointercancel',()=>dragging=false);
    compare.addEventListener('pointerdown',e=>{if(e.target!==handle)fromX(e.clientX)});
    handle.addEventListener('keydown',e=>{const v=Number(handle.getAttribute('aria-valuenow'))||50;if(e.key==='ArrowLeft'){e.preventDefault();setCompare(v-3)}if(e.key==='ArrowRight'){e.preventDefault();setCompare(v+3)}});
  }
  if (matchMedia('(pointer:fine)').matches && !reduce) {
    const dot=$('.cursor-dot'), ring=$('.cursor-ring'); let rx=pointerX, ry=pointerY;
    addEventListener('pointermove',()=>{dot.style.opacity=1;ring.style.opacity=1;dot.style.transform=`translate3d(${pointerX-3}px,${pointerY-3}px,0)`},{passive:true});
    const cursorLoop=()=>{rx+=(pointerX-rx)*.16;ry+=(pointerY-ry)*.16;ring.style.transform=`translate3d(${rx-17}px,${ry-17}px,0)`;requestAnimationFrame(cursorLoop)}; cursorLoop();
    $$('a,button,.service,.project').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('active'));el.addEventListener('mouseleave',()=>ring.classList.remove('active'))});
    $$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.14}px,${y*.14}px)`});el.addEventListener('pointerleave',()=>el.style.transform='translate(0,0)')});
  }
  const preview=$('.service-preview'), previewImgs=$$('.service-preview img');
  if(preview && matchMedia('(pointer:fine)').matches && !reduce){
    addEventListener('pointermove',e=>{preview.style.left=`${e.clientX}px`;preview.style.top=`${e.clientY}px`},{passive:true});
    $$('.service').forEach(row=>{row.addEventListener('mouseenter',()=>{const i=Number(row.dataset.preview||0);previewImgs.forEach((im,n)=>im.classList.toggle('active',n===i));preview.style.opacity='1';preview.style.transform='translate(-50%,-50%) scale(1) rotate(2deg)'});row.addEventListener('mouseleave',()=>{preview.style.opacity='0';preview.style.transform='translate(-50%,-50%) scale(.86) rotate(-3deg)'})});
  }
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const intro=gsap.timeline({defaults:{ease:'power4.out'}});
  intro.from('.brand',{y:-18,opacity:0,duration:.7}).from('.hero-title .line>span',{yPercent:115,duration:1.25,stagger:.12},'-=.35').from('.hero-kicker,.hero-side',{y:24,opacity:0,duration:.8,stagger:.12},'-=.85').from('.orbit',{scale:.4,opacity:0,duration:1.2,ease:'elastic.out(1,.5)'},'-=.8');
  const manifest=$('.manifesto-copy');
  const text=manifest.textContent.trim();
  manifest.innerHTML=text.split(' ').map(w=>`<span class="word">${w}&nbsp;</span>`).join('');
  const words=$$('.manifesto-copy .word');
  gsap.from(words,{yPercent:95,rotation:2,opacity:.12,stagger:.028,duration:.95,ease:'power4.out',scrollTrigger:{trigger:'.manifesto',start:'top 70%',toggleActions:'play none none reverse'}});
  gsap.to(words,{xPercent:(i)=>i%2?7:-7,color:(i)=>i%5===0?'#b66343':'#171411',ease:'none',stagger:.006,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.manifesto-note',{x:80,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.manifesto-note',start:'top 90%'}});
  const shots=$$('.story-shot'), steps=$$('.story-step'), storyButtons=$$('[data-story]');
  const setActive = index => storyButtons.forEach((b,i)=>b.classList.toggle('active',i===index));
  const storyTl=gsap.timeline({scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1,onUpdate:self=>setActive(Math.min(2,Math.floor(self.progress*3)))}});
  storyTl.to('.story-meter i',{scaleX:1,ease:'none',duration:1},0)
    .to(shots[0],{scale:.96,opacity:0,duration:.12,ease:'none'},.29).to(steps[0],{y:-30,opacity:0,duration:.08},.28)
    .fromTo(shots[1],{opacity:0,clipPath:'inset(18% 18% 18% 18%)'},{opacity:1,clipPath:'inset(4% 4% 4% 4%)',duration:.18,ease:'power2.inOut'},.31).fromTo(steps[1],{y:35,opacity:0},{y:0,opacity:1,duration:.12},.38)
    .to(shots[1],{scale:.96,opacity:0,duration:.12,ease:'none'},.61).to(steps[1],{y:-30,opacity:0,duration:.08},.60)
    .fromTo(shots[2],{opacity:0,clipPath:'circle(14% at 66% 50%)'},{opacity:1,clipPath:'circle(85% at 66% 50%)',duration:.22,ease:'power2.inOut'},.63).fromTo(steps[2],{y:35,opacity:0},{y:0,opacity:1,duration:.12},.70)
    .to('.story-shot img',{scale:1.13,ease:'none',duration:1},0);
  const track=$('.projects-track'), projectSection=$('.projects'), projectShell=$('.projects-shell');
  const desktop=matchMedia('(min-width:901px)');
  let projectTween;
  const setupProjects=()=>{
    if(projectTween){projectTween.scrollTrigger?.kill();projectTween.kill();projectTween=null;gsap.set(track,{clearProps:'transform'});}
    if(!desktop.matches)return;
    const travel=()=>Math.max(0,track.scrollWidth-innerWidth);
    projectSection.style.height=`${Math.max(220,120 + travel()/innerHeight*100)}vh`;
    projectShell.style.position='sticky'; projectShell.style.top='0';
    projectTween=gsap.to(track,{x:()=>-travel(),ease:'none',scrollTrigger:{trigger:projectSection,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true,onUpdate:self=>{$('.projects-counter span').textContent=String(Math.min(4,Math.floor(self.progress*4)+1)).padStart(2,'0')}}});
    $$('.project img').forEach(img=>gsap.to(img,{xPercent:-4,scale:1.13,ease:'none',scrollTrigger:{trigger:img.closest('.project'),containerAnimation:projectTween,start:'left right',end:'right left',scrub:true}}));
  };
  const resetMobileProjects=()=>{if(!desktop.matches){projectSection.style.height='auto';projectShell.style.position='relative';projectShell.style.top='auto';}}
  setupProjects();resetMobileProjects();
  desktop.addEventListener?.('change',()=>{setupProjects();resetMobileProjects();ScrollTrigger.refresh()});
  gsap.to('.compare-stage img',{scale:1.08,yPercent:3,ease:'none',scrollTrigger:{trigger:'.compare',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.timeline({scrollTrigger:{trigger:'.philosophy',start:'top bottom',end:'bottom top',scrub:1}}).to('.ring:nth-child(1)',{scale:1.28,rotation:90,ease:'none'},0).to('.ring:nth-child(2)',{scale:.75,rotation:-110,ease:'none'},0).to('.ring:nth-child(3)',{scale:1.18,rotation:160,ease:'none'},0).to('.philosophy-copy',{yPercent:-8,ease:'none'},0).to('.philosophy-float.f1',{xPercent:80,ease:'none'},0).to('.philosophy-float.f2',{xPercent:-70,ease:'none'},0);
  $$('.service').forEach((row,i)=>gsap.from(row,{x:i%2?55:-55,clipPath:'inset(0 0 0 25%)',opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:row,start:'top 92%'}}));
  gsap.to('.process-rail i',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.process-list',start:'top 75%',end:'bottom 75%',scrub:true}});
  $$('.process-line').forEach((line,i)=>gsap.from(line,{x:i%2?45:-45,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:line,start:'top 88%'}}));
  gsap.to('.cta-bg img',{scale:1.2,yPercent:5,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.cta-inner h2',{scale:.78,filter:'blur(13px)',opacity:.15,duration:1.2,ease:'power4.out',scrollTrigger:{trigger:'.cta',start:'top 68%'}});
  addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();
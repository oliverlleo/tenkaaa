export async function createRuntime(){
  const root=document.documentElement; root.classList.remove('no-js');
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(pointer:fine)').matches;
  const mobile=matchMedia('(max-width: 900px)');
  const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger, gsapReady=Boolean(gsap&&ScrollTrigger);
  let lenis=null, targetX=innerWidth*.5, targetY=innerHeight*.5, glUniforms=null;

  const boot=$('.boot'), finishBoot=()=>boot?.classList.add('is-done');
  if(gsapReady&&!reduced){gsap.timeline({defaults:{ease:'power3.out'}}).to('.boot-progress i',{scaleX:1,duration:1.15,ease:'power2.inOut'}).from('.boot-mark',{scale:.7,rotation:-12,opacity:0,duration:.65},.1).from('.boot-copy span',{y:14,opacity:0,duration:.55},.25).from('.boot-copy small',{y:10,opacity:0,duration:.55},.38).to('.boot-center',{scale:1.04,opacity:0,duration:.5,ease:'power2.in'},1.2).call(finishBoot,[],1.45)}else setTimeout(finishBoot,160);
  addEventListener('load',()=>setTimeout(finishBoot,300),{once:true}); setTimeout(finishBoot,2600);

  const nav=$('.nav'), menuToggle=$('.menu-toggle');
  const setMenu=open=>{nav?.classList.toggle('is-open',open);menuToggle?.setAttribute('aria-expanded',String(open));if(menuToggle)$('span',menuToggle).textContent=open?'Fechar':'Menu'};
  menuToggle?.addEventListener('click',()=>setMenu(!nav.classList.contains('is-open'))); $$('.menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  let pointerNX=0,pointerNY=0;
  addEventListener('pointermove',e=>{targetX=e.clientX;targetY=e.clientY;pointerNX=e.clientX/innerWidth*2-1;pointerNY=e.clientY/innerHeight*2-1;root.style.setProperty('--mx',`${e.clientX}px`);root.style.setProperty('--my',`${e.clientY}px`)},{passive:true});
  if(finePointer&&!reduced){const cursor=$('.cursor');let cx=targetX,cy=targetY;const loop=()=>{cx+=(targetX-cx)*.18;cy+=(targetY-cy)*.18;if(cursor)cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;requestAnimationFrame(loop)};loop();$$('a,button,[tabindex]').forEach(el=>{el.addEventListener('mouseenter',()=>cursor?.classList.add('is-active'));el.addEventListener('mouseleave',()=>cursor?.classList.remove('is-active'))})}

  if(!reduced&&gsapReady&&window.Lenis){lenis=new window.Lenis({duration:1.08,smoothWheel:true,wheelMultiplier:.9,touchMultiplier:1,syncTouch:false});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  const cinematicScrollTo=(y,o={})=>lenis?lenis.scrollTo(y,{duration:o.duration||1.2,offset:o.offset||0}):scrollTo({top:y,behavior:reduced?'auto':'smooth'});

  const canvas=$('#cinema-gl');
  if(canvas&&!reduced){try{const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.2:1.55));renderer.setSize(innerWidth,innerHeight,false);const scene=new THREE.Scene(), camera=new THREE.Camera();glUniforms={uTime:{value:0},uPointer:{value:new THREE.Vector2(.5,.5)},uAccent:{value:new THREE.Color('#b66343')},uIntensity:{value:.48},uAspect:{value:innerWidth/innerHeight}};const material=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:glUniforms,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}',fragmentShader:'precision highp float;varying vec2 vUv;uniform float uTime;uniform vec2 uPointer;uniform vec3 uAccent;uniform float uIntensity;uniform float uAspect;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}void main(){vec2 uv=vUv;vec2 p=uv-uPointer;p.x*=uAspect;float glow=.16/max(.18,length(p));float gx=smoothstep(.992,1.,cos((uv.x+sin(uTime*.08)*.002)*38.));float gy=smoothstep(.994,1.,cos((uv.y+cos(uTime*.07)*.002)*23.));float grid=(gx+gy)*.025;float grain=(hash(uv*vec2(1300.,800.)+uTime)-.5)*.035;float vig=smoothstep(.95,.25,distance(uv,vec2(.5)));vec3 col=uAccent*(glow*.035*uIntensity+grid*uIntensity);float a=clamp((glow*.018+grid+abs(grain)*.18)*vig*uIntensity,0.,.12);gl_FragColor=vec4(col+grain*.04,a);}'});scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));const clock=new THREE.Clock();const render=()=>{if(!document.hidden){glUniforms.uTime.value=clock.getElapsedTime();glUniforms.uPointer.value.x+=((targetX/innerWidth)-glUniforms.uPointer.value.x)*.045;glUniforms.uPointer.value.y+=((1-targetY/innerHeight)-glUniforms.uPointer.value.y)*.045;renderer.render(scene,camera)}requestAnimationFrame(render)};render();addEventListener('resize',()=>{renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.2:1.55));renderer.setSize(innerWidth,innerHeight,false);glUniforms.uAspect.value=innerWidth/innerHeight},{passive:true})}catch(err){console.warn('TENKA ambient renderer disabled:',err);canvas.style.display='none'}}

  if(reduced||!gsapReady)root.classList.add('reduced-runtime'); else gsap.registerPlugin(ScrollTrigger);
  return {root,$,$$,clamp,reduced,finePointer,mobile,gsap,ScrollTrigger,gsapReady,lenis,cinematicScrollTo,glUniforms,getPointer:()=>({x:pointerNX,y:pointerNY})};
}

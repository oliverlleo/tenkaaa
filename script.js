import {createRuntime} from './src/runtime.js';
import {initScenes} from './src/scenes.js';
import {initProjects} from './src/projects.js';
const runtime=await createRuntime();
Object.defineProperty(window,'__TENKA_RUNTIME__',{value:runtime,configurable:true});
initScenes(runtime);
initProjects(runtime);
let timer=0;addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>runtime.ScrollTrigger?.refresh?.(),180)},{passive:true});
document.addEventListener('visibilitychange',()=>document.hidden?runtime.lenis?.stop():runtime.lenis?.start());

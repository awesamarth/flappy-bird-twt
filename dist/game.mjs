import {createRun,flap,step,W,H,FLOOR,configureScene} from './engine.mjs?v=compact-focus-7';import {render} from './render.mjs?v=compact-focus-7';import {GameAudio} from './audio.mjs?v=compact-focus-7';
const canvas=document.getElementById('canvas'),c=canvas.getContext('2d'),soundButton=document.getElementById('sound'),restart=document.getElementById('restart'),live=document.getElementById('live'),start=document.getElementById('start'),pauseButton=document.getElementById('pause');
const embedded=location.pathname.endsWith('/embed.html');
if(embedded){document.body.classList.add('embed');configureScene(W*window.innerHeight/window.innerWidth)}
let s=createRun(),best=0,paused=false,last=0,clock=0,overAt=0,accumulator=0;
try{best=Number(localStorage.getItem('flappy-best'))||0}catch{}
const audio=new GameAudio(ok=>{if(!ok&&audio.enabled){soundButton.textContent='SOUND RETRY';soundButton.setAttribute('aria-label','Retry enabling sound')}});
function updateSound(){soundButton.textContent=`SOUND ${audio.enabled?'ON':'OFF'}`;soundButton.setAttribute('aria-label',`Turn sound ${audio.enabled?'off':'on'}`);soundButton.setAttribute('aria-pressed',String(audio.enabled))}updateSound();
function updatePause(){pauseButton.setAttribute('aria-label',paused?'Resume game':'Pause game');pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.querySelector('path').setAttribute('d',paused?'M4 2v12l10-6z':'M3 2h4v12H3zm6 0h4v12H9z')}
function input(){
 canvas.focus({preventScroll:true});
 audio.unlock(); // Called synchronously from the tap/key gesture, before any async loading.
 if(paused){paused=false;last=0;accumulator=0;updatePause();return}
 if(s.mode==='over'||s.mode==='dying'){if(performance.now()-overAt<180)return;audio.stop();s=createRun();restart.classList.add('hidden')}
 start.classList.add('hidden');pauseButton.classList.remove('hidden');flap(s);audio.play('flap');
}
start.addEventListener('click',e=>{e.preventDefault();input()});
pauseButton.addEventListener('click',()=>{audio.unlock();if(s.mode==='playing'){paused=!paused;updatePause()}});
canvas.addEventListener('pointerdown',e=>{e.preventDefault();input()});
restart.addEventListener('click',e=>{e.preventDefault();input()});
soundButton.addEventListener('click',()=>{if(soundButton.textContent==='SOUND RETRY')audio.unlock();else audio.setEnabled(!audio.enabled);updateSound()});
document.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();if(!e.repeat||(s.mode==='playing'&&!paused))input()}else if(e.code==='KeyM')soundButton.click();else if(e.code==='KeyP'&&s.mode==='playing'){audio.unlock();paused=!paused;updatePause()}});
window.addEventListener('blur',()=>{if(s.mode==='playing'){paused=true;updatePause()}last=0;accumulator=0});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&s.mode==='playing'){paused=true;updatePause()}last=0;accumulator=0});
function hit(){
 pauseButton.classList.add('hidden');overAt=performance.now();audio.play('hit');if(s.mode==='dying')audio.play('die',.12);
}
function showGameOver(){
 if(s.panelShown)return;s.panelShown=true;
 if(s.score>best){best=s.score;try{localStorage.setItem('flappy-best',best)}catch{}}
 restart.classList.remove('hidden');live.textContent=`Game over. Score ${s.score}. Best ${best}. Tap to restart.`;
}
// A fixed 120Hz simulation advances world movement independently of input and display refresh rate.
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;if(!paused){clock+=elapsed;accumulator+=elapsed;while(accumulator>=1/120){for(const event of step(s,1/120)){if(event==='hit')hit();else if(event==='land'||event==='reveal')showGameOver();else if(event==='score'){audio.play('point');live.textContent=`Score ${s.score}`}}accumulator-=1/120}}render(c,s,{clock,best,paused});requestAnimationFrame(frame)}
// Render at native pixel resolution. CSS scales it without smoothing or any camera transform.
canvas.width=W;canvas.height=H;c.imageSmoothingEnabled=false;
if(embedded)window.addEventListener('resize',()=>{const oldFloor=FLOOR;configureScene(W*window.innerHeight/window.innerWidth);s.y=s.mode==='over'?FLOOR-18:s.y*FLOOR/oldFloor;for(const p of s.pipes)p.top=Math.max(28,Math.min(FLOOR-133,p.top*FLOOR/oldFloor));canvas.height=H;c.imageSmoothingEnabled=false;if(s.mode==='playing'){paused=true;updatePause()}});
requestAnimationFrame(frame);

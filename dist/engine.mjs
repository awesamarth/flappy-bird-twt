export const W=288,BIRD_X=80,RADIUS=10,PIPE_WIDTH=52,SPEED=100;
export let H=512,FLOOR=494;
export function configureScene(height){H=Math.round(height);FLOOR=H-18;}
export function createRun(random=Math.random){return{mode:'ready',y:H===512?230:Math.round(FLOOR*.47),vy:0,score:0,time:0,distance:0,next:1.4,pipes:[],random,deathAngle:0,deathElapsed:0,panelShown:false}}
export function flap(s){if(s.mode==='ready')s.mode='playing';if(s.mode==='playing')s.vy=-280}
function collision(s,p){const dx=BIRD_X-Math.max(p.x,Math.min(BIRD_X,p.x+PIPE_WIDTH));const top=Math.max(0,s.y-p.top),bottom=Math.max(0,p.top+105-s.y);return dx*dx+top*top<RADIUS*RADIUS||dx*dx+bottom*bottom<RADIUS*RADIUS}
function land(s){s.y=FLOOR-18;s.vy=0;s.deathAngle=Math.PI/2;s.mode='over';return 'land'}
export function step(s,dt){
 if(s.mode==='dying'){
  // The world is frozen, but the bird continues falling. Inputs cannot flap this state.
  const previous=s.deathElapsed;s.deathElapsed+=dt;s.vy+=900*dt;s.y+=s.vy*dt;s.deathAngle=Math.min(Math.PI/2,s.deathAngle+dt*4.8);
  const events=previous<.18&&s.deathElapsed>=.18?['reveal']:[];if(s.y>=FLOOR-18)events.push(land(s));return events;
 }
 if(s.mode!=='playing')return[];
 s.time+=dt;s.distance+=SPEED*dt;s.vy+=900*dt;s.y+=s.vy*dt;s.next-=dt;
 if(s.next<=0){s.pipes.push({x:W+10,top:H===512?80+s.random()*220:FLOOR*.162+s.random()*(FLOOR-105-FLOOR*.18-FLOOR*.162),passed:false});s.next+=1.6}
 for(const p of s.pipes)p.x-=SPEED*dt;
 if(s.y+RADIUS>=FLOOR)return ['hit',land(s)];
 if(s.pipes.some(p=>collision(s,p))){
  s.deathAngle=Math.max(-.35,Math.min(1.45,(s.vy-70)/420));s.vy=Math.max(0,s.vy);s.deathElapsed=0;s.mode='dying';return ['hit'];
 }
 let events=[];
 for(const p of s.pipes)if(!p.passed&&p.x+PIPE_WIDTH<BIRD_X-RADIUS){p.passed=true;s.score++;events.push('score')}
 s.pipes=s.pipes.filter(p=>p.x>-PIPE_WIDTH-5);return events;
}

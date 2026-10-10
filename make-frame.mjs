import fs from 'node:fs';import {createRun,configureScene,W,H,FLOOR} from './dist/engine.mjs?v=compact-focus-7';import {render} from './dist/render.mjs';
const rectangles=[],stack=[];let tx=0,ty=0,angle=0;
const c={fillStyle:'#000',save(){stack.push([tx,ty,angle])},restore(){[tx,ty,angle]=stack.pop()},translate(x,y){tx+=x;ty+=y},rotate(a){angle+=a},fillRect(x,y,w,h){rectangles.push({x:x+tx,y:y+ty,w,h,color:this.fillStyle,angle,tx,ty})}};
if(process.argv[4]==='square')configureScene(288);
let s=createRun(()=>.5);if(process.argv[3]==='play'){s.mode='playing';s.score=7;s.y=Math.round(FLOOR*.47);s.vy=70;s.distance=123;s.pipes=[{x:180,top:Math.round((FLOOR-105)/2),passed:false},{x:340,top:160,passed:false}]}
render(c,s,{clock:0,best:7});fs.writeFileSync(process.argv[2],JSON.stringify({width:W,height:H,rectangles}));

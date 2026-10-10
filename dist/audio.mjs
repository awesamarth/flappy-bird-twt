const FILES={flap:'wing.wav',point:'point.wav',hit:'hit.wav',die:'die.wav',swoosh:'swoosh.wav'};
export class GameAudio{
 constructor(onStatus=()=>{}){
  this.enabled=true;this.onStatus=onStatus;this.buffers=new Map();this.sources=new Set();this.pending=[];this.generation=0;
  try{this.enabled=localStorage.getItem('flappy-sound')!=='off'}catch{}
  // Preload the actual pack files. There is deliberately no synthesized fallback.
  this.files=new Map(Object.entries(FILES).map(([name,file])=>[name,fetch(new URL(`audio/${file}?v=classic-pack-3`,import.meta.url)).then(r=>{if(!r.ok)throw Error('Audio fetch '+r.status);return r.arrayBuffer()}).catch(()=>null)]));
 }
 unlock(){
  if(!this.enabled)return;
  try{
   if(!this.ctx){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context){this.onStatus(false);return}
    this.ctx=new Context();this.master=this.ctx.createGain();this.master.gain.value=.8;this.master.connect(this.ctx.destination);
    for(const name of Object.keys(FILES)){
     this.files.get(name).then(async data=>{
      if(!data){this.onStatus(false);return}
      try{const decoded=await this.ctx.decodeAudioData(data);this.buffers.set(name,decoded);this.flush(name)}catch{this.onStatus(false)}
     });
    }
   }
   if(this.ctx.state!=='running')this.ctx.resume().then(()=>this.onStatus(this.ctx.state==='running')).catch(()=>this.onStatus(false));
   else this.onStatus(true);
  }catch{this.onStatus(false)}
 }
 flush(name){
  const waiting=this.pending.filter(p=>p.name===name);this.pending=this.pending.filter(p=>p.name!==name);
  for(const p of waiting)if(p.generation===this.generation&&this.enabled&&performance.now()-p.at<350)this.play(name,Math.max(0,(p.at-performance.now())/1000));
 }
 play(name,delay=0){
  if(!this.enabled||!this.ctx)return;
  if(!this.buffers.has(name)){this.pending.push({name,at:performance.now()+delay*1000,generation:this.generation});return}
  try{const source=this.ctx.createBufferSource();source.buffer=this.buffers.get(name);source.connect(this.master);source.onended=()=>{this.sources.delete(source);source.disconnect()};this.sources.add(source);source.start(this.ctx.currentTime+delay)}catch{}
 }
 stop(){this.generation++;this.pending=[];for(const source of this.sources){try{source.stop();source.disconnect()}catch{}}this.sources.clear()}
 setEnabled(value){this.enabled=value;if(!value)this.stop();try{localStorage.setItem('flappy-sound',value?'on':'off')}catch{}if(value)this.unlock()}
}

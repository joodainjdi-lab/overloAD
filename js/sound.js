/* 소리 — 파일 없이 Web Audio로 만드는 배경 음악·효과음 (웹 전체 공통)
   · 배경 음악: 잔잔한 앰비언트 화음이 천천히 바뀌며 반복 (BGM)
     페이지를 넘어가도 끊기지 않아요 — 처음 연 페이지가 소리를 계속 틀고, 다음 페이지들은 그 위에 겹쳐 열려요.
     (브라우저 뒤로가기도 그대로 돼요. 새로고침하면 그 페이지부터 다시 시작)
   · 넘어가는 소리: 사진이 넘어갈 때 다이얼 '딸깍', 법·사업이 나타날 때 '딸깍딸깍' (TURN="page"로 바꾸면 책장 '사락')
   · 돌리는 소리: 간판 카드를 드래그해 돌릴 때 일정 각도마다 작은 기계 '틱' — 빨리 돌리면 촘촘하게 (SPIN)
   · 누르는 소리: 화살표·버튼·링크·간판 카드 등 누를 수 있는 것을 누르면 작은 '톡'
   · 고르는 소리: 지도에서 구역을 고를 때, 거리 걷기 입면도에서 건물을 고를 때만 나무 건반 '똑' — 모두 같은 음 (DING_ON)
   · 불 들어오는 소리: 한눈에 비교 지도에서 칸 색이 1위부터 켜질 때 단계마다 지도 고를 때와 같은 '똑' — 똑똑똑똑 (LIGHT)
   · 기본은 소리 켜짐. 단, 브라우저 정책상 첫 클릭·키 입력 때부터 소리가 나요.
     오른쪽 위 버튼으로 끄면 다른 페이지로 넘어가도 꺼진 상태가 유지돼요.
   크기: VOL(전체) / BGM(배경 음악) / SWISH(넘어가는 소리) / TAP(누르는 소리) / DING(고르는 소리) / LIGHT(불 들어오는 소리) */
window.SND=(()=>{
  const VOL=.8, BGM=.16, SWISH=.7, TAP=.28, DING=.2, LIGHT=1, SPIN=.7;
  const TURN="dial";   // 넘어가는 소리: "dial" 다이얼 딸깍 / "page" 책장 사락
  const CLICKABLE='button,a,[role="button"],.card,.kr,.mk,.nx,#rule,input,select,label';
  // '똑'(고르는 소리)
  //  · 마우스를 올릴 때: 서울 지도 구역 이름(survey) · 거리 걷기의 작은 지도 (서울 지도 그림 위 구역은 survey.js가 직접 SND.hover() 호출)
  //  · 누를 때: 거리 걷기의 입면도 건물 · 사진, 한눈에 비교의 TOP 5 항목 (누르는 '톡' 대신 '똑')
  //    TOP 5 열고 닫는 (^) 버튼은 화살표처럼 '톡'
  const DING_ON='.lb.on,#map';
  const DING_CLICK='.elev .b,.ph,.t5';
  const quiet=el=>btn&&btn.contains(el);
  const SND_R=24, SND_S=40;   // 소리 버튼: 화면 오른쪽 위에서 떨어진 거리, 크기(px) — 모든 페이지 공통
  const SHELL="ow-shell";                       // 다음 페이지가 열리는 겹친 화면의 이름
  const owner=window.top===window;               // 맨 바깥 페이지만 실제로 소리를 냄
  const isPage=owner||window.name===SHELL;       // 소리 버튼을 보여 주는 페이지 (walk·map 같은 안쪽 화면은 제외)
  const up=m=>{try{parent.postMessage(m,"*")}catch(_){}};
  /* 소리 버튼 자리: 모든 페이지에서 같은 곳 — 1920×1080 화면 기준 맨 위 한 줄(뒤로·제목과 같은 높이) 오른쪽 끝, 크기도 화면 비율대로 */
  function sizeBtn(b,w){["width","height"].forEach(p=>b.style.setProperty(p,w+"px","important"));b.style.setProperty("--sw",w+"px");const ic=b.querySelector("svg");if(ic){const z=Math.round(w*.42);ic.setAttribute("width",z);ic.setAttribute("height",z)}}
  function fitBtn(){const b=document.getElementById("snd");if(!b)return;
    if(innerWidth<=760){["left","top","right","width","height"].forEach(p=>b.style.removeProperty(p));return}
    const s=Math.min(innerWidth/1920,innerHeight/1080),ox=innerWidth/2-960*s,oy=innerHeight/2-540*s,w=Math.round(Math.max(30,52*s));
    b.style.setProperty("right","auto","important");b.style.setProperty("left",(ox+1862*s-w/2)+"px","important");b.style.setProperty("top",(oy+73*s-w/2)+"px","important");sizeBtn(b,w)}
  let on=true;
  try{on=localStorage.getItem("overload-sound")!=="off"}catch(_){}

  /* ───── 소리 버튼: 맨 바깥 페이지에 하나만, 모든 페이지에서 같은 자리(오른쪽 위 모서리) ───── */
  // 다음 페이지는 겹쳐 열리므로 버튼은 그대로 남아 있고, 안쪽 페이지는 버튼을 만들지 않음
  let btn=document.getElementById("snd");
  if(!owner){if(btn)btn.remove();btn=null}
  else{
    if(!btn){
      btn=document.createElement("button");btn.id="snd";
      btn.innerHTML='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v4h3l4 3V4L6 7H3z"/><path class="w1" d="M12.5 6.5a3.5 3.5 0 0 1 0 5"/><path class="w2" d="M14.5 4.5a6.5 6.5 0 0 1 0 9"/><path class="x" d="M12.5 7l4 4M16.5 7l-4 4"/></svg>';
    }
    document.body.appendChild(btn);   // 페이지 안 어디에 있든 body 맨 끝으로 → 다른 UI 영향 없이 같은 자리
    const tip=btn.querySelector(".tip");if(tip)tip.remove();
    btn.classList.add("used");
    const st=document.createElement("style");st.textContent=`
#snd{position:fixed!important;right:${SND_R}px!important;top:${SND_R}px!important;left:auto!important;bottom:auto!important;transform:none!important;
  z-index:2147483001!important;width:${SND_S}px!important;height:${SND_S}px!important;margin:0!important;border-radius:50%;border:0;background:#3a3a3a;color:#d0d0d0;
  display:grid;place-items:center;cursor:pointer;pointer-events:auto!important;visibility:visible!important;opacity:1!important;transition:background .25s,color .25s}
#snd{transition:background .25s,color .25s,top .35s cubic-bezier(.2,.8,.2,1)!important}
#snd:hover{background:#4a4a4a}#snd.on{background:#C3D132;color:#101010}#snd.on:hover,#snd.on:focus-visible{outline:none;box-shadow:0 0 0 calc(var(--sw,52px)*.14) rgba(195,209,50,.22)}
#snd::after{display:none!important}
#snd .w1,#snd .w2{display:none}#snd.on .w1,#snd.on .w2{display:inline}#snd.on .x{display:none}
@media (max-width:760px){#snd{right:16px!important;top:16px!important}}`;document.head.appendChild(st);
    fitBtn(); addEventListener("resize",fitBtn);
  }
  function paint(){if(!btn)return;btn.classList.toggle("on",on);btn.setAttribute("aria-pressed",on);btn.setAttribute("aria-label",on?"소리 끄기":"소리 켜기")}
  paint();

  /* ───── 누르기·마우스 올리기 감지 (모든 화면 공통) ───── */
  let fx=()=>{};   // 아래에서 정해짐: 바깥 페이지는 직접 소리, 안쪽 화면은 바깥으로 전달
  addEventListener("click",e=>{if(!e.target.closest)return;
    if(e.target.closest(DING_CLICK)){fx("hover");return}
    const el=e.target.closest(CLICKABLE);if(el&&el.matches(".card")&&window.__cardSpun)return;   // 간판을 돌린 뒤의 클릭은 '톡' 없음
    if(el&&!quiet(el))fx("tap")},true);
  // 손가락 커서가 뜨는 것(=누를 수 있는 것) 위로 마우스가 새로 들어가면 '띵'
  let lastT=null,hovEl=null;
  function pickable(t){let el=t&&t.nodeType===1?t:null,top=null;
    for(let i=0;el&&el!==document.body&&i<8;i++,el=el.parentElement){if(getComputedStyle(el).cursor==="pointer")top=el;else if(top)break}
    return top}
  addEventListener("pointermove",e=>{
    if(e.pointerType!=="mouse"||e.buttons||!(e.movementX||e.movementY))return;   // 실제로 마우스를 움직일 때만 (스크롤로 밑에 지나가는 건 제외)
    if(e.target===lastT)return;lastT=e.target;
    const el=pickable(e.target);if(el!==hovEl){hovEl=el;if(el&&el.closest(DING_ON))fx("hover")}
  },{capture:true,passive:true});
  addEventListener("pointerleave",()=>{lastT=hovEl=null});

  /* ───── 안쪽 화면: 소리는 모두 바깥 페이지로 보내서 냄 ───── */
  if(!owner){
    fx=k=>up("snd:"+k);
    // 안쪽 화면을 처음 눌러도 바깥 페이지 소리가 시작되게
    ["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,()=>up("snd:wake"),{capture:true,passive:true}));
    // 더 안쪽 화면(walk·map)에서 온 소리는 한 번 더 바깥으로
    addEventListener("message",e=>{const d=e.data;if(typeof d!=="string"||!d.startsWith("snd:"))return;
      if(e.source===parent){if(d.startsWith("snd:state:")){on=d==="snd:state:on";paint()}return}
      up(d)});
    if(btn)btn.addEventListener("click",e=>{e.stopPropagation();on=!on;paint();up("snd:toggle")});
    if(isPage){up("snd:hello");const t=()=>up("snd:title:"+document.title);t();addEventListener("load",t)}
    if(isPage){let last="";setInterval(()=>{const h=location.pathname.split("/").pop()+location.search+location.hash;if(h!==last){last=h;up("snd:url:"+h)}},700)}   // 바깥 페이지가 주소에 적어 두도록
    return {setEra(){},speed(){},tick(){fx("tick")},rule(){fx("rule")},tap(){fx("tap")},hover(){fx("hover")},place(i){fx("place:"+(i|0))},latch(){fx("latch")},spin(v){fx("spin:"+(+v).toFixed(2))},light(ms){fx("light:"+JSON.stringify(ms||[]))},
      go(url){location.href=url},get on(){return on}};
  }
  let ctx=null,master,fxBus,bgBus,bgPad,bgEcho,started=false,chordT=0,ci=0;

  /* ───── 효과음 ───── */
  function nbuf(sec){const len=Math.max(1,ctx.sampleRate*sec|0),b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;return b}
  // 넘어가는 소리 — TURN 값으로 고르기: "dial"(다이얼 딸깍) / "page"(책장 사락)
  function swish(g=1){
    if(!ready())return;const t=ctx.currentTime+.004;
    if(TURN==="page")return page(t,g);
    detent(t,Math.min(g,1.1));if(g>1)detent(t+.07,.75);   // 법·사업이 나올 땐 '딸깍딸깍' 두 번
  }
  // 다이얼 한 칸 '딸깍' — 금속 걸쇠(높은 짧은 소리) + 몸통 울림 + 아주 작은 둔음
  function detent(t,g){
    const k=SWISH*g;
    nz(t,{type:"bandpass",f:3800,q:2,dur:.008,g:.5*k});
    nz(t+.002,{type:"bandpass",f:1300+Math.random()*120,q:9,dur:.035,g:.35*k});
    nz(t,{type:"lowpass",f:260,dur:.03,g:.25*k});
  }
  // 책장 '사락' — 종이가 떨리며 스쳐 넘어감
  function page(t,g){
    const k=SWISH*g,dur=.32+.08*g;
    const s=ctx.createBufferSource();s.buffer=nbuf(dur+.05);
    const f=ctx.createBiquadFilter();f.type="bandpass";f.Q.value=.8;
    f.frequency.setValueAtTime(1200,t);f.frequency.exponentialRampToValueAtTime(4200,t+dur*.6);f.frequency.exponentialRampToValueAtTime(2500,t+dur);
    const e=ctx.createGain(),fl=ctx.createOscillator(),fg=ctx.createGain();fl.frequency.value=22;fg.gain.value=.05*k;fl.connect(fg).connect(e.gain);
    e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(.12*k,t+dur*.45);e.gain.linearRampToValueAtTime(0,t+dur);
    s.connect(f).connect(e).connect(fxBus);s.start(t);s.stop(t+dur+.05);fl.start(t);fl.stop(t+dur+.05);
    nz(t+dur*.9,{type:"lowpass",f:900,dur:.05,g:.12*k});   // 마지막에 종이가 '탁' 내려앉음
  }
  function nz(t,{type,f,q=1,dur,g}){
    const s=ctx.createBufferSource();s.buffer=nbuf(dur+.02);const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;
    const e=ctx.createGain();e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0008,t+dur);
    s.connect(fl).connect(e).connect(fxBus);s.start(t);s.stop(t+dur+.02);
  }
  // '톡' — 누르는 소리
  // '틱틱틱' — 간판을 손으로 돌릴 때: 회전 진열대·다이얼처럼 일정 각도마다 작은 기계 '틱'
  // 빨리 돌리면 틱이 촘촘해지고 살짝 또렷해짐, 천천히 돌리면 띄엄띄엄 (자연음 없이 웹의 다이얼 소리와 같은 결)
  let spinAcc=0,spinLast=0;
  function spin(v){
    if(!ready())return;const a=Math.abs(v);if(a<.4)return;
    spinAcc+=a;const STEP=24;                       // 24°마다 한 번
    const now=ctx.currentTime;
    while(spinAcc>=STEP){spinAcc-=STEP;
      if(now-spinLast<.035)continue;spinLast=now;    // 너무 촘촘하면 건너뜀(최대 초당 약 28번)
      const k=SPIN*(.55+Math.min(1,a/25)*.45),t=now+.002;
      nz(t,{type:"bandpass",f:5200,q:3,dur:.006,g:.5*k});
      nz(t+.001,{type:"bandpass",f:2300+Math.random()*200,q:8,dur:.022,g:.32*k});}
  }
  // '탁' — 인트로에서 사진이 한 장씩 붙을 때: 짧고 마른 소리 (장마다 높이가 살짝 다름)
  // 스크롤이 법·제도 선에 걸릴 때 — 사진 넘길 때의 '딸깍'과 같은 다이얼 소리로 '드르륵… 탁'
  //  (점점 느려지는 딸깍 네 번 + 마지막에 단단히 걸리는 한 번)
  function latch(){
    if(!ready())return;const t=ctx.currentTime+.004;
    [0,.045,.1,.17].forEach((d,k)=>detent(t+d,.55+k*.08));
    detent(t+.26,1.25);nz(t+.26,{type:"lowpass",f:180,dur:.06,g:.35*SWISH});
  }
  function place(i=0){
    if(!ready())return;const t=ctx.currentTime+.002,v=.9+((i*37)%7)/35;
    nz(t,{type:"bandpass",f:4600*v,q:2.2,dur:.009,g:.42*TAP});          // 모서리가 닿는 '틱'
    nz(t+.002,{type:"bandpass",f:1700*v,q:5,dur:.028,g:.3*TAP});        // 종이 판 '탁'
    nz(t,{type:"lowpass",f:320,dur:.018,g:.08*TAP});                    // 아주 옅은 바닥음
  }
  function tap(){
    if(!ready())return;const t=ctx.currentTime+.003;
    const o=ctx.createOscillator(),e=ctx.createGain();o.type="sine";o.frequency.setValueAtTime(880,t);o.frequency.exponentialRampToValueAtTime(560,t+.06);
    e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(.25*TAP,t+.006);e.gain.exponentialRampToValueAtTime(.0008,t+.09);
    o.connect(e).connect(fxBus);o.start(t);o.stop(t+.12);
    const s=ctx.createBufferSource();s.buffer=nbuf(.03);const f=ctx.createBiquadFilter();f.type="highpass";f.frequency.value=3000;
    const ne=ctx.createGain();ne.gain.setValueAtTime(.06*TAP,t);ne.gain.exponentialRampToValueAtTime(.0008,t+.025);
    s.connect(f).connect(ne).connect(fxBus);s.start(t);
  }

  // '똑' — 고르는 소리: 나무 건반 소리 하나 (음 높이 고정 — C6, 배경 화음 넷 모두에 들어 있는 음이라 언제 울려도 어울림)
  const DING_F=783.99;   // '똑' 음높이 — C6(1046Hz)에서 G5로 조금 낮춤
  let dingT=0;
  function ding(){
    if(!ready())return;const t=ctx.currentTime+.003;if(t-dingT<.07)return;dingT=t;   // 너무 빠르게 연달아 울리지 않게
    bell(t,DING_F,.3*DING,.55);
  }
  // 나무 건반을 부드러운 채로 '똑' 친 소리 (마림바 느낌) — 짧고 따뜻하게, 울림이 길게 남지 않음
  function bell(t,f,g,d){
    const o=ctx.createOscillator(),e=ctx.createGain();o.type="sine";
    o.frequency.setValueAtTime(f*1.012,t);o.frequency.exponentialRampToValueAtTime(f,t+.03);   // 칠 때 살짝 높았다 제자리로
    e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+.003);e.gain.exponentialRampToValueAtTime(.0006,t+d*.35);
    o.connect(e).connect(fxBus);o.start(t);o.stop(t+d*.35+.05);
    const o2=ctx.createOscillator(),e2=ctx.createGain();o2.type="sine";o2.frequency.value=f*3.93;   // 나무 건반 특유의 높은 배음, 아주 짧게
    e2.gain.setValueAtTime(0,t);e2.gain.linearRampToValueAtTime(g*.22,t+.002);e2.gain.exponentialRampToValueAtTime(.0006,t+.045);
    o2.connect(e2).connect(fxBus);o2.start(t);o2.stop(t+.08);
    nz(t,{type:"lowpass",f:1800,dur:.012,g:g*.25});   // 채가 닿는 아주 작은 '톡'
  }
  // 불 들어오는 소리 — 한눈에 비교 지도에서 칸 색이 1위부터 단계별로 켜질 때 '똑똑똑똑…'
  // 지도를 고를 때와 같은 나무 건반 '똑'(같은 음)을 단계마다 하나씩 (크기: LIGHT)
  function light(ms){
    if(!ready()||!ms||!ms.length)return;const t0=ctx.currentTime+.02;
    ms.forEach((m,i)=>bell(t0+m/1000,DING_F,.3*DING*LIGHT*(1-i/ms.length*.25),.55));
  }

  /* ───── 배경 음악: 잔잔한 화음 4개가 천천히 돌아가며 반복 ───── */
  // Cmaj7 → Am9 → Fmaj7 → G6sus — 차분하고 열린 느낌의 도시 밤 분위기
  const CHORDS=[[130.81,196.00,246.94,329.63],[110.00,164.81,246.94,261.63],[87.31,174.61,220.00,329.63],[98.00,146.83,220.00,293.66]];
  const BAR=6;   // 화음 하나 길이(초)
  function pad(t,freqs){
    freqs.forEach((f,i)=>{[-4,4].forEach(dt=>{   // 살짝 어긋난 두 음으로 부드럽게
      const o=ctx.createOscillator(),e=ctx.createGain();o.type=i?"triangle":"sine";o.frequency.value=f;o.detune.value=dt;
      e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(.05,t+2.2);e.gain.setValueAtTime(.05,t+BAR-1.2);e.gain.linearRampToValueAtTime(0,t+BAR+1.8);
      o.connect(e).connect(bgPad);o.start(t);o.stop(t+BAR+2);
    })});
    // 가끔 높은 음 하나가 맑게
    if(Math.random()<.6){const f=freqs[1+(Math.random()*3|0)]*4,d=t+1.5+Math.random()*2.5;
      const o=ctx.createOscillator(),e=ctx.createGain();o.type="sine";o.frequency.value=f;
      e.gain.setValueAtTime(0,d);e.gain.linearRampToValueAtTime(.025,d+.02);e.gain.exponentialRampToValueAtTime(.0008,d+2.5);
      o.connect(e).connect(bgEcho);o.start(d);o.stop(d+2.6)}
  }
  function loop(){if(!ctx)return;while(chordT<ctx.currentTime+1){pad(chordT,CHORDS[ci%CHORDS.length]);ci++;chordT+=BAR}}

  function init(){
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain();master.gain.value=0;
    const comp=ctx.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.3;
    master.connect(comp).connect(ctx.destination);
    fxBus=ctx.createGain();fxBus.connect(master);
    bgBus=ctx.createGain();bgBus.gain.value=0;bgBus.connect(master);
    const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1400;lp.connect(bgBus);
    bgPad=ctx.createGain();bgPad.connect(lp);
    const dl=ctx.createDelay(1.5);dl.delayTime.value=.55;const fb=ctx.createGain();fb.gain.value=.4;const wet=ctx.createGain();wet.gain.value=.5;
    bgEcho=ctx.createGain();bgEcho.connect(lp);bgEcho.connect(dl);bgPad.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(lp);
    chordT=ctx.currentTime+.2;setInterval(loop,500);loop();
  }
  // 막 켜지는 중(suspended)이어도 예약해 두면 켜지는 즉시 울림 → 첫 클릭 소리도 빠지지 않음
  function ready(){return on&&ctx&&ctx.state!=="closed"}
  // 첫 클릭·키 입력·터치 때 소리 시작 (브라우저 정책)
  function start(){
    if(started||!on)return;started=true;
    if(!ctx)init();
    master.gain.cancelScheduledValues(0);master.gain.value=VOL;   // 효과음은 첫 클릭부터 바로 제 크기로
    ctx.resume().then(()=>bgBus.gain.setTargetAtTime(BGM,ctx.currentTime,.8));   // 배경 음악만 천천히 올라옴
  }
  ["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,start,{capture:true,passive:true}));

  function toggle(){
    on=!on;try{localStorage.setItem("overload-sound",on?"on":"off")}catch(_){}
    paint();tell();
    if(on){started=false;start();if(ctx)master.gain.setTargetAtTime(VOL,ctx.currentTime,.4)}
    else if(ctx)master.gain.setTargetAtTime(0,ctx.currentTime,.3);
  }
  btn.addEventListener("click",e=>{e.stopPropagation();toggle()});

  fx=k=>{if(k==="latch"){latch();return}if(k.startsWith("place:")){place(+k.slice(6));return}if(k.startsWith("spin:")){spin(+k.slice(5));return}if(k.startsWith("light:")){try{light(JSON.parse(k.slice(6)))}catch(_){}}else if(k==="tap")tap();else if(k==="hover")ding();else if(k==="tick")swish(.7);else if(k==="rule")swish(1.3)};
  // 안쪽 화면에서 온 소리·요청
  let frame=null;
  const tell=()=>{if(frame)try{frame.contentWindow.postMessage("snd:state:"+(on?"on":"off"),"*")}catch(_){}};
  addEventListener("message",e=>{const d=e.data;if(typeof d!=="string"||!d.startsWith("snd:"))return;const k=d.slice(4);
    if(k==="toggle")toggle();
    else if(k==="hello"){try{e.source.postMessage("snd:state:"+(on?"on":"off"),"*")}catch(_){}}
    else if(k.startsWith("title:"))document.title=k.slice(6);
    else if(k.startsWith("url:")){if(frame&&e.source===frame.contentWindow)mark(k.slice(4))}
    else if(k==="wake")start();
    else if(k.startsWith("pos:")){if(!btn)return;const [x,y,w]=k.slice(4).split(",").map(Number);   // 안쪽 화면이 정한 소리 버튼 자리·크기
      [["right","auto"],["left",(x-w/2)+"px"],["top",(y-w/2)+"px"]].forEach(([p,v])=>btn.style.setProperty(p,v,"important"));sizeBtn(btn,w)}
    else{if(k==="tap")start();fx(k)}});

  /* ───── 페이지 넘기기: 음악이 끊기지 않게 다음 페이지를 이 페이지 위에 겹쳐 엶 ───── */
  const st=document.createElement("style");st.textContent=`
html.ow-shelled,html.ow-shelled body{overflow:hidden!important}
html.ow-shelled body>*:not(iframe[name="${SHELL}"]):not(#snd){visibility:hidden!important}
iframe[name="${SHELL}"]{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483000;background:#101010;opacity:0;transition:opacity .35s}
iframe[name="${SHELL}"].on{opacity:1}`;document.head.appendChild(st);
  const title0=document.title;
  // 지금 보고 있는 겹친 화면을 주소(#p=…)에 적어 둠 → 휴대폰에서 페이지가 다시 열려도 그 화면으로 돌아옴
  const rel=u=>{try{const x=new URL(u,location.href);return x.pathname.split("/").pop()+x.search+x.hash}catch(_){return u}};
  const mark=u=>{try{history.replaceState(history.state,"","#p="+encodeURIComponent(rel(u)))}catch(_){}};
  function go(url,restore){
    if(frame){frame.src=url;return}
    frame=document.createElement("iframe");frame.name=SHELL;frame.allow="autoplay; fullscreen";frame.src=url;
    frame.addEventListener("load",()=>{fitBtn();   // 다른 화면으로 가도 소리 버튼은 같은 자리
      frame.classList.add("on");document.documentElement.classList.add("ow-shelled");try{frame.contentWindow.focus()}catch(_){};tell()});
    document.body.appendChild(frame);
    try{history.pushState({ow:1},"","#p="+encodeURIComponent(rel(url)))}catch(_){}
  }
  if(location.hash.startsWith("#p=")){const u=decodeURIComponent(location.hash.slice(3));
    if(/^[\w-]+\.html/.test(u)){try{history.replaceState(null,"",location.pathname)}catch(_){}go(u,true)}}
  // 뒤로가기로 처음 페이지까지 돌아오면 겹친 화면을 걷어 냄
  addEventListener("popstate",e=>{if(!frame||(e.state&&e.state.ow))return;
    frame.remove();frame=null;document.documentElement.classList.remove("ow-shelled");document.title=title0;
    document.querySelectorAll("#fadeOut.on").forEach(el=>el.classList.remove("on"))});
  // 같은 폴더의 다른 페이지로 가는 링크는 겹쳐 열기
  addEventListener("click",e=>{
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest&&e.target.closest("a[href]");if(!a||(a.target&&a.target!=="_self")||a.hasAttribute("download"))return;
    let u;try{u=new URL(a.getAttribute("href"),location.href)}catch(_){return}
    if(u.protocol!==location.protocol||u.host!==location.host||!/\.html?$/i.test(u.pathname)||u.pathname===location.pathname)return;
    e.preventDefault();go(u.href);
  });

  return {
    setEra(){},speed(){},
    tick(){swish(.7)},     // 사진이 넘어갈 때
    rule(){swish(1.3)},    // 법·사업이 나타날 때 (조금 더 크게)
    tap,hover:ding,light,spin,place,latch,go,toggle,get on(){return on}
  };
})();

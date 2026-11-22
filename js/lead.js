/* 인트로 이후: 거리 사진 콜라주 → 제목 → 걷히며 역사 시작 */
/* ════════════ 거리 사진 콜라주 → 어두워지며 제목 → 투명도로 걷히며 역사 시작 ════════════ */
// [left%, top%, width%] (가로세로 3:2) — 화면을 다닥다닥 채우도록 배치
const STREET=[
 ["01",-3,-7,29],["06",23,-3,23],["03",43,-9,25],["05",65,-4,21],["14",83,-8,23],
 ["08",-5,27,25],["12",17,22,31],["10",46,25,22],["04",65,17,37],
 ["11",-3,62,29],["02",24,66,25],["13",47,59,24],["07",69,62,33]];
const lead=document.getElementById("lead"),tl=lead.querySelector(".tiles");
STREET.forEach(([n,l,t,w])=>{const d=document.createElement("div");d.className="tile";
  Object.assign(d.style,{left:l+"%",top:t+"%",width:w+"%",backgroundImage:`url(img/street/s${n}.jpg)`});tl.appendChild(d)});
const order=[...tl.children].map((e,i)=>[e,Math.random()]).sort((a,b)=>a[1]-b[1]).map(a=>a[0]);
let leadT=[],leadDone=false;
function resetLead(){leadT.forEach(clearTimeout);leadT=[];leadDone=false;lead.classList.remove("out","gone","dark","txt");[...tl.children].forEach(e=>e.classList.remove("on"))}
function endLead(){if(leadDone)return;leadDone=true;leadT.forEach(clearTimeout);
  lead.classList.add("out");document.body.classList.remove("intro-on");setTimeout(()=>lead.classList.add("gone"),1350);
  setTimeout(nudge,1500)}   // 역사가 시작되면 화면이 살짝 내려갔다 올라옴 — 아래로 스크롤하라는 힌트

/* 스크롤 힌트: 사용자가 아직 스크롤하지 않았을 때 한 번만, 살짝 내려갔다(약 110px) 제자리로 */
let nudgeN=0;
function nudge(){
  showHint();
  if(scrollY>8||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  if(++nudgeN<3)setTimeout(()=>{if(scrollY<8)nudge()},6500);   // 계속 멈춰 있으면 6.5초마다 한 번 더 (최대 3번)
  const R=document.documentElement;R.classList.add("nosnap");R.classList.remove("snap-on");   // 힌트 동안엔 스냅 끔
  let stop=false;const cancel=()=>{stop=true;R.classList.remove("nosnap")};
  ["wheel","touchstart","keydown","mousedown"].forEach(t=>addEventListener(t,cancel,{once:true,passive:true}));
  const D=110,T1=520,HOLD=160,T2=640,t0=performance.now();
  const eo=x=>1-Math.pow(1-x,3),eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  const step=now=>{if(stop)return;const t=now-t0;let y;
    if(t<T1)y=D*eo(t/T1);else if(t<T1+HOLD)y=D;else if(t<T1+HOLD+T2)y=D*(1-eio((t-T1-HOLD)/T2));else{scrollTo(0,0);R.classList.remove("nosnap");return}
    scrollTo(0,y);requestAnimationFrame(step)};
  requestAnimationFrame(step);
}
function playLead(){
  scrollTo(0,0);
  order.forEach((e,i)=>leadT.push(setTimeout(()=>{e.classList.add("on");setTimeout(()=>window.SND&&SND.place&&SND.place(i),70)},250+i*110)));   // 소리는 사진이 자리에 닿는 순간(약 0.07초 뒤)   // 사진이 하나씩 붙음 + '착'
  const t1=250+order.length*110+500;
  leadT.push(setTimeout(()=>lead.classList.add("dark"),t1));        // 화면이 어두워지고
  leadT.push(setTimeout(()=>lead.classList.add("txt"),t1+600));     // 제목 등장
  leadT.push(setTimeout(endLead,t1+600+2600));                      // 투명도로 걷히며 역사 시작
  // 클릭·스크롤·키로 건너뛰기 (제목이 뜬 뒤부터)
  const skip=()=>{if(lead.classList.contains("txt"))endLead()};
  lead.addEventListener("click",skip);lead.addEventListener("wheel",e=>{e.preventDefault();skip()},{passive:false});
  addEventListener("keydown",e=>{if(!leadDone&&["Enter","ArrowRight","ArrowDown"," "].includes(e.key))skip()});
}

/* 90동 페이지에서 '이전'으로 돌아오면(index.html#outro) 인트로를 건너뛰고 마무리 질문 화면으로 */
if(location.hash==="#outro"){
  const ib=document.getElementById("intro");ib.classList.add("done","gone");
  lead.classList.add("gone");leadDone=true;document.body.classList.remove("intro-on");
  
  history.replaceState(null,"",location.pathname);
  requestAnimationFrame(()=>requestAnimationFrame(()=>scrollTo(0,document.documentElement.scrollHeight)));
}

/* 역사 화면이 열리면 '스크롤' 안내 → 처음 스크롤하면 사라짐 */
(()=>{const h=document.getElementById("scrollHint");let shown=false;
  const chk=()=>{const ready=lead.classList.contains("out")||lead.classList.contains("gone");
    if(ready&&!shown&&scrollY<40){shown=true;h.classList.add("on");}
    if(scrollY>160)h.classList.remove("on");};   // 살짝 내려갔다 오는 힌트(110px)로는 사라지지 않게
  addEventListener("scroll",chk,{passive:true});setInterval(()=>{if(!shown)chk();},400);})();

/* 처음으로 버튼: 역사를 조금 내려간 뒤 나타나고, 누르면 1910년대로 */
(()=>{const b=document.getElementById("toTop");
  const chk=()=>b.classList.toggle("on",scrollY>innerHeight*1.2&&!document.body.classList.contains("intro-on"));
  addEventListener("scroll",chk,{passive:true});
  b.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));})();


/* 아래로 스크롤 안내 — 역사가 시작되면 화면 아래 가운데에 나타나고, 조금이라도 내려가면 사라짐 */
function showHint(){
  let h=document.getElementById("scrollHint");
  if(!h){h=document.createElement("div");h.id="scrollHint";h.setAttribute("aria-hidden","true");
    h.innerHTML='<span>아래로 스크롤해 100년을 넘겨 보세요</span><i class="mouse"><b></b></i><i class="chev"></i>';
    document.body.appendChild(h);
    const chk=()=>{if(scrollY>160){h.classList.remove("on");removeEventListener("scroll",chk)}};
    addEventListener("scroll",chk,{passive:true});}
  if(scrollY<=160)requestAnimationFrame(()=>h.classList.add("on"));
}
/* 맨 위로 버튼: 소리 버튼과 같은 세로줄·같은 크기 (1920×1080 기준 오른쪽 끝, 아래 여백 = 위 여백) */
(()=>{const b=document.getElementById("toTop");if(!b)return;
  function fit(){ if(innerWidth<=760){["left","right","bottom","width","height"].forEach(p=>b.style.removeProperty(p));return}
    const s=Math.min(innerWidth/1920,innerHeight/1080),ox=innerWidth/2-960*s,oy=innerHeight/2-540*s,w=Math.round(Math.max(30,52*s));
    b.style.setProperty("right","auto","important");b.style.setProperty("left",(ox+1862*s-w/2)+"px","important");
    b.style.setProperty("bottom",(innerHeight-(oy+(1080-73)*s)-w/2)+"px","important");
    ["width","height"].forEach(p=>b.style.setProperty(p,w+"px","important"));
    const ic=b.querySelector("svg");if(ic){const z=Math.round(w*.42);ic.setAttribute("width",z);ic.setAttribute("height",z)}}
  addEventListener("resize",fit);fit();})();

/* 역사 건너뛰기: 역사를 내리기 시작하면 오른쪽 아래에 나타나고, 누르면 맨 아래('어떻게 조사했는지 보기')로 바로 이동 */
(()=>{const b=document.getElementById("skipHist"),tt=document.getElementById("toTop");if(!b)return;
  const bottom=()=>document.documentElement.scrollHeight-innerHeight;
  const chk=()=>{const busy=document.body.classList.contains("intro-on")||document.body.classList.contains("start-on");
    const on=!busy&&scrollY>40&&scrollY<bottom()-innerHeight*1.2;
    b.classList.toggle("on",on);if(tt)tt.classList.toggle("lift",on)};   // 건너뛰기가 보이는 동안 '맨 위로'는 한 칸 위로
  addEventListener("scroll",chk,{passive:true});addEventListener("resize",chk);setInterval(chk,500);
  b.addEventListener("click",()=>{const f=document.getElementById("fadeOut"),R=document.documentElement;
    f.classList.add("on");
    setTimeout(()=>{R.classList.add("nosnap");scrollTo(0,bottom());
      setTimeout(()=>{R.classList.remove("nosnap");f.classList.remove("on")},150)},450)});
  function fit(){if(innerWidth<=760){["left","bottom","width","height"].forEach(p=>b.style.removeProperty(p));return}
    const s=Math.min(innerWidth/1920,innerHeight/1080),ox=innerWidth/2-960*s,oy=innerHeight/2-540*s,w=Math.round(Math.max(30,52*s));
    b.style.right="auto";b.style.left=(ox+1862*s-w/2)+"px";b.style.bottom=(innerHeight-(oy+(1080-73)*s)-w/2)+"px";b.style.width=b.style.height=w+"px";
    document.documentElement.style.setProperty("--lift",(w+Math.round(14*s))+"px");
    const ic=b.querySelector("svg"),z=Math.round(w*.42);ic.setAttribute("width",z);ic.setAttribute("height",z)}
  addEventListener("resize",fit);fit();chk();})();

/* 서울 9개 구역 · 90동 — 조사 방법 안내 + 지도에서 구역을 골라 '거리로 보기'로 이동 */
const DATA=window.OVERLOAD_DATA, GEO=window.WALK_GEO, $=s=>document.querySelector(s);
const YEAR={'관악구':2012,'강남구':2014,'서대문구':2014,'금천구':2015,'광진구':2016,'동대문구':2017,'동작구':2020,'강동구':2023,'노원구':2024};
const items=DATA.items;
items.forEach(o=>{o.e=[o.w[0]+o.t[0],o.w[1]+o.t[1]]; o.tot=[o.s[0]+o.e[0],o.s[1]+o.e[1]];});
const sum=(list,k)=>[0,1].map(i=>list.reduce((a,o)=>a+o[k][i],0));
function fmtRate(b,a){ if(b===0) return a===0?'0%':'-'; const r=Math.round((a-b)/b*100); return (r>0?'+':r<0?'−':'')+Math.abs(r)+'%'; }
const BA=(b,a)=>`<span class="pre">${b.toLocaleString()}</span><span class="ar">→</span><span class="now">${a.toLocaleString()}</span>`;

/* 지도 */
const MAP=GEO.map, cv=$('#seoul'), cx=cv.getContext('2d'), DW=900, S=DW/MAP.w, R=2;   // 화면 900px 폭, 캔버스는 2배 해상도
const SURV=Object.keys(YEAR);
const C={}; MAP.gu.forEach(g=>{let x=0,y=0,n=g.d.length/2; for(let k=0;k<g.d.length;k+=2){x+=g.d[k];y+=g.d[k+1];} C[g.n]=[x/n*S,y/n*S];});
let hov=null;
function draw(){
  cx.setTransform(R,0,0,R,0,0); cx.clearRect(0,0,DW,MAP.h*S);
  MAP.gu.forEach(g=>{ const on=SURV.includes(g.n), h=g.n===hov;
    cx.fillStyle= h?'#C3D132': on?(hov?'rgba(195,209,50,.38)':'rgba(195,209,50,.62)'):'rgba(250,250,250,.11)';
    const r= h?4.2: on?3.4:2.6;
    for(let k=0;k<g.d.length;k+=2){cx.beginPath(); cx.arc(g.d[k]*S,g.d[k+1]*S,r,0,7); cx.fill();}});
}
/* 구역 이름 라벨 (조사 구역은 연도와 함께) */
$('#labels').innerHTML=MAP.gu.map(g=>{const [x,y]=C[g.n], on=SURV.includes(g.n);
  return on?`<button class="lb on" data-g="${g.n}" style="left:${x}px;top:${y}px"><b>${g.n}</b><small>${YEAR[g.n]}</small></button>`
           :`<span class="lb" style="left:${x}px;top:${y}px">${g.n}</span>`;}).join('');
function guAt(px,py){ let best=1e9,who=null; MAP.gu.forEach(g=>{for(let k=0;k<g.d.length;k+=2){const q=(g.d[k]*S-px)**2+(g.d[k+1]*S-py)**2; if(q<best){best=q;who=g.n;}}});
  return best<(MAP.step*S*1.2)**2?who:null; }
function setHov(g){ if(g===hov) return; hov=g; draw(); if(g&&SURV.includes(g)&&window.SND&&SND.hover) SND.hover();   // 구역 위에 올리면 '띵'
  document.querySelectorAll('.lb.on').forEach(b=>b.classList.toggle('h',b.dataset.g===g));
  $('.mapbox').classList.toggle('pick',!!(g&&SURV.includes(g)));
  card(g&&SURV.includes(g)?g:null); }
// 지도 아래 한 줄: 평소엔 안내, 구역 위에 올리면 그 자리에서 그 구역 숫자로 바뀜 (데이터는 늘 같은 곳에만)
const HINT='<svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7"/></svg>지도에서 구역을 눌러 시작하세요';
function card(g){ const el=$('#mapinfo'); if(!el) return;
  if(!g){ el.classList.remove('on'); el.innerHTML=HINT; return; }
  const bl=items.filter(o=>o.d===g), s=sum(bl,'s'), e=sum(bl,'e'), t=sum(bl,'tot');
  el.innerHTML=`<b class="g">${g}</b><span class="y">${YEAR[g]}</span><span class="k">전체</span><b>${fmtRate(...t)}</b><span class="k c-s">간판</span><b class="c-s">${fmtRate(...s)}</b><span class="k c-e">기타 광고물</span><b class="c-e">${fmtRate(...e)}</b>`;
  el.classList.add('on'); }
const box=$('.mapbox'), MAPX=510, MAPY=222, MAPK=1.05;   // 지도 위치·확대 배율 (css .mapbox와 같게)
const local=e=>{const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*DW,(e.clientY-r.top)/r.height*MAP.h*S];};
box.addEventListener('pointermove',e=>{ if(e.target.closest('.card')) return; const b=e.target.closest('.lb.on'); const g=b?b.dataset.g:guAt(...local(e)); setHov(SURV.includes(g)?g:null); });   // 조사하지 않은 구는 반응 없음
box.addEventListener('pointerleave',()=>setHov(null));
box.addEventListener('click',e=>{ const b=e.target.closest('.lb.on'); const g=b?b.dataset.g:hov; if(g&&SURV.includes(g)) go(`views.html?d=${encodeURIComponent(g)}#walk`); });
document.querySelectorAll('.lb.on').forEach(b=>{b.addEventListener('focus',()=>setHov(b.dataset.g)); b.addEventListener('blur',()=>setHov(null));});

/* 페이지 이동 (검게 페이드) */
function go(url){ document.getElementById('fadeOut').classList.add('on'); setTimeout(()=>window.SND&&SND.go?SND.go(url):location.href=url,450); }
document.querySelectorAll('.go a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); go(a.getAttribute('href'));}));
addEventListener('pageshow',()=>document.getElementById('fadeOut').classList.remove('on'));

function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080); $('#art').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit); fit(); draw();

/* ───── 1단계: 조사 방법 원근형 캐러셀 (4장, 끝에서 처음으로 이어짐) ─────
   아래 점 4개 = 진행: 지금 카드(라임 긴 점) · 본 카드(밝은 점) · 아직 안 본 카드(어두운 점)
   4장을 다 보면 '지도에서 구역 고르기' 버튼이 나타남 (본 기록은 이 탭에서 유지 → 지도에서 돌아와도 그대로) */
(()=>{
  const cards=[...document.querySelectorAll('.pcd')], N=cards.length, pc=$('#pc'), dots=[...document.querySelectorAll('.pd')], live=$('#pcLive'), go=$('#pcGo'), btn=$('#toMap');
  const title=c=>c.querySelector('h3').innerHTML.replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
  const seen=new Set();   // 이 페이지를 열 때마다 처음부터 — 4장을 다 봐야 다음 버튼이 나타남
  let cur=0, first=true;
  function render(){
    cards.forEach((c,i)=>{ const d=i-cur;            // 1 ↔ 2 ↔ 3 ↔ 4 — 처음과 끝이 있음 (돌아가지 않음)
      c.dataset.pos=d===0?'c':d===1?'r':d===-1?'l':d<0?'bl':'br';
      c.setAttribute('aria-hidden',d===0?'false':'true'); });
    seen.add(cur);
    dots.forEach((d,i)=>{ d.classList.toggle('on',i===cur); d.classList.toggle('seen',seen.has(i)); if(i===cur) d.setAttribute('aria-current','step'); else d.removeAttribute('aria-current'); });
    if(!first) live.textContent=`${cur+1} / ${N} — ${title(cards[cur])}`;   // 화면 읽기: 넘길 때 제목 읽어 줌
    first=false;
    [['#pcPrev',cur===0],['#pcNext',cur===N-1]].forEach(([q,end])=>{const b=$(q);b.classList.toggle('end',end);b.setAttribute('aria-disabled',end);});
    const done=seen.size===N;
    go.classList.toggle('show',done); btn.tabIndex=done?0:-1; btn.setAttribute('aria-hidden',!done);
  }
  const move=n=>{   // 첫 카드에서 ←, 마지막 카드에서 → 는 멈춤 (다음 단계는 아래 '조사 결과 보기' 버튼으로만)
    const t=Math.max(0,Math.min(N-1,cur+n)); if(t===cur) return; cur=t; render(); };
  const goTo=i=>{ cur=i; render(); };
  const hit=b=>{b.classList.add('hit');clearTimeout(b._h);b._h=setTimeout(()=>b.classList.remove('hit'),220);};   // 누른 순간만 라임
  $('#pcPrev').addEventListener('click',e=>{hit(e.currentTarget);move(-1);});
  $('#pcNext').addEventListener('click',e=>{hit(e.currentTarget);move(1);});
  dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
  cards.forEach((c,i)=>c.addEventListener('click',()=>{ if(pc._swiped) return; if(c.dataset.pos==='l'||c.dataset.pos==='r') goTo(i); }));
  pc.addEventListener('keydown',e=>{
    const k={ArrowLeft:()=>move(-1),ArrowRight:()=>move(1),Home:()=>goTo(0),End:()=>goTo(N-1)}[e.key];
    if(k){ e.preventDefault(); k(); }
  });
  addEventListener('keydown',e=>{ if($('#art').dataset.step!=='brief'||pc.contains(document.activeElement)) return;
    if(e.key==='ArrowLeft'){e.preventDefault();move(-1);} else if(e.key==='ArrowRight'){e.preventDefault();move(1);} });
  let x0=null,y0=0;
  pc.addEventListener('pointerdown',e=>{ if(e.target.closest('.pnav')) return; x0=e.clientX; y0=e.clientY; });
  addEventListener('pointerup',e=>{ if(x0===null) return; const dx=e.clientX-x0, dy=e.clientY-y0; x0=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){ move(dx<0?1:-1); pc._swiped=true; setTimeout(()=>pc._swiped=false,0); } });
  addEventListener('pointercancel',()=>x0=null);
  render();
})();

/* ───── 단계 전환: 01 조사 방법(brief) → 02 조사 결과(result) → 03 구역 선택(map)
   주소 끝(#method·#result·#map)으로 단계를 기억 → 뒤로가기·새로고침·거리에서 돌아올 때도 맞는 단계 ───── */
(()=>{
  const art=$('#art'), ORDER=['brief','result','map'], HASH={brief:'',result:'#result',map:'#map'};
  const views=[...document.querySelectorAll('[data-stepview]')], steps=[...document.querySelectorAll('#steps li')];
  let reached=0; try{ reached=+sessionStorage.getItem('ow-reached')||0; }catch(_){}
  const BACK={brief:'이전으로 (간판개선사업 100년)',result:'이전 단계로 (조사 방법)',map:'이전 단계로 (조사 결과)'};
  function setStep(st,focus){
    const k=ORDER.indexOf(st); art.dataset.step=st;
    reached=Math.max(reached,k); try{ sessionStorage.setItem('ow-reached',reached); }catch(_){}
    views.forEach(el=>{ const on=el.dataset.stepview===st, i=ORDER.indexOf(el.dataset.stepview);
      el.classList.toggle('cur',on); el.classList.toggle('past',i<k);
      el.inert=!on; el.setAttribute('aria-hidden',!on); });
    steps.forEach((li,i)=>{ li.classList.toggle('on',i===k); li.classList.toggle('done',i<k);
      const b=li.querySelector('button'); b.disabled=i>reached; if(i===k) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
    $('.back').setAttribute('aria-label',BACK[st]);
    art.dispatchEvent(new CustomEvent('step',{detail:st}));
    card(null);
    if(focus){ const t=st==='map'?$('.mapbox'):(document.querySelector(`[data-stepview="${st}"] h2`)||$('#pc')); if(t){ if(!t.hasAttribute('tabindex')) t.tabIndex=-1; t.focus({preventScroll:true}); } }
  }
  const fromHash=()=>{ const h=location.hash; return Object.keys(HASH).find(k=>HASH[k]&&HASH[k]===h)||'brief'; };
  setStep(fromHash());
  requestAnimationFrame(()=>requestAnimationFrame(()=>art.classList.add('ready')));   // 첫 화면은 애니메이션 없이
  let depth=0;   // 이 페이지 안에서 앞으로 간 횟수 (뒤로가기로 되돌릴 수 있는 만큼)
  function goStep(st){ if(art.dataset.step===st) return;
    const fwd=ORDER.indexOf(st)>ORDER.indexOf(art.dataset.step);
    const url=location.pathname+location.search+HASH[st];
    try{ if(fwd){history.pushState(null,'',url);depth++;} else history.replaceState(null,'',url); }catch(_){}
    setStep(st,true); }
  function prev(){ const k=ORDER.indexOf(art.dataset.step); if(k<=0) return false;
    if(depth>0){ history.back(); return true; } goStep(ORDER[k-1]); return true; }
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>goStep(b.dataset.go)));
  steps.forEach((li,i)=>li.querySelector('button').addEventListener('click',()=>goStep(ORDER[i])));
  $('.back').addEventListener('click',e=>{ if(art.dataset.step!=='brief'){ e.preventDefault(); prev(); } });   // 첫 단계가 아니면 ← 는 앞 단계로
  addEventListener('popstate',()=>{ depth=Math.max(0,depth-1); setStep(fromHash(),true); });
})();

/* ───── 03 조사 결과: 들어올 때마다 숫자가 '차라락' — 간판은 줄고, 기타 광고물은 늘어남 ───── */
(()=>{
  const art=$('#art'), rolls=[...document.querySelectorAll('.roll')], pcts=[...document.querySelectorAll('.pct')];
  const fmt=n=>Math.round(n).toLocaleString('ko-KR'), fp=v=>(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(2)+'%';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0; const BASE=104, GAIN=1.5;   // 시작 글자 크기(px) · 변화율을 글자 크기에 1.5배로 (간판 −8% → 약 91px, 기타 +29% → 약 149px)
  // 숫자가 다 바뀌면 제목도 '90동을 세어 보니' → '간판은 줄었지만, 정보는 기타 광고물로 흩어졌어요'
  const res=$('#result'), t1=$('#resT .t1'), t2=$('#resT .t2');
  const sg=$('.bn.s'), dim=e=>{ sg.style.opacity=(1-.6*e).toFixed(3); };   // 간판은 줄어들며 점점 흐려짐 (1 → 0.4)
  const title=on=>{ res.classList.toggle('done',on); t1.setAttribute('aria-hidden',on); t2.setAttribute('aria-hidden',!on); };
  function run(){
    cancelAnimationFrame(raf);
    rolls.forEach(r=>{r.textContent=fmt(+r.dataset.from);r.style.fontSize=BASE+'px';}); pcts.forEach(p=>p.textContent=fp(0)); title(false); dim(0);
    if(reduce.matches){ rolls.forEach(r=>{r.textContent=fmt(+r.dataset.to);r.style.fontSize=(BASE*(1+(+r.dataset.to/+r.dataset.from-1)*(+r.dataset.gain||GAIN))).toFixed(1)+'px';}); pcts.forEach(p=>p.textContent=fp(+p.dataset.to)); title(true); dim(1); return; }
    const t0=performance.now()+550, D=1500; let lastTick=0;   // 화면이 떠오른 뒤 시작
    const step=now=>{ const k=Math.max(0,Math.min(1,(now-t0)/D)), e=1-Math.pow(1-k,3);
      rolls.forEach(r=>{ const a=+r.dataset.from,b=+r.dataset.to,v=a+(b-a)*e; r.textContent=fmt(v); r.style.fontSize=(BASE*(1+(v/a-1)*(+r.dataset.gain||GAIN))).toFixed(1)+'px'; });   // 처음엔 같은 크기 → 줄면 작아지고, 늘면 커짐
      pcts.forEach(p=>p.textContent=fp(+p.dataset.to*e)); dim(e);
      if(k>0&&k<1&&now-lastTick>(70+170*k)&&window.SND&&SND.light){ lastTick=now; SND.light([0]); }   // 숫자가 넘어가며 '톡톡톡' — 한눈에 비교에서 입면도가 켜질 때와 같은 나무 건반 소리 (점점 느려짐)
      if(k<1) raf=requestAnimationFrame(step); else title(true); };
    raf=requestAnimationFrame(step);
  }
  art.addEventListener('step',e=>{ if(e.detail==='result') run(); });
  if(art.dataset.step==='result') run();
})();


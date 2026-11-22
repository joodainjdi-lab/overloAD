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
    const al=on?KA[kind(g.n)]:0;   // 거리 유형별 진하기 — 창문 광고 ↑ 진하게 / 입간판 등 ↑ 중간 / 크게 변하지 않음 옅게
    cx.fillStyle= h?'#C3D132': on?`rgba(195,209,50,${(hov?al*.6:al).toFixed(2)})`:'rgba(250,250,250,.11)';
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
/* 구역에 올리면 그 구역 옆에 호버 카드 + 지도 진하기
   진하기 = 기타 광고물 증감률 구간 (데이터로 계산): +30% 이상 크게 늘어남 / −10%~+30% 변화가 작음 / −10% 이하 줄어듦
   '어디서 늘었나'(창문 vs 입간판·배너·현수막)는 카드 설명 문장으로만 */
const NET={}; SURV.forEach(g=>{const bl=items.filter(o=>o.d===g), s=sum(bl,'s'), w=sum(bl,'w'), t=sum(bl,'t'), e=sum(bl,'e');
  NET[g]={s:s[1]-s[0], w:w[1]-w[0], t:t[1]-t[0], e, r:(e[1]-e[0])/e[0]};});
function kind(g){const r=NET[g].r; return r>=.3?'u':r<=-.1?'d':'n';}
const KN={u:'기타 광고물이 크게 늘어난 거리', n:'기타 광고물 변화가 작은 거리', d:'기타 광고물이 줄어든 거리'};
const KA={u:.92,n:.42,d:.24};   // 지도 칠하기 진하기 (범례와 같은 값)
const pct=v=>(v>0?'+':v<0?'−':'')+Math.abs(Math.round(v*100))+'%';
function rng(k){const r=SURV.filter(g=>kind(g)===k).map(g=>NET[g].r).sort((a,b)=>a-b); return r.length>1?`${pct(r[0])} ~ ${pct(r[r.length-1])}`:pct(r[0]);}
/* 지도 범례 — 진하기가 뜻하는 것 (구역·범위는 데이터에서 계산) */
(()=>{const el=$('#mlegend'); if(!el) return; const who=k=>SURV.filter(g=>kind(g)===k).sort((a,b)=>NET[b].r-NET[a].r).map(g=>g.replace('구','')).join('·');
  el.innerHTML=['u','n','d'].filter(k=>SURV.some(g=>kind(g)===k)).map(k=>`<div class="li"><i style="background:rgba(195,209,50,${KA[k]})"></i><span><b>${KN[k].replace('기타 광고물이 ','').replace('기타 광고물 ','')}</b><small>${who(k)}</small></span></div>`).join('')+
   `<div class="li"><i style="background:rgba(250,250,250,.11)"></i><span><b class="mu">조사하지 않은 구</b></span></div>`;})();
/* 카드 설명 = '무엇이' (창문 vs 입간판·배너·현수막, 개수로) — 10개 미만 변화는 '크게 바뀌지 않음'으로 봄 */
function line(g){const n=NET[g], k=kind(g), A=Math.abs, big=v=>A(v)>=10;
  if(k==='u') return n.w>=n.t?'늘어난 광고물 대부분이 창문 광고예요.':'창문 광고보다 입간판·배너·현수막이 더 늘었어요.';
  if(k==='d') return (n.w<0&&n.t<0)?'창문 광고와 입간판·배너·현수막이 모두 줄었어요.':'기타 광고물이 줄었어요.';
  if(big(n.w)&&big(n.t)&&Math.sign(n.w)!==Math.sign(n.t)) return n.w<0?'전체 수는 거의 같지만, 창문 광고는 줄고 입간판·배너·현수막이 늘었어요.':'전체 수는 거의 같지만, 창문 광고는 늘고 입간판·배너·현수막이 줄었어요.';
  const r=n.r; return r>=.05?'기타 광고물이 조금 늘었어요.':r<=-.05?'기타 광고물이 조금 줄었어요.':'기타 광고물 수가 거의 같아요.';}
const sgn=v=>v>0?'+'+v:v<0?'−'+Math.abs(v):'0';
const nums=g=>{const n=NET[g]; return `<span class="hn"><span>창문 광고 <b>${sgn(n.w)}</b>개</span><span>입간판·배너·현수막 <b>${sgn(n.t)}</b>개</span></span>`;};
function card(g){ const el=$('#mapinfo'), hc=$('#hcard'); if(el){el.classList.remove('on'); el.innerHTML=HINT;} if(!hc) return;
  if(!g){ const lg=$('#mlegend'); if(lg) lg.classList.remove('dim'); hc.classList.remove('on'); const ln=$('#hlink'); if(ln) ln.classList.remove('on'); return; }
  const n=NET[g], k=kind(g), sg=v=>v>0?'+'+v:v<0?'−'+Math.abs(v):'0';
  const row=(cls,lab,v)=>{const w=Math.abs(v)/NMAX*50;
    return `<div class="hr ${cls}"><span class="hl">${lab}</span><span class="ht"><i style="${v>=0?'left:50%':'right:50%'};width:${Math.max(w,.6).toFixed(2)}%"></i></span><span class="hv">${sg(v)}</span></div>`;};
  hc.innerHTML=`<div class="hh"><b>${g}</b><span>${YEAR[g]} 사업 · ${2026-YEAR[g]}년 전</span></div>
    <span class="tag k-${k}">${KN[k]}</span>
    <div class="hb"><span class="hk">기타 광고물</span><b>${fmtRate(...n.e)}</b><span class="hc">${BA(n.e[0],n.e[1])}개</span></div>
    <p class="hs">${line(g)}</p>${nums(g)}<span class="hgo">누르면 거리로 걸어 보기 →</span>`;
  // 카드는 지도 밖 빈 자리에 — 지도 왼쪽 구역은 왼쪽, 오른쪽 구역은 오른쪽 (다른 구역 이름을 가리지 않게) + 구역까지 가는 가는 선
  const [x,y]=C[g], W=380, H=hc.offsetHeight||320, lf=x<430, top=Math.max(-40,Math.min(684-H+40,y-H/2));
  hc.style.left=(lf?-W-60:930)+'px'; hc.style.top=top+'px'; hc.classList.toggle('lf',lf); hc.classList.add('on'); const lg=$('#mlegend'); if(lg) lg.classList.toggle('dim',!lf);   // 범례는 오른쪽 아래 — 오른쪽 카드가 뜨면 잠시 숨김
  const ln=$('#hlink'); if(ln){ const x0=lf?-60:930, x1=lf?x-34:x+34; ln.style.left=Math.min(x0,x1)+'px'; ln.style.width=Math.abs(x1-x0)+'px'; ln.style.top=y+'px'; ln.classList.add('on'); } }
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
  cards.forEach((c,i)=>c.addEventListener('click',()=>{ if(pc._swiped) return; if(c.dataset.pos==='l'||c.dataset.pos==='r'){ if(window.SND&&SND.tap) SND.tap(); goTo(i); } }));   // 옆 카드를 눌러 넘길 때도 화살표와 같은 '톡'
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


/* 광고물 종류 도움말 — 조사 방법 04 카드(색으로 광고물을 나눠요)의 (i)를 누르면 조사 건물 실제 사진으로 보여 줌
   정의: 법제처 찾기쉬운 생활법령정보 「옥외광고물의 개념 및 분류」 (옥외광고물법 시행령 제3조) 를 쉬운 말로 옮김 */
(()=>{ const T=[
  ['s','wall','벽면 이용 간판','건물 벽면에 길게 붙인 간판이에요. 흔히 가로형 간판이라고 불러요.'],
  ['s','proj','돌출간판','건물 벽에서 길 쪽으로 튀어나오게 붙인 간판이에요.'],
  ['w','win','창문 이용 광고물','유리벽 안쪽, 창문, 출입문에 붙이거나 표시한 광고물이에요. 창에 붙인 시트·글씨가 여기에 들어가요.'],
  ['t','stand','입간판','벽에 기대 놓거나 땅에 세워 둔, 고정되지 않은 광고판이에요.'],
  ['t','banner','배너','세로로 긴 천을 받침대에 걸어 세운 광고예요. 법에서 따로 나누지는 않아서, 이 조사에서는 입간판·현수막과 함께 셌어요.'],
  ['t','hang','현수막','천·비닐 등에 글자를 써서 벽이나 기둥, 시설물에 매단 광고물이에요.']];
  const G={s:'간판',w:'기타 광고물 · 창문이용',t:'기타 광고물 · 입간판·배너·현수막'};
  const pop=document.createElement('div'); pop.id='adPop'; pop.setAttribute('role','dialog'); pop.setAttribute('aria-label','광고물 종류'); pop.hidden=true;
  pop.innerHTML=`<div class="aph"><b>광고물 종류</b><span>조사한 건물 사진으로 보는 예시</span><button class="apx" aria-label="닫기"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l8 8M11 3l-8 8"/></svg></button></div>
    <div class="apg">${T.map(([g,f,n,d])=>`<figure class="apc ${g}"><img src="img/help/${f}.jpg" alt="${n} 예시" loading="lazy"><figcaption><span class="tag"><i class="${g}"></i>${G[g]}</span><b>${n}</b><p>${d}</p></figcaption></figure>`).join('')}</div>
    <p class="aps">정의: 법제처 찾기쉬운 생활법령정보 「옥외광고물의 개념 및 분류」 · 사진: 조사 건물 현재 모습(동작구·강동구)</p>`;
  const bg=document.createElement('div'); bg.id='adDim'; bg.hidden=true; document.getElementById('art').append(bg,pop);
  const btn=document.getElementById('adHelp');
  const open=v=>{pop.hidden=!v; bg.hidden=!v; btn.setAttribute('aria-expanded',v); if(v) pop.querySelector('.apx').focus(); else btn.focus();};
  btn.addEventListener('click',e=>{e.stopPropagation(); open(pop.hidden);});
  pop.querySelector('.apx').addEventListener('click',e=>{e.stopPropagation(); open(false);});
  pop.addEventListener('click',e=>e.stopPropagation());
  document.addEventListener('click',()=>{ if(!pop.hidden) open(false); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!pop.hidden){ e.stopImmediatePropagation(); open(false); } },true);
})();

/* 종류 보기 버튼: 한 번 열어 보기 전까지는 은은하게 숨 쉬듯 반짝여 눌러 보고 싶게 */
(()=>{ const b=document.getElementById('adHelp'); if(!b) return;
  let seen=false; try{ seen=sessionStorage.getItem('ow-adhelp')==='1'; }catch(e){}
  if(!seen) b.classList.add('lure');
  b.addEventListener('click',()=>{ b.classList.remove('lure'); try{ sessionStorage.setItem('ow-adhelp','1'); }catch(e){} });
})();

const DATA=window.OVERLOAD_DATA;
const items=DATA.items, ORDER=DATA.order;
const $=s=>document.querySelector(s);
const YEAR={'관악구':2012,'강남구':2014,'서대문구':2014,'금천구':2015,'광진구':2016,'동대문구':2017,'동작구':2020,'강동구':2023,'노원구':2024};
const LIME=[195,209,50], MID=[140,111,59], PLUM=[86,14,69];
items.forEach(o=>{o.e=[o.w[0]+o.t[0],o.w[1]+o.t[1]];});
const MAX={s:0,e:0};
items.forEach(o=>{for(const k of ['s','e'])MAX[k]=Math.max(MAX[k],o[k][0],o[k][1])});
const tot=o=>[o.s[0]+o.w[0]+o.t[0], o.s[1]+o.w[1]+o.t[1]];
const rate=(b,a)=>b===0?(a===0?0:Infinity):(a-b)/b;
const per=o=>[o.st[0]?tot(o)[0]/o.st[0]:0, o.st[1]?tot(o)[1]/o.st[1]:0];

const FILTERS=[
 {id:'total',pal:'duo',name:'전체 광고물',q:'전체 광고물, 얼마나 늘었나?',desc:'개선 전 대비 증감률 %',what:'<b>전체 광고물</b> 증감률',unitTx:'개선 전 → 현재, %',L:'<b>많이 줄어든</b>',R:'<b>많이 늘어난</b>',v:o=>rate(...tot(o)),fmt:o=>fmtRate(...tot(o))},
 {id:'per',name:'가게당 광고물',q:'가게당 광고물, 몇 개?',desc:'현재 가게 하나당 개수',what:'<b>가게당 광고물</b> 개수',unitTx:'현재, 가게 1곳당',L:'<b>적게 단</b>',R:'<b>많이 단</b>',unit:true,v:o=>per(o)[1],fmt:o=>per(o)[1].toFixed(1)+'개'},
 {id:'s',pal:'mag',name:'간판',q:'간판, 얼마나 늘었나?',desc:'개선 전 대비 증감률 %',what:'<b>간판</b> 증감률',unitTx:'개선 전 → 현재, %',L:'<b>많이 줄어든</b>',R:'<b>많이 늘어난</b>',v:o=>rate(...o.s),fmt:o=>fmtRate(...o.s)},
 {id:'e',pal:'grn',name:'기타 광고물',q:'기타 광고물, 얼마나 늘었나?',desc:'개선 전 대비 증감률 %',what:'<b>기타 광고물</b> 증감률',unitTx:'창문이용·입간판·배너·현수막 · 개선 전 → 현재, %',L:'<b>많이 줄어든</b>',R:'<b>많이 늘어난</b>',v:o=>rate(...o.e),fmt:o=>fmtRate(...o.e)},
];
function fmtRate(b,a){ if(b===0) return a===0?'0%':'-'; const r=Math.round((a-b)/b*100); return (r>0?'+':r<0?'−':'')+Math.abs(r)+'%'; }
const nf=v=>typeof v==='number'&&!Number.isInteger(v)?+v.toFixed(1):v;   // 평균값은 소수 한 자리
const BA=(b,a)=>`<span class="pre">${nf(b)}</span><span class="ar">→</span><span class="now">${nf(a)}</span>`; // 개선 전(작게·흐리게) → 현재(진하게)
function fmtDelta(b,a){const d=a-b; return (d>0?'+':d<0?'−':'±')+Math.abs(d);}
const mix=(p,q,t)=>p.map((v,i)=>Math.round(v+(q[i]-v)*t));
const PAL={
 mag:{s:[[52,10,42],[124,30,100],[226,122,198]],dk:'#2a0821',lt:'#f5cfe9'},
 grn:{s:[[42,46,14],[110,120,30],[214,226,74]],dk:'#23260a',lt:'#eef3b4'},
 duo:{s:[[86,14,69],[140,111,59],[195,209,50]],dk:'#560E45',lt:'#C3D132'},
 gray:{s:[[26,25,26],[64,63,64],[168,167,168]],dk:'#141414',lt:'#d6d6d6'}};
let pal=PAL.gray;
const grad=t=>t<.5?mix(pal.s[0],pal.s[1],t*2):mix(pal.s[1],pal.s[2],(t-.5)*2);
const lum=c=>(.2126*c[0]+.7152*c[1]+.0722*c[2])/255;

/* build axis labels */
$('#cols').innerHTML=Array.from({length:10},(_,i)=>`<div>B${String(i+1).padStart(2,'0')}</div>`).join('');
$('#rows').innerHTML=ORDER.map(d=>`<div data-d="${d}">${d}</div>`).join('');

/* cells */
const grid=$('#grid');
items.forEach((o,i)=>{
  const btn=document.createElement('button');
  btn.className='cell in'; btn.style.setProperty('--ad',(Math.floor(i/10)*40+(i%10)*25)+'ms');
  btn.setAttribute('aria-label',`${o.d} ${o.b} ${o.name}`);
  const e=o.ev, sc=Math.min(60/e.w,50/e.h), W=e.w*sc, H=e.h*sc;
  btn.innerHTML=`<svg width="${W.toFixed(1)}" height="${H.toFixed(1)}" viewBox="0 0 ${e.w} ${e.h}" fill="none" stroke="currentColor" stroke-width="0.5">${e.g}</svg><span class="rk"></span>`;
  btn.addEventListener('click',ev=>{ev.stopPropagation(); select(i,true);});
  btn.addEventListener('animationend',()=>btn.classList.remove('in'),{once:true});
  btn.addEventListener('mouseenter',()=>showTip(i,btn));
  btn.addEventListener('mouseleave',hideTip);
  btn.addEventListener('focus',()=>showTip(i,btn));
  btn.addEventListener('blur',hideTip);
  o.el=btn; grid.appendChild(btn);
});

/* filter menu */
const DEF=FILTERS.find(f=>f.id==='per');
let cur=DEF;
const optHTML=i=>{const f=FILTERS[i]; return `<button class="opt" role="menuitemradio" aria-checked="false" data-i="${i}"><span class="box"><i></i></span><span class="tx"><b>${f.q}</b><i>${f.desc}</i></span></button>`;};
$('#menu').innerHTML=['per','total','s','e'].map(id=>optHTML(FILTERS.findIndex(f=>f.id===id))).join('')+
 `<hr><button class="reset" id="reset"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3.5 9a5.5 5.5 0 1 0 1.7-4"/><path d="M3.5 2.5v3h3"/></svg>초기화</button>`;
const filterEl=$('#filter');
$('#filterBtn').addEventListener('click',e=>{e.stopPropagation(); const o=filterEl.classList.toggle('open'); $('#filterBtn').setAttribute('aria-expanded',o);});
document.querySelectorAll('.opt').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); applyFilter(FILTERS[+b.dataset.i]); filterEl.classList.remove('open'); $('#filterBtn').setAttribute('aria-expanded',false);}));
$('#reset').addEventListener('click',e=>{e.stopPropagation(); applyFilter(null); filterEl.classList.remove('open');});

let seqReady=false; // 첫 로딩은 기존 등장 애니메이션, 이후 필터를 바꿀 때마다 순위 순서로 페이드인
function applyFilter(f){
  cur=f; $('#panel').dataset.f=f?f.id:'all';
  if(seqReady) sweep();   // 보는 기준을 바꿀 때도 건물을 고를 때처럼 개선 전/현재 사진이 한 번 쓸고 지나감

  document.querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-checked',!!f&&FILTERS[+b.dataset.i]===f));
  $('#filterLab').textContent=f?f.name:'선택 안 함';
  const leg=$('#legend');
  if(!f){
    items.forEach(o=>{o.el.style.removeProperty('--c');o.el.style.removeProperty('--k');o.el.style.setProperty('--dl','0ms');o.rank=null;});
    grid.classList.remove('ranked'); leg.classList.add('off'); if(focusOn) setFocus(true); renderTop5();
    $('#legL').innerHTML='<span class="wt">보는 기준을 고르면 순위대로 색이 바뀌어요</span>'; $('#legR').innerHTML='';
    return;
  }
  leg.classList.remove('off'); leg.dataset.f=f.id;
  pal=PAL[f.pal||'gray'];
  // 범례 머리: 지금 색이 무엇을 뜻하는지 크게
  $('#legL').innerHTML=`<span class="rkx">1위가 가장 ${f.R.replace(/<\/?b>/g,'')} 건물</span>`;
  $('#legR').innerHTML=`<span class="nine">색 10단계 · 한 칸 = 건물 9동</span>`;
  let L=f.L.replace(/<\/?b>/g,''), R=f.R.replace(/<\/?b>/g,'');
  if(f.unit){const vs=items.map(f.v); L+=` ${Math.min(...vs).toFixed(1)}개`; R+=` ${Math.max(...vs).toFixed(1)}개`;}
  leg.dataset.l=L; leg.dataset.r=R;
  // rank (ties share average rank) → evenly spread colour
  const idx=items.map((o,i)=>[f.v(o),i]).sort((a,b)=>a[0]-b[0]);
  const n=idx.length; let k=0;
  while(k<n){ let j=k; while(j+1<n && idx[j+1][0]===idx[k][0]) j++;
    const t=((k+j)/2)/(n-1);
    for(let m=k;m<=j;m++){ const o=items[idx[m][1]]; o.tt=t; }
    k=j+1; }
  // 순위 1–90: 많이 늘어난(가게당은 많이 단) 건물이 1위 — TOP 5와 같은 기준
  rankOrder(f).forEach((i,m)=>{items[i].rank=m+1; items[i].seq=m;});
  // 색: 1–90위를 9개씩 10단계로 묶음 (1–9위 = 1단계, 가장 밝음)
  //  · 전체 광고물·가게당 광고물: 그라데이션 10색
  //  · 간판(자홍)·기타 광고물(그린): 기본색 하나 + 투명도 10단계 — 줄어들수록 투명 → 어둡게
  const STEPS=stepColors(f);
  items.forEach(o=>{
    const k=Math.min(9,Math.floor((o.rank-1)/9)), sc=STEPS[k];   // k: 0(1–9위) … 9(82–90위)
    o.step=k+1;
    o.el.style.setProperty('--dl',(o.seq*16)+'ms'); // 1→90위 순서로 딴·딴·딴
    o.el.style.setProperty('--c',sc.c);
    o.el.style.setProperty('--k',sc.k);
    o.el.querySelector('.rk').textContent=o.rank;
  });
  leg.querySelector('.bar').style.background='none';
  let sn=leg.querySelector('.sn'); if(!sn){sn=document.createElement('div');sn.className='sn';leg.appendChild(sn);}
  sn.innerHTML=`<span>${leg.dataset.l} · 82–90위</span><span>1–9위 · ${leg.dataset.r}</span>`;
  leg.querySelector('.bar').innerHTML=STEPS.slice().reverse().map((s,i)=>`<i data-s="${10-i}" style="background:${s.c}" title="${10-i}단계 · ${(9-i)*9+1}–${(10-i)*9}위"></i>`).join('');
  grid.classList.add('ranked'); if(typeof showGrp==='function') showGrp(grpLock);
  if(seqReady&&window.SND&&SND.light){ const t=[]; items.forEach(o=>{const k=o.step-1; t[k]=Math.min(t[k]??1e9,o.seq*16);}); SND.light(t.filter(v=>v<1e9)); }   // 칸 색이 단계별로 켜질 때 소리
  if(seqReady){ // 보는 기준을 바꿔도 고른 건물·팝업은 그대로 — 색만 1→90위 순서로 다시 켜짐
    items.forEach(o=>o.el.classList.remove('in','seq'));
    if(focusOn||distD){ if(focusOn) setFocus(true); }   // 건물·구역을 고른 상태면 칸 크기 애니메이션 없이 색만 순서대로 바뀜 (겹쳐서 버벅이지 않게)
    else { void grid.offsetWidth; items.forEach(o=>o.el.classList.add('seq')); } }
  else if(focusOn) setFocus(true);
  seqReady=true;
  renderTop5();
  if(distD) openDist(distD);   // 구역 전체 팝업도 보는 기준에 맞춰 다시 정리
}

/* 10단계 색 */
const BASE={s:[226,122,198], e:[195,209,50]};   // 간판 자홍 · 기타 광고물 그린(라임)
function stepColors(f){
  return Array.from({length:10},(_,k)=>{
    if(BASE[f.id]){ const a=1-k*.095, c=BASE[f.id];   // 1단계 불투명 → 10단계 거의 투명
      const mixd=c.map(v=>Math.round(16+(v-16)*a));   // 배경(#101010) 위에서 보이는 실제 색 — 글자색 판단용
      return {c:`rgba(${c},${a.toFixed(3)})`, k:lum(mixd)>.42?pal.dk:pal.lt}; }
    const c=grad(1-k/9); return {c:`rgb(${c})`, k:lum(c)>.42?pal.dk:pal.lt};
  });
}

/* TOP 5 — 필터별 순위 (드롭다운: 접으면 TOP1만, 펼치면 TOP1–5) */
const T5={
 per:{t:'가게당 광고물이 많은 TOP 5',sort:(a,b)=>per(b)[1]-per(a)[1]},
 total:{t:'전체 광고물이 많이 늘어난 TOP 5',k:o=>tot(o)},
 s:{t:'간판이 많이 늘어난 TOP 5',k:o=>o.s},
 e:{t:'기타 광고물이 많이 늘어난 TOP 5',k:o=>o.e}};
let t5Open=false;
function rankOrder(f){const d=T5[f.id];
  const cmp=d.sort||((a,b)=>{const [ab,aa]=d.k(a),[bb,ba]=d.k(b),ra=rate(ab,aa),rb=rate(bb,ba);
    const x=(isFinite(rb)?rb:-9)-(isFinite(ra)?ra:-9); return x||((ba-bb)-(aa-ab)); }); // 증가율 높은 순, 같으면 더 많이 늘어난 개수 순 (개선 전 0개는 비율 계산 불가라 뒤로)
  return items.map((o,i)=>i).sort((a,b)=>cmp(items[a],items[b]));}
const top5List=f=>rankOrder(f).slice(0,5);
function renderTop5(){
  const box=$('#top5');
  if(!cur){box.classList.add('off');return;} box.classList.remove('off');
  $('#t5T').innerHTML=`<b>TOP 5</b> ${T5[cur.id].t.replace(' TOP 5','')}`;
  $('#t5List').innerHTML=top5List(cur).map((i,r)=>{const o=items[i],e=o.ev,sc=Math.min(54/e.w,46/e.h);
    return `<button class="t5" data-i="${i}" style="--c:${o.el.style.getPropertyValue('--c')||'#333'};--k:${o.el.style.getPropertyValue('--k')||'#fff'}">
      <span class="blk"><span class="ev"><svg width="${(e.w*sc).toFixed(1)}" height="${(e.h*sc).toFixed(1)}" viewBox="0 0 ${e.w} ${e.h}" fill="none" stroke="currentColor" stroke-width="0.5">${e.g}</svg></span>
      <span class="tx"><b>TOP${r+1}</b><span>${o.b}<em>${o.name}</em></span></span><span class="v">${cur.fmt(o)}</span></span>
      <span class="ph"><img src="${o.pa}" alt="" decoding="async"></span></button>`;}).join('');
  $('#t5List').querySelectorAll('.t5').forEach((b,r)=>b.addEventListener('click',e=>{e.stopPropagation(); select(+b.dataset.i,true);}));
}
function setT5(){}   // TOP 5는 접지 않고 늘 다 펼쳐 둠 — 팝업을 스크롤해서 봄
$('#top5').classList.add('open'); { const h=$('#t5Hd'); h.removeAttribute('aria-expanded'); h.tabIndex=-1; h.querySelector('svg')?.remove(); }

/* tooltip */
const tip=$('#tip');
function showTip(i,el){
  const o=items[i]; const f=cur||FILTERS[0];
  tip.innerHTML=`<b>${o.d} ${o.b}</b> · ${o.name} <span>· ${f.name} ${f.fmt(o)}${cur&&o.rank?` · ${o.rank}/90`:''}</span>`;
  const r=el.getBoundingClientRect(), a=$('#art').getBoundingClientRect(), s=a.width/1920;
  tip.style.left=((r.left-a.left)/s)+'px'; tip.style.top=((r.top-a.top)/s-46)+'px';
  tip.classList.add('on');
}
function hideTip(){tip.classList.remove('on');}

/* selection */
let sel=-1, focusOn=false;
function select(i,fromClick){
  if(fromClick && focusOn && sel===i){ setFocus(false); return; }
  sel=i; items.forEach((o,k)=>o.el.classList.toggle('sel',k===i));
  if(fromClick) setFocus(true);
  document.querySelectorAll('#rows div').forEach(r=>{r.classList.toggle('on',focusOn&&r.dataset.d===items[i].d); r.classList.toggle('dim',focusOn&&r.dataset.d!==items[i].d);});
  render(items[i]); if(fromClick) touched=true; post();
}
/* 보기 전환 연결 — 상위 페이지와 현재 선택 건물을 주고받음 */
let touched=false;
function post(){ if(!items[sel]) return; try{ if(parent!==window) parent.postMessage({ov:'state',view:'map',d:items[sel].d,b:items[sel].b,focus:focusOn,user:touched},'*'); }catch(e){} }
/* 거리로 보기 → 한눈에 비교: 선택을 풀고 '가게당 광고물' 기준으로 90칸이 1위부터 다시 켜짐 */
addEventListener('message',e=>{ const m=e.data; if(!m||m.ov!=='replay') return;
  setFocus(false); items.forEach(o=>o.el.classList.remove('in','seq')); grid.style.visibility='hidden';
  clearTimeout(window.__selT);
  setTimeout(()=>{ grid.style.visibility=''; applyFilter(DEF);
    const w=m.sel; if(!w||!w.d) return;   // 거리로 보기에서 고른 건물: 90칸이 다 켜진 뒤 강조
    window.__selT=setTimeout(()=>{ const i=items.findIndex(o=>o.d===w.d&&o.b===(w.b||'B01')); if(i<0) return;
      touched=true; select(i,false);
      if(w.b&&w.focus){ setFocus(true); }
      else { const r=[...document.querySelectorAll('#rows div')].find(x=>x.dataset.d===w.d); if(r){r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash');} }
    },items.length*16+650);
  },220); });
addEventListener('message',e=>{ const m=e.data; if(!m||m.ov!=='apply') return;
  const i=items.findIndex(o=>o.d===m.d&&o.b===(m.b||'B01')); if(i<0) return;
  touched=true; select(i,false); setFocus(!!(m.b&&m.focus));
  if(!m.b){ const r=[...document.querySelectorAll('#rows div')].find(x=>x.dataset.d===m.d); if(r){r.classList.remove('flash'); void r.offsetWidth; r.classList.add('flash');} }

});
function setFocus(v){ if(distD){ distD=null; $('#panel').classList.remove('dmode'); grpLock=null; showGrp(null); document.querySelectorAll('#rows div').forEach(r=>r.classList.remove('d-on')); }
  focusOn=v; if(v) touched=true; setTimeout(post); grid.classList.toggle('focus',v);
  $('#panel').classList.toggle('open',v); $('#panel').setAttribute('aria-hidden',!v); $('#art').classList.toggle('pop',v);   // 건물을 고르면 오른쪽 팝업이 열리고 비트맵은 왼쪽으로 비켜 줌 if(sel>=0){const c=items[sel].el.style.getPropertyValue('--c'); $('#art').style.setProperty('--sel', c?`color-mix(in srgb, ${c} 70%, #fff)`:'var(--ink)');}
  document.querySelectorAll('#rows div').forEach(r=>{r.classList.toggle('on',v&&r.dataset.d===items[sel].d); r.classList.toggle('dim',v&&r.dataset.d!==items[sel].d);});}
$('#art').addEventListener('click',e=>{ if(!e.target.closest('.panel,.filter,.top5,.rows,.cols,.legend,.pclose')){ setFocus(false);} if(!e.target.closest('.filter')) filterEl.classList.remove('open'); if(!e.target.closest('.top5')) setT5(false); });
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){setFocus(false);filterEl.classList.remove('open');grpLock=null;showGrp(null);}
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key) && document.activeElement?.classList.contains('cell')){
    e.preventDefault(); let r=Math.floor(sel/10), c=sel%10;
    if(e.key==='ArrowLeft')c=(c+9)%10; if(e.key==='ArrowRight')c=(c+1)%10; if(e.key==='ArrowUp')r=(r+8)%9; if(e.key==='ArrowDown')r=(r+1)%9;
    const ni=r*10+c; items[ni].el.focus(); select(ni,false); if(!focusOn) setFocus(true); else setFocus(true);
  }
});

/* photo compare */
const photo=$('#photo'); let P=50;
function setP(v,anim){P=Math.max(0,Math.min(100,v)); photo.style.setProperty('--p',P+'%'); photo.setAttribute('aria-valuenow',Math.round(P));
  $('#pct').textContent=`${Math.round(P)} : ${100-Math.round(P)}`;
  photo.querySelector('.tag.l').style.opacity=P<8?0:1; photo.querySelector('.tag.r').style.opacity=P>92?0:1;}
photo.addEventListener('wheel',e=>{e.preventDefault(); setP(P-(e.deltaY||e.deltaX)*0.12);},{passive:false});
let drag=false;
const posP=e=>{const r=photo.getBoundingClientRect(); setP((e.clientX-r.left)/r.width*100);};
photo.addEventListener('pointerdown',e=>{drag=true;photo.setPointerCapture(e.pointerId);posP(e);});
photo.addEventListener('pointermove',e=>{if(drag)posP(e);});
photo.addEventListener('pointerup',()=>drag=false);
photo.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){setP(P-5);e.preventDefault();} if(e.key==='ArrowRight'){setP(P+5);e.preventDefault();}});
function sweep(){ const t0=performance.now(); const from=0, to=50;   // 왼쪽 끝 → 가운데로 이동
  const step=t=>{const k=Math.min(1,(t-t0)/700), e=1-Math.pow(1-k,3); setP(from+(to-from)*e); if(k<1)requestAnimationFrame(step);};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) setP(50); else requestAnimationFrame(step); }

/* 전체 광고물 점 그래프 — 광고물 1개 = 점 1개 (해바라기 배열: 안쪽부터 입간판·배너·현수막 → 간판 → 창문이용) */
function dots(o){
  const R=54, r=2.1, c=4.75, GA=Math.PI*(3-Math.sqrt(5));   // 90동 모두 같은 간격 → 점 무리 크기로 바로 비교 (최대 116개도 들어감)
  const one=(k,lab)=>{const cats=[['t',o.t[k]],['s',o.s[k]],['w',o.w[k]]]; let i=0, html='';
    for(const [cl,n] of cats) for(let m=0;m<n;m++,i++){const rr=c*Math.sqrt(i+.5), th=i*GA;
      html+=`<circle class="${cl}" cx="${(R+rr*Math.cos(th)).toFixed(1)}" cy="${(R+rr*Math.sin(th)).toFixed(1)}" r="${r}" style="--i:${i}"/>`;}
    return `<figure><svg width="${R*2}" height="${R*2}" viewBox="0 0 ${R*2} ${R*2}">${html}</svg><figcaption>${lab} <b>${i}</b></figcaption></figure>`;};
  return `<div class="pair">${one(0,'BEFORE')}${one(1,'NOW')}</div>`;
}

/* panel render */
let openE=false;
{ const pn=$('#panel'); pn.insertBefore($('#who'),$('#photo')); }
{ const pn=$('#panel'), x=document.createElement('button'); x.className='x'; x.setAttribute('aria-label','닫기'); x.title='닫기 (Esc)';
  x.innerHTML='<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3l8 8M11 3l-8 8"/></svg>';
  x.addEventListener('click',e=>{e.stopPropagation(); setFocus(false);}); pn.prepend(x); pn.setAttribute('aria-hidden','true'); }   // 닫기(X)는 팝업 안 오른쪽 위
{ const pn=$('#panel'); pn.appendChild($('#top5'));   // TOP 5는 팝업 맨 아래
  const pin=document.createElement('div'); pin.className='pin';   // 내용만 스크롤 — 맨 윗줄(보는 기준·닫기)은 가리지 않음
  [...pn.children].filter(c=>!c.classList.contains('x')).forEach(c=>pin.appendChild(c)); pn.appendChild(pin); }   // 거리로 보기처럼 건물 코드를 사진 위로
function render(o){
  $('#imgB').src=o.pb; $('#imgA').src=o.pa;
  $('#imgB').alt=`${o.name} 개선 전 로드뷰`; $('#imgA').alt=`${o.name} 현재 로드뷰`;
  $('#lo').hidden=!o.lo;
  sweep();
  const [tb,ta]=tot(o), [pb,pa]=per(o);
  const cls=ta>tb?'up':ta<tb?'down':'flat';
  $('#who').innerHTML=`<div class="fade"><h2>${o.d} ${o.b}<span class="nm">${o.name}</span></h2></div>`;
  $('#sum').innerHTML=`<div class="fade sec-big"><div class="k">전체 광고물 (개선 전 → 현재)</div><div class="row"><span class="rate">${fmtRate(tb,ta)}</span><span class="cnt">${BA(tb,ta)}<small>개</small></span></div></div>
    <div class="r fade sec-rate"><div class="k">전체 광고물 증감</div><div class="badge ${cls}">${fmtRate(tb,ta)}</div><div class="d">${fmtDelta(tb,ta)}개 (${BA(tb,ta)})</div><div class="lg"><span class="s">간판</span><span class="w">창문이용</span><span class="t">입간판·배너·현수막</span></div></div>
    <div class="sec-dots">${dots(o)}</div>`;
  $('#stats').innerHTML=`<div><span class="k">식별 업소</span><b>${BA(o.st[0],o.st[1])}</b></div><div><span class="k">업소당 광고물</span><b>${BA(pb.toFixed(1),pa.toFixed(1))}</b></div><div><span class="k">층당 광고물 (현재)</span><b>${(ta/o.fl).toFixed(1)}</b></div>`;
  const track=(b,a,M)=>{const lo=Math.min(a,b)/M*100, hi=Math.max(a,b)/M*100;
    return `<div class="track"><div class="seg" style="left:${lo}%;width:${Math.max(hi-lo,0)}%"></div><div class="dot b" style="left:${b/M*100}%"></div><div class="dot a" style="left:${a/M*100}%"></div></div>`;};
  const val=(b,a)=>`<span class="val">${BA(b,a)}<b>${fmtRate(b,a)}</b></span>`;
  const sub=(label,k)=>{const [b,a]=o[k]; return `<div class="sub-row"><div class="top"><span class="name">${label}</span><b class="pc">${fmtRate(b,a)}</b></div><div class="ba">${BA(b,a)}</div>${track(b,a,MAX.e)}</div>`;};
  $('#bars').innerHTML=`<div class="hd"><span>유형별 광고물</span><span>○ 개선 전 ● 현재</span></div>`+
    `<div class="bar-row r-sign"><div class="top"><span class="name">간판</span>${val(...o.s)}</div>${track(...o.s,MAX.s)}</div>`+
    `<div class="bar-row r-win grp${openE?' open':''}"><div class="top"><button class="name tg" id="tgE" aria-expanded="${openE}" aria-controls="subE">기타 광고물<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 5.5L7 9l3.5-3.5"/></svg></button>${val(...o.e)}</div>${track(...o.e,MAX.e)}
     <div class="fold" id="subE"><div class="wrap"><div class="subs">${sub('창문이용 광고물','w')}${sub('입간판 배너 현수막','t')}</div></div></div></div>`;
  $('#tgE').addEventListener('click',e=>{e.stopPropagation(); openE=!openE; $('#bars .grp').classList.toggle('open',openE); e.currentTarget.setAttribute('aria-expanded',openE);});
  $('#notes').innerHTML='막대 길이는 90동 중 유형별 최댓값 기준 · 세부 항목은 기타 광고물과 같은 축'+(o.notes.length?` · <em>${o.notes.join(' / ')}</em>`:'');
}

/* scale artboard */
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080); $('#art').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit); fit();

applyFilter(DEF);
select(0,false);

/* TOP 5 는 화면 맨 아래에 고정하지 않고, 위 내용 바로 아래(간격 28px)에 붙임 — 화면을 넘치면 아래쪽에 맞춤 */
(()=>{const pn=$('#panel'), t5=$('#top5'); if(!pn||!t5) return;
  const place=()=>{ t5.style.top='792px'; t5.style.bottom='auto'; };   // 보는 기준과 상관없이 같은 자리
  try{ new ResizeObserver(place).observe(pn); new ResizeObserver(place).observe(t5); }catch(e){}
  addEventListener('load',place); setTimeout(place,300);})();

/* 묶어 보기: 구 이름(행)·B 번호(열)·색띠에 마우스를 올리거나 누르면 그 묶음 칸만 강조 (누르면 고정, 다시 누르거나 Esc로 해제) */
var grpLock=null;
const grpKey=g=>g?g.t+':'+g.v:'';
function inGrp(o,g){ return g.t==='d'?o.d===g.v : g.t==='b'?o.b===g.v : o.step===g.v; }
function showGrp(g){
  const on=!!g&&(g.t!=='s'||!!cur);
  grid.classList.toggle('grp',on);
  items.forEach(o=>o.el.classList.toggle('g-on',on&&inGrp(o,g)));
  document.querySelectorAll('#rows div').forEach(r=>r.classList.toggle('g-lab',on&&g.t==='d'&&r.dataset.d===g.v));
  document.querySelectorAll('#cols div').forEach(c=>c.classList.toggle('g-lab',on&&g.t==='b'&&c.dataset.b===g.v));
  document.querySelectorAll('#legend .bar i').forEach(b=>b.classList.toggle('g-lab',on&&g.t==='s'&&+b.dataset.s===g.v));
  $('#legend').classList.toggle('g-any',on&&g.t==='s');
}
function bindGrp(el,get,onClick){
  el.addEventListener('mouseover',e=>{const g=get(e.target); if(g) showGrp(g);});
  el.addEventListener('mouseleave',()=>showGrp(grpLock));
  el.addEventListener('click',e=>{const g=get(e.target); if(!g) return; e.stopPropagation();
    if(onClick){ onClick(g); if(window.SND&&SND.tap) SND.tap(); return; }
    grpLock=grpKey(grpLock)===grpKey(g)?null:g; showGrp(grpLock||g); if(window.SND&&SND.tap) SND.tap();});
}
document.querySelectorAll('#cols div').forEach((c,i)=>c.dataset.b='B'+String(i+1).padStart(2,'0'));
bindGrp($('#rows'),t=>{const r=t.closest('#rows div'); return r&&{t:'d',v:r.dataset.d};},
  g=>{ if(distD===g.v){ setFocus(false); return; } openDist(g.v); });   // 구 이름을 누르면 그 구역 평균을 팝업으로
// B 번호(열)는 묶어 보기에서 뺌 — 건물 이름일 뿐이라 같은 번호끼리 묶을 의미가 없음
bindGrp($('#legend'),t=>{const b=t.closest('.bar i'); return b&&cur&&{t:'s',v:+b.dataset.s};});

/* 구역 평균: 구 이름을 누르면 그 구역 10동의 평균을 건물 팝업과 같은 틀로 보여 줌 (9구역 평균과 비교) */
var distD=null;
const r1=v=>Math.round(v*10)/10;
function avgOf(list,label,sub){ const m=k=>[0,1].map(j=>r1(list.reduce((a,o)=>a+o[k][j],0)/list.length));
  return {d:label,b:'',name:sub,s:m('s'),w:m('w'),t:m('t'),e:m('e'),st:m('st'),fl:r1(list.reduce((a,o)=>a+o.fl,0)/list.length),notes:[],lo:false,pb:'',pa:''}; }
const sumOf=(L,k)=>[0,1].map(j=>L.reduce((a,o)=>a+o[k][j],0));
const rateN=(b,a)=>b?(a-b)/b*100:0;
/* 보는 기준별 구역 데이터 정의 */
const sum2=(L,f)=>[0,1].map(j=>L.reduce((a,o)=>a+f(o)[j],0));
const MET={
  total:{name:'전체 광고물',col:'var(--cw)',neg:'var(--cs)',pair:L=>sum2(L,tot),rate:true},
  s:{name:'간판',col:'var(--cs)',neg:'#6a6a6a',pair:L=>sum2(L,o=>o.s),rate:true},
  e:{name:'기타 광고물',col:'var(--cw)',neg:'#6a6a6a',pair:L=>sum2(L,o=>o.e),rate:true},
  per:{name:'가게당 광고물',col:'#e8e8e8',neg:'#6a6a6a',pair:L=>{const T=sum2(L,tot),S=sum2(L,o=>o.st);return [T[0]/S[0],T[1]/S[1]];},rate:false}
};
const f1=v=>(Math.round(v*10)/10).toFixed(1);
function openDist(d){
  const fid=cur&&MET[cur.id]?cur.id:'total', K=MET[fid];
  const L=items.filter(o=>o.d===d).sort((a,b)=>a.b<b.b?-1:1);
  distD=d; focusOn=false; grid.classList.remove('focus'); items.forEach(o=>o.el.classList.remove('sel'));
  grpLock={t:'d',v:d}; showGrp(grpLock);
  document.querySelectorAll('#rows div').forEach(r=>{r.classList.remove('on','dim'); r.classList.toggle('d-on',r.dataset.d===d);});
  const S=sumOf(L,'s'),W=sumOf(L,'w'),T=sumOf(L,'t'), P=K.pair(L), ALLP=K.pair(items);
  const num=v=>K.rate?nf(v):f1(v), u=K.rate?'개':'개';
  const rt=fmtRate(P[0],P[1]), up=P[1]>P[0], dn=P[1]<P[0];
  // ① 9구역 중 어디? — 순위 막대 (겹치지 않음)
  const DS=ORDER.map(g=>{const p=K.pair(items.filter(o=>o.d===g));return {g,v:K.rate?rateN(p[0],p[1]):p[1]};}).sort((a,b)=>b.v-a.v);
  const ref=K.rate?rateN(ALLP[0],ALLP[1]):ALLP[1], rk=DS.findIndex(x=>x.g===d)+1;
  const vmin=Math.min(...DS.map(x=>x.v),ref), vmax=Math.max(...DS.map(x=>x.v),ref);   // 값이 있는 범위만큼 넓게 펼침 (가게당은 0부터 시작하지 않음)
  const lo=K.rate?Math.min(0,vmin):vmin, hi=K.rate?Math.max(0,vmax):vmax, span=(hi-lo)||1, X=v=>((v-lo)/span*100);
  const lab=v=>K.rate?`${v>0?'+':v<0?'−':''}${Math.abs(Math.round(v))}%`:`${f1(v)}개`;
  const z=X(0);
  // 점이 겹치지 않게 위아래로 비켜 놓기 (폭 514px 기준)
  const PW=514, GAP=12, PX=v=>16+X(v)/100*(PW-32), lanes=[], pos=[...DS].sort((a,b)=>a.v-b.v).map(x=>{const px=PX(x.v);
    for(const ln of [0,-1,1,-2,2,-3,3]){ if(!lanes.some(q=>q.ln===ln&&Math.abs(q.px-px)<GAP)){ lanes.push({ln,px}); return {...x,px,ln}; } } return {...x,px,ln:0}; });
  const maxL=Math.max(1,...pos.map(p=>Math.abs(p.ln))), CY=46+maxL*12, H=CY+maxL*12+44;
  const GE={total:['#C25AA6','#C3D132'],s:['#7D6676','#C25AA6'],e:['#8A8C6C','#C3D132']}[fid]||['#C25AA6','#C3D132'];   // 전체: 자주→그린 · 간판: 채도 낮은 자주→자주 · 기타: 채도 낮은 그린→그린
  const GR=t=>`color-mix(in oklab,${GE[1]} ${Math.round(Math.max(0,Math.min(100,t)))}%,${GE[0]})`;
  const gcol=p=>K.rate?GR(X(p.v)):'';
  const dots=pos.map(p=>`<button class="bdot${p.g===d?' me':''}${K.rate?' gr':''}" data-g="${p.g}" style="left:${p.px.toFixed(1)}px;top:${CY+p.ln*12}px;${gcol(p)?`--dc:${gcol(p)}`:''}" aria-label="${p.g} ${lab(p.v)}"><em>${p.g} ${lab(p.v)}</em></button>`).join('');
  const meP=pos.find(p=>p.g===d), meX=Math.min(Math.max(meP.px,60),PW-60);
  const rankBox=`<div class="rkhd"><b>9구역 중 ${rk}위</b><span>${K.name} ${K.rate?'증감률':'(현재)'} · ${K.rate?'많이 늘어난':'많은'} 순</span></div>
    <div class="bee" style="height:${H}px;--cy:${CY}px">
      <span class="axis"></span>${K.rate?`<span class="tick" style="left:${PX(0).toFixed(1)}px"><em>0%</em></span>`:''}
      <span class="refl" style="left:${PX(ref).toFixed(1)}px"><em>9구역 전체 ${lab(ref)}</em></span>
      <span class="melab" style="left:${meX.toFixed(1)}px;top:${CY+meP.ln*12-24}px">${d} <b style="${gcol(meP)?`color:${gcol(meP)}`:''}">${lab(meP.v)}</b></span>
      ${dots}
      <span class="end l">${K.rate?'많이 줄어듦':'적음'}</span><span class="end r">${K.rate?'많이 늘어남':'많음'}</span>
    </div>`;
  // ② 개선 전 → 현재 (이 기준 하나만)
  const M=Math.max(P[0],P[1])||1;
  const parts=j=> fid==='total'?[[S[j],'s'],[W[j],'w'],[T[j],'t']] : fid==='e'?[[W[j],'w'],[T[j],'t']] : [[P[j],fid==='s'?'s':'k']];
  const ba=(lab2,j)=>`<div class="ba2 ${j?'now':'bf'}"><span class="lb">${lab2}</span><div class="bar">${parts(j).map(([v,c])=>v?`<i class="${c}" style="width:${(v/M*100).toFixed(2)}%"></i>`:'').join('')}</div><b>${num(P[j])}<small>${u}</small></b></div>`;
  const legend=fid==='total'?'<span class="lg"><em class="s">간판</em><em class="w">창문이용</em><em class="t">입간판·배너·현수막</em></span>':fid==='e'?'<span class="lg"><em class="w">창문이용</em><em class="t">입간판·배너·현수막</em></span>':'';
  const said=K.rate?`${K.name}이 ${num(P[0])}개에서 ${num(P[1])}개로 ${up?'늘었어요':dn?'줄었어요':'그대로예요'}`:`가게 한 곳당 광고물이 ${f1(P[0])}개에서 ${f1(P[1])}개로 ${up?'늘었어요':dn?'줄었어요':'그대로예요'}`;
  // ③ 건물 10동 — 개선 전(회색)과 현재(색) 두 줄 막대
  const BV=L.map(o=>{const p=K.pair([o]);return {o,b:p[0],a:p[1]};}), BM=Math.max(...BV.map(x=>Math.max(x.a,x.b)),1);
  const nUp=BV.filter(x=>x.a>x.b).length, nDn=BV.filter(x=>x.a<x.b).length;
  const bld=BV.map(x=>{const xb=(x.b/BM*100).toFixed(2), xa=(x.a/BM*100).toFixed(2), l=Math.min(+xb,+xa), w=Math.abs(xa-xb);
    return `<button class="db" data-i="${items.indexOf(x.o)}" title="${x.o.d} ${x.o.b} ${x.o.name} · ${num(x.b)} → ${num(x.a)}${u}"><span class="id">${x.o.b}</span><span class="tr"><i class="ln ${x.a>=x.b?'up':'dn'}" style="left:${l}%;width:${w}%;${K.rate?`background:${GR((Math.max(-100,Math.min(100,rateN(x.b,x.a)))+100)/2)}`:''}"></i><i class="ob" style="left:${xb}%"></i><i class="oa" style="left:${xa}%;${K.rate?`background:${GR((Math.max(-100,Math.min(100,rateN(x.b,x.a)))+100)/2)}`:''}"></i></span><span class="v ${x.a>x.b?'up':x.a<x.b?'dn':''}">${x.b?fmtRate(x.b,x.a):(x.a?'새로':'0')}</span></button>`;}).join('');
  const dist=document.getElementById('dist')||(()=>{const e=document.createElement('div');e.id='dist';$('#panel .pin').prepend(e);return e;})();
  dist.dataset.f=fid; dist.style.setProperty('--mc',K.rate?gcol(meP):K.col); dist.style.setProperty('--pc',fid==='total'?gcol(meP):K.col);   // 큰 숫자 = 보는 기준의 포인트 컬러   // 전체 광고물은 이 구역 위치의 그라데이션 색
  dist.innerHTML=`
  <header class="dh2"><h2>${d}</h2><p>${YEAR[d]}년 간판개선사업 · 건물 ${L.length}동 · <b>${K.name}</b> 기준</p></header>
  <section class="s1">${rankBox}</section>
  <section class="s2"><div class="hero2"><span class="rate ${up?'up':dn?'dn':''}">${rt}</span><span class="say">${said}</span></div>${ba('개선 전',0)}${ba('현재',1)}${legend?`<div class="lgw">${legend}</div>`:''}</section>
  <section class="s3"><div class="hd"><span>건물 ${L.length}동</span><span class="lg3"><em class="b">개선 전</em><em class="a">현재</em><span class="cnt">${nUp}동 늘고 · ${nDn}동 줄었어요</span></span></div><div class="dbs">${bld}</div></section>`;
  dist.querySelectorAll('.db').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); const i=+b.dataset.i; setFocus(false); select(i,true);}));
  dist.querySelectorAll('.bdot').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); if(b.dataset.g!==d){ openDist(b.dataset.g); if(window.SND&&SND.tap) SND.tap(); }}));
  $('#panel .pin').scrollTop=0;
  const pn=$('#panel'); pn.classList.add('open','dmode'); pn.setAttribute('aria-hidden','false'); $('#art').classList.add('pop');
  touched=true; try{ if(parent!==window) parent.postMessage({ov:'state',view:'map',d,b:null,focus:false,user:true},'*'); }catch(e){}
}

/* 등장 애니메이션이 끝나면 표시 클래스를 떼어 둠 — 팝업을 닫을 때 90칸이 다시 켜지는 것 방지 */
grid.addEventListener('animationend',e=>{ const c=e.target; if(c.classList&&c.classList.contains('cell')) c.classList.remove('seq','in'); });

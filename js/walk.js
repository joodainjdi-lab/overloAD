const DATA=window.OVERLOAD_DATA, GEO=window.WALK_GEO;
const $=s=>document.querySelector(s);
const NS='http://www.w3.org/2000/svg';
const EN={'광진구':'gwangjin','강남구':'gangnam','서대문구':'seodaemun','동작구':'dongjak','동대문구':'dongdaemun','관악구':'gwanak','강동구':'gangdong','노원구':'nowon','금천구':'geumcheon'};
const YEAR={'관악구':2012,'강남구':2014,'서대문구':2014,'금천구':2015,'광진구':2016,'동대문구':2017,'동작구':2020,'강동구':2023,'노원구':2024};
const ROUTE=['관악구','강남구','서대문구','금천구','광진구','동대문구','동작구','강동구','노원구'];   /* 사업 연도 순 */
const items=DATA.items;
items.forEach(o=>{o.e=[o.w[0]+o.t[0],o.w[1]+o.t[1]]; o.tot=[o.s[0]+o.e[0],o.s[1]+o.e[1]];});
const MAX={s:0,e:0}; items.forEach(o=>{for(const k of ['s','e'])MAX[k]=Math.max(MAX[k],o[k][0],o[k][1])});
const STREETS=ROUTE.map(g=>({g, slug:EN[g], yr:YEAR[g], bl:items.filter(o=>o.d===g).sort((a,b)=>a.b<b.b?-1:1)}));
STREETS.forEach(S=>{const sum=k=>[0,1].map(i=>S.bl.reduce((a,o)=>a+o[k][i],0)); S.tot=sum('tot'); S.s=sum('s'); S.e=sum('e');});

function fmtRate(b,a){ if(b===0) return a===0?'0%':'-'; const r=Math.round((a-b)/b*100); return (r>0?'+':r<0?'−':'')+Math.abs(r)+'%'; }
const fmtDelta=(b,a)=>{const d=a-b; return (d>0?'+':d<0?'−':'±')+Math.abs(d);};
const BA=(b,a)=>`<span class="pre">${b}</span><span class="ar">→</span><span class="now">${a}</span>`; // 개선 전(작게·흐리게) → 현재(진하게)
const cls=(b,a)=>a>b?'up':a<b?'dn':'eq';

/* ── one street = 10 elevations on a shared scale ── */
/* 입면도를 크게(거리마다 배율 KS), 화면보다 긴 거리는 좌우 스크롤로 걸어가듯 이동 */
const X0=60, W=1800, ELH=400, KMAX=1.55, GAP=10;   // 여백, 화면 폭, 입면도 영역 높이, 최대 배율, 사진 사이 간격
let cur=0, hov=-1, sel=-1, PH='before', busy=false;   // 시점 토글 기본 = 개선 전
let pan=0, panT=0, panMax=0, edge=0;   // 현재/목표 이동량, 최대 이동량, 끝에서 더 민 양

/* 입면도 실루엣(면): 선을 캔버스에 그린 뒤 바깥에서부터 채워(flood fill),
   바깥과 닿지 않는 안쪽 전체를 면으로 만듦 — 곡선·돌출 간판·계단형 지붕도 모양 그대로 */
function face(ev){ if(ev.face) return ev.face;
  const R=2, W=Math.ceil(ev.w*R)+4, H=Math.ceil(ev.h*R)+4;
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const c=cv.getContext('2d');
  c.translate(2,2); c.scale(R,R); c.lineWidth=1.6/R*1.6; c.strokeStyle='#000'; c.lineCap='square';
  (ev.g.match(/d="([^"]+)"/g)||[]).forEach(d=>c.stroke(new Path2D(d.slice(3,-1))));
  c.beginPath(); c.moveTo(0,ev.h); c.lineTo(ev.w,ev.h); c.stroke();   // 바닥선으로 닫기 (문·출입구 틈 막기)
  const px=c.getImageData(0,0,W,H).data, out=new Uint8Array(W*H), st=[];
  const wall=i=>px[i*4+3]>40;
  for(let x=0;x<W;x++){st.push(x,(H-1)*W+x);} for(let y=0;y<H;y++){st.push(y*W,y*W+W-1);}
  while(st.length){const i=st.pop(); if(out[i]||wall(i)) continue; out[i]=1; const x=i%W;
    if(x>0)st.push(i-1); if(x<W-1)st.push(i+1); if(i>=W)st.push(i-W); if(i<W*(H-1))st.push(i+W);}
  const img=c.createImageData(W,H);
  for(let i=0;i<W*H;i++){ if(!out[i]){ img.data[i*4]=195; img.data[i*4+1]=209; img.data[i*4+2]=50; img.data[i*4+3]=255; } }
  const o=document.createElement('canvas'); o.width=W; o.height=H; o.getContext('2d').putImageData(img,0,0);
  ev.mask={W,H,R,out};   // 실루엣 마스크 — 광고물이 건물 밖으로 나가지 않게 쓰임
  ev.face=o.toDataURL(); return ev.face; }

/* ── 입면도 위 광고물: 개선 전 ↔ 현재 (데이터: 건물별 ① 간판 · ② 창문이용광고물 · ③ 입간판·배너·현수막 개수, 개선 전·후) ──
   ① 간판(자홍): 개선 전 = 크기·높이가 제각각, 세로 돌출 간판도 섞여 흩어짐
                 현재   = 층마다 같은 높이의 간판 띠 한 줄에 같은 규격으로 정렬 (간판개선사업의 '규격 정리')
   ②③ 기타 광고물(그린): 위치는 그대로, 개수만 개선 전 → 현재로 늘거나 줄어듦 (창문 스티커·입간판·배너가 흩어져 늘어나는 모습)
   위치는 건물마다 고정된 난수로 정해져 새로고침해도 같음. 개수는 data.js(= 조사표 숫자)와 정확히 같음 */
function seeded(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return ()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return ((h^=h>>>16)>>>0)/4294967296;};}
function adsLayout(o){
  const R=seeded(o.d+o.b), ev=o.ev, w=ev.w, h=ev.h, fl=Math.max(1,o.fl||1), out=[], M=ev.mask;
  // 건물 실루엣 안인지 (마스크가 없으면 사각형 테두리 기준)
  const inPt=(x,y)=>{ if(!M) return x>=0&&x<=w&&y>=0&&y<=h; const px=Math.round(x*M.R+2), py=Math.round(y*M.R+2);
    return px>=0&&py>=0&&px<M.W&&py<M.H&&!M.out[py*M.W+px]; };
  const inRect=(x,y,rw,rh)=>{ for(let i=0;i<=4;i++)for(let j=0;j<=3;j++){ if(!inPt(x+rw*(.02+.96*i/4),y+rh*(.02+.96*j/3))) return false; } return true; };
  const placed=[];   // 이미 놓인 것 (겹치지 않게)
  const hit=(x,y,rw,rh,pad)=>placed.some(q=>x<q.x+q.w+pad&&x+rw+pad>q.x&&y<q.y+q.h+pad&&y+rh+pad>q.y);
  const tryPut=(gen,pad,n=60)=>{ let c; for(let k=0;k<n;k++){ c=gen(); if(inRect(c.x,c.y,c.w,c.h)&&!hit(c.x,c.y,c.w,c.h,pad)){ placed.push(c); return c; } }
    for(let k=0;k<n;k++){ c=gen(); if(inRect(c.x,c.y,c.w,c.h)){ placed.push(c); return c; } }   // 겹침은 허용, 건물 밖은 불가
    return null; };
  // 실제 지붕 높이(가로로 60% 이상 차는 첫 줄)부터 층 나누기
  let roof=0; if(M){ for(let y=0;y<h;y+=.5){ let n=0; for(let x=0;x<w;x+=w/40) if(inPt(x,y)) n++; if(n>=24){ roof=y; break; } } }
  const fh=(h-roof)/fl, top=k=>h-(k+1)*fh;
  // 그 높이에서 건물 안쪽 좌우 끝
  const span=(y0,y1)=>{ let L=0,Rr=w; for(const y of [y0,(y0+y1)/2,y1]){ let l=0; while(l<w&&!inPt(l,y)) l+=w/200; let r=w; while(r>0&&!inPt(r,y)) r-=w/200; L=Math.max(L,l); Rr=Math.min(Rr,r); } return [L,Rr]; };
  const T=(x,y,sx,sy,r=0)=>`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${Math.max(.01,sx).toFixed(2)},${Math.max(.01,sy).toFixed(2)})`;
  const pick=wts=>{let t=wts.reduce((a,b)=>a+b,0)*R();for(let i=0;i<wts.length;i++){if((t-=wts[i])<=0)return i;}return wts.length-1;};
  const fw=[...Array(fl)].map((_,k)=>k===0?3:k===1?2:1);
  /* ① 간판 — 현재: 층마다 같은 높이 간판 띠에 같은 규격으로 */
  const [s0,s1]=o.s, nS=Math.max(s0,s1);
  const rows=[...Array(fl)].map((_,k)=>{const hh=fh*.2,y=top(k)+fh*.07,[L,Rr]=span(y,y+hh);return {k,y,hh,L,Rr,ok:Rr-L>w*.25};});
  const cnt=Array(fl).fill(0), cap=[...Array(fl)].map((_,k)=>k===0?4:2);
  if(rows.some(r=>r.ok)) for(let i=0;i<s1;i++){let b=-1,bv=1e9;for(let k=0;k<fl;k++){if(!rows[k].ok)continue;const v=cnt[k]/cap[k];if(v<bv-1e-9){bv=v;b=k;}}cnt[b]++;}
  const after=[];
  cnt.forEach((m,k)=>{if(!m)return;const r=rows[k],pad=w*.03,aw=r.Rr-r.L-pad*2,g=w*.025,slot=Math.min(w*.42,(aw-(m-1)*g)/m),rw=m*slot+(m-1)*g,x0=r.L+pad+(aw-rw)/2,hh=Math.min(r.hh,slot*.5);
    for(let i=0;i<m;i++){const c={x:x0+i*(slot+g),y:r.y,w:slot,h:hh};after.push(c);}});
  after.forEach(c=>placed.push(c));   // 기타 광고물이 현재 간판과도 겹치지 않게
  /* 개선 전: 크기·높이 제각각 (기울기 없음 — 위치를 바꾸지 않으려고 난수는 그대로 소비) (서로 되도록 안 겹치게, 건물 밖으로는 안 나가게) */
  const beforeR=[];
  for(let i=0;i<s0;i++){
    const gen=()=>{const k=pick(fw),ty=R();
      if(ty<.22){const bw=w*(.045+R()*.035),bh=fh*(.7+R()*1.1);return {x:R()<.5?w*(.01+R()*.06):w*(.93-R()*.06)-bw,y:top(k)+fh*R()*.4,w:bw,h:bh,r:(R(),0)};}   // 세로·돌출
      if(ty<.35){const a=fh*(.2+R()*.15);return {x:R()*(w-a),y:top(k)+fh*(.1+R()*.5),w:a,h:a,r:(R(),0)};}                                                       // 작은 정사각
      const bw=w*(.16+R()*.34),bh=fh*(.16+R()*.24);return {x:R()*(w-bw),y:top(k)+fh*(.03+R()*.5),w:bw,h:bh,r:(R(),0)};};                                         // 가로형
    const sv=placed.length; placed.length=0;   // 개선 전 간판끼리만 겹침 검사
    beforeR.forEach(c=>placed.push(c));
    const c=tryPut(gen,w*.01)||{x:w*.3,y:top(0),w:w*.2,h:fh*.2,r:0}; beforeR.push(c);
    placed.length=0; after.forEach(q=>placed.push(q));
  }
  beforeR.forEach(c=>placed.push(c));   // 이제 개선 전·현재 간판 모두 피해서 기타 광고물을 놓음
  for(let i=0;i<nS;i++){const b=beforeR[i],a=after[i];
    const B=i<s0?{t:T(b.x,b.y,b.w,b.h,b.r),o:1}:{t:T(a.x+a.w/2,a.y+a.h/2,.01,.01),o:0};
    const A=i<s1?{t:T(a.x,a.y,a.w,a.h),o:1}:{t:T(b.x+b.w/2,b.y+b.h/2,.01,.01),o:0};
    out.push({c:'s',B,A});}
  /* ② 창문이용광고물: 위층 창 높이에 작은 사각 */
  const [w0,w1]=o.w, nW=Math.max(w0,w1), q=Math.min(fh*.13,w*.05);
  for(let i=0;i<nW;i++){const c=tryPut(()=>{const k=fl>1?1+Math.floor(R()*(fl-1)):0;return {x:w*.04+R()*(w*.92-q),y:top(k)+fh*(.3+R()*.4),w:q,h:q};},q*.35);
    if(!c){out.push({c:'w',B:{t:T(0,0,.01,.01),o:0},A:{t:T(0,0,.01,.01),o:0}});continue;}
    const t=T(c.x,c.y,q,q),z=T(c.x+q/2,c.y+q/2,.01,.01);
    out.push({c:'w',B:i<w0?{t,o:1}:{t:z,o:0},A:i<w1?{t,o:1}:{t:z,o:0}});}
  /* ③ 입간판(바닥에 선 판) · 배너·현수막(벽에 늘어진 띠) */
  const [t0,t1]=o.t, nT=Math.max(t0,t1);
  for(let i=0;i<nT;i++){
    const c=tryPut(()=>{ if(i%2===0){const bw=Math.min(fh*.13,w*.06),bh=fh*.24;return {x:w*.02+R()*(w*.94-bw),y:h-bh-.5,w:bw,h:bh};}
      const bw=Math.min(fh*.09,w*.04),bh=fh*.55,k=fl>1?1+Math.floor(R()*(fl-1)):0;return {x:R()<.5?w*(.02+R()*.12):w*(.84+R()*.12)-bw,y:top(k)+fh*.15,w:bw,h:bh};},w*.006);
    if(!c){out.push({c:'t',B:{t:T(0,0,.01,.01),o:0},A:{t:T(0,0,.01,.01),o:0}});continue;}
    const t=T(c.x,c.y,c.w,c.h),z=T(c.x+c.w/2,c.y+c.h/2,.01,.01);
    out.push({c:'t',B:i<t0?{t,o:1}:{t:z,o:0},A:i<t1?{t,o:1}:{t:z,o:0}});}
  return out;
}
function adsSVG(o){ o.ads=o.ads||adsLayout(o);
  return `<g class="ads">${o.ads.map((a,i)=>`<rect class="ad ${a.c}" data-i="${i}" width="1" height="1"/>`).join('')}</g>`; }
function paintAds(root,anim){
  if(!anim){root.classList.add('noanim');requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('noanim')));}
  root.querySelectorAll('.elev .b').forEach(g=>{const o=STREETS[cur].bl[+g.dataset.j]||null; if(!o||!o.ads) return;
    g.querySelectorAll('.ad').forEach(r=>{const a=o.ads[+r.dataset.i], st=PH==='before'?a.B:a.A;
      r.style.transitionDelay=anim?((+g.dataset.j)*45+(+r.dataset.i)*14)+'ms':'0ms';
      r.style.transform=st.t; r.style.opacity=st.o;});});
}
function buildStreet(S){
  const geo=GEO.segs[S.slug], mh=Math.max(...S.bl.map(o=>o.ev.h)), K=Math.min(KMAX,(ELH-6)/mh);
  const sw=geo.w*K, LW=Math.max(1920,sw+X0*2), ox=X0+Math.max(0,(W-sw)/2);
  const el=document.createElement('div'); el.className='slide';
  const strip=document.createElement('div'); strip.className='strip'; strip.style.width=LW+'px';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','elev'); svg.setAttribute('viewBox',`0 0 ${LW} ${ELH}`); svg.style.width=LW+'px';
  const links=document.createElementNS(NS,'svg'); links.setAttribute('class','links'); links.setAttribute('viewBox',`0 0 ${LW} 32`); links.style.width=LW+'px';
  const colW=Math.max(sw,W)/10, px=j=>ox-Math.max(0,(W-sw)/2)+(j+.5)*colW;   // 사진 칸 중심
  S.bl.forEach((o,j)=>{
    const sg=geo.seg[j], x=ox+sg[0]*geo.w*K, w=o.ev.w*K, h=o.ev.h*K;
    const g=document.createElementNS(NS,'g'); g.setAttribute('class','b'); g.dataset.j=j;
    g.setAttribute('transform',`translate(${x.toFixed(2)},${(ELH-h).toFixed(2)}) scale(${K.toFixed(4)})`);
    g.innerHTML=`<rect class="hit" x="0" y="0" width="${o.ev.w}" height="${o.ev.h}"/><image class="face" href="${face(o.ev)}" x="-1" y="-1" width="${o.ev.w+2}" height="${o.ev.h+2}" preserveAspectRatio="none"/><g fill="none" stroke="currentColor" stroke-width="0.5">${o.ev.g}</g>`+adsSVG(o);
    svg.appendChild(g);
    const ln=document.createElementNS(NS,'line'); ln.dataset.j=j;
    ln.setAttribute('x1',x+w/2); ln.setAttribute('y1',0); ln.setAttribute('x2',px(j)); ln.setAttribute('y2',32);
    links.appendChild(ln);
  });
  el.LW=LW; el.strip=strip; el.px=px;
  const ground=document.createElement('div'); ground.className='ground'; ground.style.width=(LW-X0*2)+'px';
  const ph=document.createElement('div'); ph.className='photos'; ph.style.width=LW+'px';
  ph.innerHTML=S.bl.map((o,j)=>`<button class="ph" data-j="${j}" style="left:${(px(j)-(colW-GAP)/2).toFixed(1)}px;width:${(colW-GAP).toFixed(1)}px" aria-label="${o.d} ${o.b} 자세히 보기"><div class="im"><img alt="" data-b="${o.pb}" data-a="${o.pa}" src="${PH==='after'?o.pa:o.pb}"><span class="flag"></span></div><div class="nm">${o.d} ${o.b}</div><div class="r1"><span class="c-s">간판 ${fmtDelta(...o.s)}</span><span class="c-e ${cls(...o.e)}">기타 광고물 ${fmtDelta(...o.e)}</span></div></button>`).join('');
  strip.append(svg,ground,links,ph); el.append(strip);
  el.paintAds=anim=>paintAds(el,anim);
  /* hover / click */
  const set=j=>{ if(j===hov) return; hov=j; paintHover(); };
  svg.addEventListener('pointerover',e=>{const b=e.target.closest('.b'); if(b) set(+b.dataset.j);});
  svg.addEventListener('pointerleave',()=>set(-1));
  svg.addEventListener('click',e=>{const b=e.target.closest('.b'); if(b) open(+b.dataset.j);});
  ph.querySelectorAll('.ph').forEach(p=>{const j=+p.dataset.j;
    p.addEventListener('pointerenter',()=>set(j)); p.addEventListener('focus',()=>set(j)); p.addEventListener('click',()=>open(j));});
  ph.addEventListener('pointerleave',()=>set(-1));
  return el;
}
function paintHover(){
  const a=hov>=0?hov:sel, w=$('#walk'), sl=w.querySelector('.slide:not(.gone)');
  w.classList.toggle('hov',a>=0);
  if(sl) sl.querySelectorAll('[data-j]').forEach(n=>n.classList.toggle('on',+n.dataset.j===a||+n.dataset.j===sel));   // 고른 건물은 팝업이 열려 있는 동안 계속 강조
  const S=STREETS[cur], r=$('#read');
  if(a<0){ r.classList.add('idle'); r.innerHTML='<div class="rh">건물 데이터</div><div class="rv">입면도나 사진에 마우스를 올리면 이 자리에 나와요 · 누르면 개선 전·현재 비교</div>'; return; }
  r.classList.remove('idle'); const o=S.bl[a];
  r.innerHTML=`<div class="rh"><b class="id">${o.d} ${o.b}</b><span class="fl">${o.fl}층 · 업소 ${o.st[1]}곳</span></div><div class="rv">`+
    `<span class="c-s"><i>간판</i>${BA(o.s[0],o.s[1])}<em>${fmtRate(...o.s)}</em></span>`+
    `<span class="c-e ${cls(...o.e)}"><i>기타 광고물</i>${BA(o.e[0],o.e[1])}<em>${fmtRate(...o.e)}</em></span>`+
    `<span class="c-t"><i>전체</i>${BA(o.tot[0],o.tot[1])}<em>${fmtRate(...o.tot)}</em></span></div>`;
}

const AV=(n)=>(n/10).toFixed(1).replace(/\.0$/,'');   // 10동 평균 (건물 1동당)
function head(S){
  $('#guN').textContent=S.g;
  $('#guM').innerHTML=`<b>${S.yr}년</b> 간판개선사업 · 조사 건물 10동`;
  // 구역 평균 (건물 1동당) — 표처럼 정렬: 항목 | 개선 전 → 현재 | 증감 | 막대
  const MX=Math.max(...[S.s,S.e,S.tot].flat())/10;
  const rowA=(cl,k,sub,v)=>{const b=v[0]/10,a=v[1]/10;
    return `<div class="arow ${cl}"><span class="nm">${k}${sub?`<small>${sub}</small>`:''}</span><span class="vv">${BA(AV(v[0]),AV(v[1]))}</span><b class="rt">${fmtRate(...v)}</b>`+
      `<span class="dd"><span class="d0">${'<i></i>'.repeat(Math.round(b))}</span><span class="d1">${'<i></i>'.repeat(Math.round(a))}</span></span></div>`;};   // 점 1개 = 광고물 1개 (1동당 평균, 반올림)
  $('#guS').innerHTML=`<div class="ah"><b>구역 평균</b><span>건물 1동당 광고물 · 개선 전 → 현재</span><em><i class="g0"></i>개선 전<i class="g1"></i>현재 · 점 1개 = 광고물 1개</em></div>`+
    rowA('s','간판','',S.s)+rowA('e','기타 광고물','창문이용·입간판·배너·현수막',S.e)+rowA('t','전체 광고물','',S.tot);
  // 한 줄 요약 — 간판과 기타 광고물이 어떻게 달라졌는지
  const rs=fmtRate(...S.s), re=fmtRate(...S.e), sDn=S.s[1]<S.s[0], eUp=S.e[1]>S.e[0];
  const up=S.bl.filter(o=>o.e[1]>o.e[0]).length;
  const rt=fmtRate(...S.tot), tUp=S.tot[1]>S.tot[0];
  // 한 줄 인사이트 — 전체와 간판·기타 광고물이 엇갈리는 지점을 짚음
  // 전체(흰색)와 기타 광고물(그린)만 짧게
  const T=`<span class="it">전체 광고물 <b>${rt}</b></span>`, E=`<span class="ie">기타 광고물 <b>${re}</b></span>`;
  $('#guI').innerHTML=
      tUp&&eUp   ? `${T} · ${E} 늘었어요`
    : !tUp&&eUp  ? `${T} 줄었지만, ${E} 늘었어요`
    : tUp&&!eUp  ? `${T} 늘었지만, ${E} 줄었어요`
    :              `${T} 줄었어요`;
  $('#guS').insertAdjacentHTML('beforeend',`<p class="l2">${sDn&&eUp?`간판은 ${rs} 줄었지만 기타 광고물이 ${re} 늘었어요`:`간판 ${rs} · 기타 광고물 ${re}`} · 10동 중 ${up}동에서 기타 광고물 증가</p>`);
}

/* ── walking between streets ── */
function go(i,dir){
  if(i<0||i>=STREETS.length) return; if(i===cur&&$('#walk').children.length) return;
  dir=dir||(i>cur?1:-1); const w=$('#walk'), olds=[...w.querySelectorAll('.slide:not(.gone)')];
  cur=i; hov=-1; sel=-1; closeDrawer(true);
  const nu=buildStreet(STREETS[i]); nu.classList.add(dir>0?'in-r':'in-l'); w.appendChild(nu);
  nu.paintAds(false);
  panMax=Math.max(0,nu.LW-1920); pan=panT=dir<0?panMax:0; edge=0; nu.strip.style.transform=`translateX(${-pan}px)`;
  olds.forEach(old=>{ old.classList.add('gone',dir>0?'out-l':'out-r'); old.style.pointerEvents='none'; setTimeout(()=>old.remove(),560); });
  requestAnimationFrame(()=>requestAnimationFrame(()=>nu.classList.remove('in-r','in-l')));
  head(STREETS[i]); paintHover(); steps(); drawMap(); post(); wkUI();
}

/* steps */
const stepsEl=$('#steps');
STREETS.forEach((S,i)=>{const b=document.createElement('button'); b.className='stop'; b.dataset.i=i;
  b.innerHTML=`<span class="yr">${S.yr}</span><i></i><span class="gu">${S.g}</span>`; b.addEventListener('click',()=>go(i)); stepsEl.appendChild(b);});
function steps(){ const W=1500; stepsEl.querySelectorAll('.stop').forEach(b=>{const i=+b.dataset.i; b.style.left=(130+i*(W-260)/8)+'px';
  b.classList.toggle('cur',i===cur); b.classList.toggle('past',i<cur); b.setAttribute('aria-current',i===cur?'step':'false');});
  $('#prog').style.width=(cur*(W-260)/8)+'px';
  $('#prv').disabled=cur===0; $('#nxt').disabled=cur===STREETS.length-1;
  $('#rtNow').innerHTML=`<b>${STREETS[cur].g}</b> ${STREETS[cur].yr} · ${cur+1} / ${STREETS.length}`; }
$('#prv').onclick=()=>go(cur-1,-1); $('#nxt').onclick=()=>go(cur+1,1);

/* seoul dot map */
const MAP=GEO.map, mc=$('#mapC'), mx=mc.getContext('2d'), MS=352/MAP.w, MY=(268-MAP.h*MS)/2;
function drawMap(){
  mx.clearRect(0,0,352,268); const now=STREETS[cur].g;
  MAP.gu.forEach(g=>{const i=ROUTE.indexOf(g.n);
    mx.fillStyle= g.n===now?'#C3D132': i>=0?'rgba(195,209,50,.32)':'rgba(250,250,250,.12)';
    const r=g.n===now?2.2:1.6;
    for(let k=0;k<g.d.length;k+=2){mx.beginPath(); mx.arc(g.d[k]*MS,g.d[k+1]*MS+MY,r,0,7); mx.fill();}});
}
mc.addEventListener('click',e=>{const r=mc.getBoundingClientRect(), x=(e.clientX-r.left)/r.width*352/MS, y=((e.clientY-r.top)/r.height*268-MY)/MS;
  let best=1e9,who=null; MAP.gu.forEach(g=>{for(let k=0;k<g.d.length;k+=2){const q=(g.d[k]-x)**2+(g.d[k+1]-y)**2; if(q<best){best=q;who=g.n;}}});
  const i=ROUTE.indexOf(who); if(i>=0) go(i);});

/* photo toggle */
const sw=$('#sw');
function setPH(v){ if(v===PH) return; PH=v; sw.dataset.ph=v; sw.classList.remove('nudge'); $('#swTip').classList.add('gone');
  sw.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.ph===v));
  $('#walk').classList.toggle('before',v==='before');
  document.querySelectorAll('.slide:not(.gone)').forEach(sl=>sl.paintAds&&sl.paintAds(true));   // 입면도 광고물도 개선 전 ↔ 현재로
  document.querySelectorAll('.slide:not(.gone) .ph .im').forEach((im,k)=>{const base=im.querySelector('img:not(.nx)'), src=v==='after'?base.dataset.a:base.dataset.b;
    im.querySelectorAll('.nx').forEach(n=>n.remove());
    const nx=new Image(); nx.className='nx'; nx.alt=''; nx.src=src; im.insertBefore(nx,im.querySelector('.flag'));
    setTimeout(()=>nx.classList.add('go'),40+k*55);
    setTimeout(()=>{base.src=src; nx.remove();},700+k*55);});
  document.querySelectorAll('.slide.gone .ph img:not(.nx)').forEach(im=>im.src=v==='after'?im.dataset.a:im.dataset.b); }
sw.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); setPH(b.dataset.ph);}));
sw.addEventListener('click',()=>setPH(PH==='after'?'before':'after'));

/* walk with wheel / keys */
let wheelLock=0;
$('#art').addEventListener('wheel',e=>{ if(e.target.closest('.drawer')) return; e.preventDefault();
  const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY; walkBy(d);},{passive:false});
/* 거리 안에서는 좌우로 이동, 끝에서 더 밀면 다음(이전) 거리로 */
/* 양끝 ‹ › · 진행 막대: 거리 안 위치를 보여주고, 끝이면 다음 구역 이름을 보여줌 */
function wkUI(){ const L=$('#edgeL'),R=$('#edgeR'); if(!L) return;
  const atL=panT<=.5, atR=panT>=panMax-.5;
  L.dataset.next=atL&&cur>0?STREETS[cur-1].g:''; R.dataset.next=atR&&cur<STREETS.length-1?STREETS[cur+1].g:'';
  L.disabled=atL&&cur===0; R.disabled=atR&&cur===STREETS.length-1; }
function stepWalk(dir){ const atEnd=dir>0?panT>=panMax-.5:panT<=.5;
  if(atEnd){ go(cur+dir,dir); return; } panT=Math.max(0,Math.min(panMax,panT+dir*700)); tick(); }
function walkBy(d){ walked=true;
  const t=performance.now(); if(t<wheelLock) return;
  const atEnd=d>0?panT>=panMax-.5:panT<=.5;
  if(!atEnd){ panT=Math.max(0,Math.min(panMax,panT+d*1.1)); edge=0; tick(); return; }
  edge+=Math.abs(d); if(edge<140) return;
  const ni=cur+(d>0?1:-1); edge=0; if(ni<0||ni>=STREETS.length) return; wheelLock=t+750; go(ni,d>0?1:-1);
}
let ticking=false;
function tick(){ if(ticking) return; ticking=true; requestAnimationFrame(function f(){
  pan+=(panT-pan)*.14; if(Math.abs(panT-pan)<.3) pan=panT;
  const sl=$('#walk .slide:not(.gone)'); if(sl) sl.strip.style.transform=`translateX(${(-pan).toFixed(1)}px)`; wkUI();
  if(pan!==panT) requestAnimationFrame(f); else ticking=false; }); }
addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('#photo')) return;
  const dOpen=$('#drawer').classList.contains('open');
  if(e.key==='Escape'&&dOpen){closeDrawer();return;}
  if(e.key===' '&&!dOpen){e.preventDefault(); setPH(PH==='after'?'before':'after'); return;}
  if(e.key==='ArrowRight'){e.preventDefault(); if(dOpen)open(sel+1); else if(panT<panMax-.5){panT=Math.min(panMax,panT+600);tick();} else go(cur+1,1);}
  if(e.key==='ArrowLeft'){e.preventDefault(); if(dOpen)open(sel-1); else if(panT>.5){panT=Math.max(0,panT-600);tick();} else go(cur-1,-1);}
});

/* ── drawer ── */
function open(j){ if(j<0||j>9) return; sel=j; setTimeout(post); const o=STREETS[cur].bl[j]; render(o);
  $('#bIdx').textContent=`${o.b} / 10`; $('#bPrv').disabled=j===0; $('#bNxt').disabled=j===9;
  const d=$('#drawer'); d.classList.add('open'); d.setAttribute('aria-hidden','false'); paintHover(); reveal(j); }
/* 고른 건물이 팝업에 가리지 않게 거리를 옮김 (팝업 왼쪽 1225px 안에 보이도록) */
function reveal(j){ const sl=$('#walk .slide:not(.gone)'); if(!sl||!sl.px) return; const x=sl.px(j);
  if(x-panT>80&&x-panT<1145) return;
  panT=Math.max(0,Math.min(Math.max(panMax,sl.LW-1225),x-612)); tick(); }
function closeDrawer(silent){ const d=$('#drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden','true'); sel=-1; if(panT>panMax){ panT=panMax; tick(); } if(!silent){ paintHover(); post(); } }
/* 보기 전환 연결 — 상위 페이지와 현재 거리·건물을 주고받음 */
function post(){ const S=STREETS[cur]; try{ if(parent!==window) parent.postMessage({ov:'state',view:'walk',d:S.g,b:sel>=0?S.bl[sel].b:null,focus:sel>=0,user:true},'*'); }catch(e){} }
function pulse(j){ hov=j; paintHover(); setTimeout(()=>{ if(hov===j){ hov=-1; paintHover(); } },1800); }
addEventListener('message',e=>{ const m=e.data; if(!m||m.ov!=='apply') return;
  const i=ROUTE.indexOf(m.d); if(i<0) return; if(i!==cur) go(i);
  const j=STREETS[cur].bl.findIndex(o=>o.b===m.b); if(j<0) return;
  if(m.focus) open(j); else { closeDrawer(true); pulse(j); }
});
$('#close').onclick=()=>closeDrawer(); $('#bPrv').onclick=()=>open(sel-1); $('#bNxt').onclick=()=>open(sel+1);

const photo=$('#photo'); let P=50;
function setP(v){P=Math.max(0,Math.min(100,v)); photo.style.setProperty('--p',P+'%'); photo.setAttribute('aria-valuenow',Math.round(P));
  $('#pct').textContent=`${Math.round(P)} : ${100-Math.round(P)}`;
  photo.querySelector('.tag.l').style.opacity=P<8?0:1; photo.querySelector('.tag.r').style.opacity=P>92?0:1;}
photo.addEventListener('wheel',e=>{e.preventDefault(); setP(P-(e.deltaY||e.deltaX)*0.12);},{passive:false});
let drag=false; const posP=e=>{const r=photo.getBoundingClientRect(); setP((e.clientX-r.left)/r.width*100);};
photo.addEventListener('pointerdown',e=>{drag=true;photo.setPointerCapture(e.pointerId);posP(e);});
photo.addEventListener('pointermove',e=>{if(drag)posP(e);}); photo.addEventListener('pointerup',()=>drag=false);
photo.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){setP(P-5);e.preventDefault();} if(e.key==='ArrowRight'){setP(P+5);e.preventDefault();}});
function sweep(){ const t0=performance.now(); const step=t=>{const k=Math.min(1,(t-t0)/700), e=1-Math.pow(1-k,3); setP(50*e); if(k<1)requestAnimationFrame(step);};   // 왼쪽에서 오른쪽으로
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) setP(50); else requestAnimationFrame(step); }

let openE=false, openD=false;
function setD(v){ openD=v; const d=$('#psum .det'), t=$('#psum .tgD'); if(!d) return; d.classList.toggle('open',v); t.setAttribute('aria-expanded',v); t.setAttribute('aria-label','세부 정보 '+(v?'접기':'펼치기')); }
function setE(v){ openE=v; const g=$('#bars .grp'), t=$('#tgE'); if(!g) return; g.classList.toggle('open',v); t.setAttribute('aria-expanded',v); }
{ const pn=$('#drawer .panel'); pn.insertBefore($('#pw'),$('#photo')); }   // 건물 이름을 사진 위로
function render(o){
  $('#imgB').src=o.pb; $('#imgA').src=o.pa; $('#imgB').alt=`${o.d} ${o.b} 개선 전 로드뷰`; $('#imgA').alt=`${o.d} ${o.b} 현재 로드뷰`; sweep();
  const [tb,ta]=o.tot, pb=o.st[0]?tb/o.st[0]:0, pa=o.st[1]?ta/o.st[1]:0;
  $('#pw').innerHTML=`<h2>${o.d} ${o.b}</h2>`;
  $('#psum').innerHTML=`<div class="k">전체 광고물 (개선 전 → 현재)</div><div class="row"><span class="rate">${fmtRate(tb,ta)}</span><span class="cnt">${BA(tb,ta)}<small>개</small></span></div>`+
    `<button class="tgD" aria-expanded="${openD}" aria-label="세부 정보 ${openD?'접기':'펼치기'}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg></button>`+
    `<div class="det${openD?' open':''}"><div class="wrap"><div class="inner"><div class="meta">${YEAR[o.d]}년 간판개선사업 · ${o.fl}층 · 개선 전 대비 ${fmtDelta(tb,ta)}개</div><div class="st"></div></div></div></div>`;
  $('#stats').innerHTML=`<div><span class="k">식별 업소</span><b>${BA(o.st[0],o.st[1])}</b></div><div><span class="k">업소당 광고물</span><b>${BA(pb.toFixed(1),pa.toFixed(1))}</b></div><div><span class="k">층당 광고물 (현재)</span><b>${(ta/o.fl).toFixed(1)}</b></div>`;
  const track=(b,a,M)=>{const lo=Math.min(a,b)/M*100, hi=Math.max(a,b)/M*100;
    return `<div class="track"><div class="tseg" style="left:${lo}%;width:${Math.max(hi-lo,0)}%"></div><div class="dot b" style="left:${b/M*100}%"></div><div class="dot a" style="left:${a/M*100}%"></div></div>`;};
  const val=(b,a)=>`<span class="val">${BA(b,a)}<b>${fmtRate(b,a)}</b></span>`;
  const sub=(label,k)=>{const [b,a]=o[k]; return `<div class="sub-row"><div class="top"><span class="name">${label}</span><b class="pc">${fmtRate(b,a)}</b></div><div class="ba">${BA(b,a)}</div>${track(b,a,MAX.e)}</div>`;};
  $('#bars').innerHTML=`<div class="hd"><span>유형별 광고물</span><span>○ 개선 전 ● 현재</span></div>`+
    `<div class="bar-row r-sign"><div class="top"><span class="name">간판</span>${val(...o.s)}</div>${track(...o.s,MAX.s)}</div>`+
    `<div class="bar-row r-win grp${openE?' open':''}"><div class="top"><button class="name tg" id="tgE" aria-expanded="${openE}">기타 광고물<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 6l4.5 4.5L12.5 6"/></svg></button>${val(...o.e)}</div>${track(...o.e,MAX.e)}
     <div class="fold"><div class="wrap"><div class="subs">${sub('창문이용 광고물','w')}${sub('입간판 배너 현수막','t')}</div></div></div></div>`;
  $('#tgE').addEventListener('click',e=>{openE=!openE; $('#bars .grp').classList.toggle('open',openE); e.currentTarget.setAttribute('aria-expanded',openE); if(openE) setD(false);});
  $('#psum .st').innerHTML=$('#stats').innerHTML;   // 세부 숫자는 접힌 영역 안으로
  $('#psum .tgD').addEventListener('click',()=>{ setD(!openD); if(openD) setE(false); });   // 하나를 열면 다른 하나는 닫힘
  $('#notes').innerHTML='막대 길이는 90동 중 유형별 최댓값 기준 · 세부 항목은 기타 광고물과 같은 축'+(o.notes.length?` · <em>${o.notes.join(' / ')}</em>`:'');
}

/* 구역 평균 자세히 */
$('#more').addEventListener('click',e=>{e.stopPropagation(); const on=!$('#guS').classList.contains('open'); $('#guS').classList.toggle('open',on); $('#more').setAttribute('aria-expanded',on);});
/* 여백을 누르면 팝업(건물 상세·구역 평균) 닫기 */
$('#art').addEventListener('click',e=>{
  if(!e.target.closest('.sum,.more')){ $('#guS').classList.remove('open'); $('#more').setAttribute('aria-expanded',false); }
  if($('#drawer').classList.contains('open') && !e.target.closest('.drawer,.elev .b,.ph,.route,.seg2,.more,.sum')) closeDrawer();
});
/* 마우스로 끌어서 걷기 — 끝에서 더 끌면 다음(이전) 구역 */
{ const wk=$('#walk'); let d0=null, moved=false;
  wk.addEventListener('pointerdown',e=>{ if(e.button!==0) return; d0={x:e.clientX,p:panT}; moved=false; });
  addEventListener('pointermove',e=>{ if(!d0) return; const s=parseFloat($('#art').style.transform.match(/scale\(([\d.]+)/)?.[1]||1);
    const dx=(e.clientX-d0.x)/s; if(Math.abs(dx)>6&&!moved){ moved=true; wk.classList.add('dragging'); walked=true; }
    if(moved){ panT=d0.p-dx; d0.over=panT<0?panT:panT>panMax?panT-panMax:0; panT=Math.max(0,Math.min(panMax,panT)); tick(); } });
  addEventListener('pointerup',()=>{ if(!d0) return; const ov=d0.over||0; d0=null; wk.classList.remove('dragging');
    if(moved&&Math.abs(ov)>160){ const dir=ov>0?1:-1; if(cur+dir>=0&&cur+dir<STREETS.length) go(cur+dir,dir); } });
  wk.addEventListener('click',e=>{ if(moved){ e.stopPropagation(); e.preventDefault(); moved=false; } },true);   // 끌기 끝에는 건물 클릭 무시
}
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080); $('#art').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit); fit();
// 지도 페이지에서 고른 구역으로 시작 (walk.html?d=관악구)
{ const q=new URLSearchParams(location.search).get('d'); const i=Math.max(0,ROUTE.indexOf(q)); cur=-1; go(i,1); }
/* 말 대신 몸짓으로 안내:
   ① 화면 양끝의 ‹ › 와 아래 진행 막대 → 거리가 옆으로 이어진다는 걸 보여줌 (wkUI)
   ② 아래 구역 이동 패널이 한 번 살짝 올라왔다 내려감 → 올리면 펼쳐진다는 걸 보여줌 */
var walked=false;
setTimeout(()=>{ const r=$('#route'); r.classList.add('peek'); setTimeout(()=>r.classList.remove('peek'),900); },3000);


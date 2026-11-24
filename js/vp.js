/* 화면 크기: 손가락으로 확대(핀치 줌)해도 바뀌지 않는 값으로 잼
   - 휴대폰에서 확대하면 innerWidth가 바뀌어 화면을 다시 맞추면서 처음으로 튕기던 문제를 막음 */
/* 새로고침(⌘⇧R 포함)하면 처음 시작 화면부터 — 주소에 남은 #p=…(보던 화면)는 지움 */
(()=>{try{ const nav=performance.getEntriesByType('navigation')[0];
  if(window.top===window && location.hash.startsWith('#p=') && nav && nav.type==='reload') history.replaceState(null,'',location.pathname+location.search); }catch(_){} })();
(()=>{const D=document.documentElement;
  window.VW=()=>D.clientWidth||innerWidth; window.VH=()=>D.clientHeight||innerHeight;
  const vv=window.visualViewport, zoomed=()=>!!vv&&vv.scale>1.01;
  window.vpZoomed=zoomed;
  // 확대해 있는 동안은 화면 다시 맞추기(resize)를 건너뜀 — 가장 먼저 등록돼서 다른 처리보다 먼저 실행
  addEventListener('resize',e=>{ if(zoomed()&&matchMedia('(pointer:coarse)').matches) e.stopImmediatePropagation(); },true);   // 휴대폰만
  // 확대해 있는 동안은 스크롤 자석(scroll-snap)도 끔
  if(vv) vv.addEventListener('resize',()=>D.classList.toggle('zoomed',zoomed()));
  const st=document.createElement('style'); st.textContent='html.zoomed,html.zoomed.snap-on{scroll-snap-type:none!important}';
  document.head.appendChild(st);

  /* 휴대폰 두 손가락 확대: 브라우저 확대 대신 화면 안에서 직접 확대 (브라우저 확대는 휴대폰에서 페이지가 다시 열리며 처음으로 돌아가곤 함) */
  const coarse=matchMedia('(pointer:coarse)').matches;
  function pinch(){ const stage=document.getElementById('stage'); if(!coarse||!D.hasAttribute('data-stage')) return;
    const css=document.createElement('style'); css.textContent='html,body{touch-action:pan-x pan-y}'+
      '#owZoomOut{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483500;display:none;align-items:center;gap:8px;height:40px;padding:0 18px;border:0;border-radius:99px;background:rgba(20,20,20,.88);color:#f2f2f2;font:600 14px Pretendard,system-ui,sans-serif;box-shadow:0 0 0 1px #3a3a3a}'+
      '#owZoomOut.on{display:flex}#owZoomOut i{font-style:normal;color:#C3D132}';
    document.head.appendChild(css);
    ['gesturestart','gesturechange'].forEach(t=>addEventListener(t,e=>e.preventDefault(),{passive:false}));   // 아이폰 기본 확대 막기
    if(!stage) return;   // 보기 전환 페이지: 확대는 안쪽 화면(거리로 보기·한눈에 비교)이 직접 함
    const out=document.createElement('button'); out.id='owZoomOut'; out.type='button'; out.innerHTML='<i>⤢</i>원래 크기로'; document.body.appendChild(out);
    let Z=1,X=0,Y=0, P=null, endT=0, first=null;
    const W=()=>VW(), H=()=>VH();
    function apply(){ X=Math.min(0,Math.max(W()-W()*Z,X)); Y=Math.min(0,Math.max(H()-H()*Z,Y));
      stage.style.transformOrigin='0 0'; stage.style.transform=Z>1.001?`translate(${X}px,${Y}px) scale(${Z})`:'';
      out.classList.toggle('on',Z>1.001); try{ if(parent!==window) parent.postMessage({ov:'zoom',on:Z>1.001},'*'); }catch(_){} }
    out.addEventListener('click',e=>{ e.stopPropagation(); stage.style.transition='transform .3s'; Z=1;X=0;Y=0; apply(); setTimeout(()=>stage.style.transition='',320); });
    const busy=()=>P||Date.now()-endT<350;
    addEventListener('pointerdown',e=>{ if(e.pointerType!=='touch') return; if(e.isPrimary) first={t:e.target,id:e.pointerId,x:e.clientX,y:e.clientY}; else e.stopImmediatePropagation(); },true);
    ['pointermove','pointerup','click'].forEach(t=>addEventListener(t,e=>{ if(busy()&&!e.owSynth){ e.stopImmediatePropagation(); if(t==='click') e.preventDefault(); } },true));
    const mid=t=>[(t[0].clientX+t[1].clientX)/2,(t[0].clientY+t[1].clientY)/2], dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
    addEventListener('touchstart',e=>{ if(e.touches.length!==2) return;
      if(first){ try{ const u=new PointerEvent('pointerup',{bubbles:true,pointerId:first.id,pointerType:'touch',isPrimary:true,clientX:first.x,clientY:first.y}); u.owSynth=true; first.t.dispatchEvent(u); }catch(_){} first=null; }   // 한 손가락으로 시작한 끌기는 여기서 끝냄
      const m=mid(e.touches); P={d:dist(e.touches),z:Z,cx:(m[0]-X)/Z,cy:(m[1]-Y)/Z}; e.preventDefault(); },{passive:false});
    addEventListener('touchmove',e=>{ if(!P||e.touches.length<2) return; e.preventDefault();
      const m=mid(e.touches); Z=Math.max(1,Math.min(4,P.z*dist(e.touches)/P.d)); X=m[0]-P.cx*Z; Y=m[1]-P.cy*Z; apply(); },{passive:false});
    addEventListener('touchend',e=>{ if(P&&e.touches.length<2){ P=null; endT=Date.now(); if(Z<1.06){ Z=1; apply(); } } });
    addEventListener('resize',()=>apply());
  }
  document.body?pinch():addEventListener('DOMContentLoaded',pinch);

})();

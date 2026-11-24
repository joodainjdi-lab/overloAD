/* 화면 크기: 손가락으로 확대(핀치 줌)해도 바뀌지 않는 값으로 잼
   - 휴대폰에서 확대하면 innerWidth가 바뀌어 화면을 다시 맞추면서 처음으로 튕기던 문제를 막음 */
(()=>{const D=document.documentElement;
  window.VW=()=>D.clientWidth||innerWidth; window.VH=()=>D.clientHeight||innerHeight;
  const vv=window.visualViewport, zoomed=()=>!!vv&&vv.scale>1.01;
  window.vpZoomed=zoomed;
  // 확대해 있는 동안은 화면 다시 맞추기(resize)를 건너뜀 — 가장 먼저 등록돼서 다른 처리보다 먼저 실행
  addEventListener('resize',e=>{ if(zoomed()) e.stopImmediatePropagation(); },true);
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

  /* 휴대폰을 세로로 들었을 때만: 가로로 돌려 달라는 안내 (컴퓨터에서는 절대 안 뜸) — 첫 화면부터 */
  if(!D.hasAttribute('data-rotate')) return;
  const mq=matchMedia('(pointer:coarse) and (orientation:portrait) and (max-width:900px)');
  let el=null, skip=false; try{ skip=sessionStorage.getItem('ow-rotate')==='1'; }catch(_){}
  try{ if(parent!==window && parent.document.documentElement.hasAttribute('data-rotate')) return; }catch(_){}   // 안쪽 화면은 바깥 화면이 대신 안내
  function make(){ el=document.createElement('div'); el.id='owRotate'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','가로로 돌려 주세요');
    el.innerHTML=`<style>
#owRotate{position:fixed;inset:0;z-index:2147483600;display:none;flex-direction:column;align-items:center;justify-content:center;gap:22px;background:#101010;color:#f2f2f2;font-family:Pretendard,system-ui,sans-serif;text-align:center;padding:32px}
#owRotate.on{display:flex}
#owRotate .ph{width:64px;height:104px;border:3px solid #C3D132;border-radius:14px;position:relative;animation:owRot 2.4s cubic-bezier(.6,0,.3,1) infinite}
#owRotate .ph::after{content:'';position:absolute;left:50%;bottom:8px;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:#C3D132}
@keyframes owRot{0%,20%{transform:rotate(0)}55%,85%{transform:rotate(-90deg)}100%{transform:rotate(0)}}
#owRotate b{font-size:21px;font-weight:700;line-height:1.4;margin-top:14px}
#owRotate p{margin:0;font-size:15px;line-height:1.6;color:#9a9a9a;word-break:keep-all}
#owRotate button{margin-top:18px;background:none;border:0;color:#7a7a7a;font:inherit;font-size:14px;text-decoration:underline;text-underline-offset:4px;padding:10px}
@media (prefers-reduced-motion:reduce){#owRotate .ph{animation:none;transform:rotate(-90deg)}}
</style><div class="ph" aria-hidden="true"></div><b>휴대폰을 가로로 돌려 주세요</b><p>이 화면은 가로로 보도록 만들었어요.<br>두 손가락으로 벌리면 크게 볼 수 있어요.</p><button type="button">세로로 그냥 볼게요</button>`;
    el.querySelector('button').addEventListener('click',()=>{ skip=true; try{sessionStorage.setItem('ow-rotate','1');}catch(_){} upd(); });
    document.body.appendChild(el); }
  function upd(){ if(!el) make(); el.classList.toggle('on',mq.matches&&!skip); }
  const go=()=>{ upd(); (mq.addEventListener?mq.addEventListener('change',upd):mq.addListener(upd)); };
  document.body?go():addEventListener('DOMContentLoaded',go);
})();

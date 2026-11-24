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

  /* 휴대폰을 세로로 들었을 때만: 가로로 돌려 달라는 안내 (컴퓨터에서는 절대 안 뜸) */
  if(!D.hasAttribute('data-stage')) return;
  const mq=matchMedia('(pointer:coarse) and (orientation:portrait) and (max-width:900px)');
  let el=null, skip=false; try{ skip=sessionStorage.getItem('ow-rotate')==='1'; }catch(_){}
  try{ if(parent!==window && parent.document.documentElement.hasAttribute('data-stage')) return; }catch(_){}   // 안쪽 화면은 바깥 화면이 대신 안내
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

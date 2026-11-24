/* 개선 전·현재 사진 크게 보기
   - 작은 비교 사진을 '누르면'(끌지 않고) 화면 가득 크게 열림, 끌면 지금처럼 비교만
   - 큰 화면에서도 좌우로 끌기·휠·← → 로 비교, 닫으면 작은 사진도 같은 위치로 */
(()=>{const ph=document.getElementById('photo'); if(!ph) return;
  const st=document.createElement('style'); st.textContent=`
#plb{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,.92);opacity:0;transition:opacity .25s;font-family:Pretendard,system-ui,sans-serif}
#plb.on{opacity:1} #plb[hidden]{display:none}
#plb .pp{position:relative;cursor:ew-resize;touch-action:none;user-select:none;transform:scale(.97);transition:transform .3s cubic-bezier(.2,.8,.2,1)}
#plb.on .pp{transform:none}
#plb .fr{position:absolute;inset:0;overflow:hidden;border-radius:8px;background:#1b1a1b}
#plb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
#plb .b{clip-path:inset(0 calc(100% - var(--p)) 0 0)}
#plb .kn{position:absolute;top:-14px;bottom:-14px;left:var(--p);width:4px;margin-left:-2px;background:#C3D132;border-radius:2px;box-shadow:0 0 16px rgba(195,209,50,.55)}
#plb .tg{position:absolute;top:16px;padding:6px 12px;background:rgba(0,0,0,.62);backdrop-filter:blur(4px);color:#f2f2f2;font-size:18px;font-weight:600;letter-spacing:.06em;transition:opacity .2s}
#plb .tg.l{left:16px} #plb .tg.r{right:16px}
#plb .cap{position:absolute;left:0;right:0;bottom:-40px;display:flex;justify-content:space-between;font-size:15px;color:#9a9a9a}
#plb .cap b{color:#f2f2f2;font-weight:600;font-variant-numeric:tabular-nums}
#plb .pp:focus{outline:none}
#plb .x{position:absolute;top:0;right:-64px;cursor:pointer;width:48px;height:48px;border:1px solid #3a3a3a;border-radius:50%;background:rgba(24,24,24,.9);color:#f2f2f2;display:grid;place-items:center;cursor:pointer}
#plb .x:hover{border-color:#C3D132;color:#C3D132}
#photo .zh{position:absolute;right:12px;bottom:12px;display:grid;place-items:center;width:30px;height:30px;border-radius:6px;background:rgba(0,0,0,.62);backdrop-filter:blur(4px);color:#f2f2f2;font-size:13px;pointer-events:none;opacity:.85;transition:opacity .2s}
#photo:hover .zh{opacity:1}`;
  document.head.appendChild(st);
  // 작은 사진 오른쪽 아래: '크게 보기' 표시
  const zh=document.createElement('span'); zh.className='zh'; zh.innerHTML='<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5L8 6M1.5 12.5L6 8"/></svg>'; zh.setAttribute('aria-hidden','true'); ph.appendChild(zh);

  const box=document.createElement('div'); box.id='plb'; box.hidden=true; box.setAttribute('role','dialog'); box.setAttribute('aria-label','개선 전·현재 사진 크게 보기');
  box.innerHTML=`<div class="pp" role="slider" tabindex="0" aria-label="개선 전·현재 비교" aria-valuemin="0" aria-valuemax="100"><div class="fr"><img class="a" alt=""><img class="b" alt=""></div>
    <div class="tg l">BEFORE</div><div class="tg r">NOW</div><div class="kn"></div>
    <div class="cap"><span>좌우로 끌어 개선 전 ↔ 현재 · 바깥을 누르거나 Esc로 닫기</span><span>개선 전 <b class="pc">50 : 50</b> 현재</span></div>
    <button class="x" type="button" aria-label="닫기 (Esc)"><svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3l8 8M11 3l-8 8"/></svg></button></div>`;
  document.body.appendChild(box);
  const pp=box.querySelector('.pp'), A=box.querySelector('.a'), B=box.querySelector('.b'), pc=box.querySelector('.pc');
  let P=50, sync=null;
  const tell=on=>{ try{ if(parent!==window) parent.postMessage({ov:'lb',on},'*'); }catch(_){} };   // 보기 전환 페이지 위쪽 버튼 줄을 잠시 숨김
  function setP(v){ P=Math.max(0,Math.min(100,v)); pp.style.setProperty('--p',P+'%'); pp.setAttribute('aria-valuenow',Math.round(P));
    pc.textContent=`${Math.round(P)} : ${100-Math.round(P)}`; box.querySelector('.tg.l').style.opacity=P<8?0:1; box.querySelector('.tg.r').style.opacity=P>92?0:1; sync&&sync(P); }
  function size(){ const sa=document.getElementById('imgA'); const r=(sa&&sa.naturalWidth)?sa.naturalWidth/sa.naturalHeight:502/343;
    let w=innerWidth*.86, h=w/r; const mh=innerHeight*.78; if(h>mh){h=mh;w=h*r} pp.style.width=w+'px'; pp.style.height=h+'px'; pp.style.marginTop='-24px'; }
  function open(p,onP){ const sa=document.getElementById('imgA'), sb=document.getElementById('imgB'); if(!sa||!sa.src) return;
    A.src=sa.src; B.src=sb.src; A.alt=sa.alt; B.alt=sb.alt; sync=null; setP(p); sync=onP; size();
    box.hidden=false; requestAnimationFrame(()=>box.classList.add('on')); tell(true); pp.focus({preventScroll:true}); try{window.SND&&SND.tap&&SND.tap()}catch(_){} }
  function close(){ tell(false); box.classList.remove('on'); setTimeout(()=>{box.hidden=true;},250); sync=null; try{ph.focus({preventScroll:true})}catch(_){} }
  window.PLB={open,close,get on(){return !box.hidden}};
  let drag=false; const pos=e=>{const r=pp.getBoundingClientRect(); setP((e.clientX-r.left)/r.width*100);};
  pp.addEventListener('pointerdown',e=>{ if(e.target.closest('.x')) return; drag=true; pp.setPointerCapture(e.pointerId); pos(e);});
  pp.addEventListener('pointermove',e=>{ if(drag) pos(e); }); pp.addEventListener('pointerup',()=>drag=false);
  pp.addEventListener('wheel',e=>{e.preventDefault(); setP(P-(e.deltaY||e.deltaX)*0.12);},{passive:false});
  ['click','pointerdown','mousedown'].forEach(t=>box.addEventListener(t,e=>e.stopPropagation()));   // 뒤 화면(서랍·팝업)이 닫히지 않게
  box.addEventListener('click',e=>{ if(!e.target.closest('.pp')||e.target.closest('.x')) close(); });   // 사진 바깥을 누르면 닫힘
  box.querySelector('.x').addEventListener('click',close);
  addEventListener('keydown',e=>{ if(box.hidden) return; e.stopImmediatePropagation();
    if(e.key==='Escape') close(); else if(e.key==='ArrowLeft'){setP(P-5);e.preventDefault();} else if(e.key==='ArrowRight'){setP(P+5);e.preventDefault();} },true);
  addEventListener('resize',()=>{ if(!box.hidden) size(); });
})();

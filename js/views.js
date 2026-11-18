/* 지도 페이지에서 고른 구역(?d=관악구)으로 거리로 보기 시작 */
{ const d=new URLSearchParams(location.search).get('d'); if(d) document.getElementById('fWalk').src='walk.html?d='+encodeURIComponent(d); }
const V={walk:document.getElementById('fWalk'),map:document.getElementById('fMap')}, box=document.getElementById('views');
function show(v,push){ if(!V[v]) v='walk';
  curV=v; if(v==='map') mapShown=true; box.dataset.v=v; box.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));
  for(const k in V){ V[k].classList.toggle('off',k!==v); V[k].setAttribute('aria-hidden',k!==v); V[k].tabIndex=k===v?0:-1; }
  try{ V[v].contentWindow.focus(); }catch(e){}
  if(push) history.replaceState(null,'','#'+v); }
/* 두 보기 연결: 각 보기가 보내는 현재 거리·건물을 기억했다가, 전환할 때 상대 보기에 넘김 */
const ST={};
addEventListener('message',e=>{ const m=e.data; if(!m||m.ov!=='state') return;
  for(const k in V) if(V[k].contentWindow===e.source) ST[k]=m; });
let curV='walk', mapShown=false;
function link(to){ const from=to==='walk'?'map':'walk', m=ST[from]; if(!m||!m.user) return;
  try{ V[to].contentWindow.postMessage({ov:'apply',d:m.d,b:m.b,focus:m.focus},'*'); }catch(e){} }
box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.v===curV) return;
  if(b.dataset.v==='map'&&!mapShown){ mapShown=true; const w=ST.walk; try{ V.map.contentWindow.postMessage({ov:'replay',sel:w&&w.user?{d:w.d,b:w.b,focus:w.focus}:null},'*'); }catch(e){} }   // 처음 한 번만: 90칸이 1위부터 켜진 뒤 고른 건물 강조
  else link(b.dataset.v);   // 그다음부터는 불 켜짐 없이 고른 건물을 그대로 이어서
  show(b.dataset.v,true); }));
addEventListener('hashchange',()=>show(location.hash.slice(1)));
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080); document.getElementById('ui').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit); fit(); show(location.hash.slice(1)||'walk');

/* 소리 버튼(화면 오른쪽 위 모서리 고정)과 '거리로 보기·한눈에 비교' 전환 버튼이 겹치면 전환 버튼만 왼쪽으로 비켜 줌 */
(()=>{const v=document.getElementById('views');if(!v)return;
  const ZONE=24+40+12;   // 소리 버튼 자리(24px 띄움 + 40px 크기) + 여유 12px
  function fit(){v.style.marginRight='';const r=v.getBoundingClientRect(),s=r.width/292||1;
    const over=r.right>innerWidth-ZONE&&r.top<ZONE;
    if(over)v.style.marginRight=((r.right-(innerWidth-ZONE))/s)+'px';}
  addEventListener('resize',fit);fit();setTimeout(fit,300);})();

/* < 이전으로: 한눈에 비교에서는 거리로 보기로, 거리로 보기에서는 구역 선택 지도로 */
(()=>{const bk=document.querySelector('#ui .back');if(!bk)return;
  const sync=()=>{const m=curV==='map';bk.setAttribute('aria-label',m?'이전으로 (거리로 보기)':'이전으로 (서울 9개 구역 지도)');};
  bk.addEventListener('click',e=>{if(curV!=='map')return;e.preventDefault();e.stopPropagation();
    link('walk');show('walk',true);sync();},true);
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0)));
  addEventListener('hashchange',sync);sync();})();

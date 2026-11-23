/* 지도 페이지에서 고른 구역(?d=관악구)으로 거리로 보기 시작 */
{ const d=new URLSearchParams(location.search).get('d'); if(d) document.getElementById('fWalk').src='walk.html?d='+encodeURIComponent(d); }
const V={walk:document.getElementById('fWalk'),map:document.getElementById('fMap')}, box=document.getElementById('views');
function show(v,push){ if(!V[v]) v='walk';
  curV=v; if(v==='map'&&!mapShown) firstMap(); box.dataset.v=v; box.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));
  for(const k in V){ V[k].classList.toggle('off',k!==v); V[k].setAttribute('aria-hidden',k!==v); V[k].tabIndex=k===v?0:-1; }
  try{ V[v].contentWindow.focus(); }catch(e){}
  if(push) history.replaceState(null,'','#'+v); }
/* 두 보기 연결: 각 보기가 보내는 현재 거리·건물을 기억했다가, 전환할 때 상대 보기에 넘김 */
const ST={};
addEventListener('message',e=>{ const m=e.data; if(!m||m.ov!=='state') return;
  for(const k in V) if(V[k].contentWindow===e.source) ST[k]=m; });
let curV='walk', mapShown=false;
function firstMap(){ mapShown=true; const w=ST.walk, send=()=>{ try{ V.map.contentWindow.postMessage({ov:'replay',sel:w&&w.user?{d:w.d,b:w.b,focus:w.focus}:null},'*'); }catch(e){} };
  if(mapReady) send(); else mapPend=send; }   // 한눈에 비교가 아직 준비 전이면 준비 신호를 받은 뒤 보냄
let mapReady=false, mapPend=null;
addEventListener('message',e=>{ if(e.data&&e.data.ov==='ready'&&e.source===V.map.contentWindow){ mapReady=true; if(mapPend){ const f=mapPend; mapPend=null; f(); } } });
function link(to){ const from=to==='walk'?'map':'walk', m=ST[from]; if(!m||!m.user) return;
  try{ V[to].contentWindow.postMessage({ov:'apply',d:m.d,b:m.b,focus:m.focus},'*'); }catch(e){} }
box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.v===curV) return;
  if(b.dataset.v==='map'&&!mapShown) firstMap();   // 처음 한 번만: 90칸이 켜진 뒤 보는 방법 → 고른 건물
  else link(b.dataset.v);   // 그다음부터는 불 켜짐 없이 고른 건물을 그대로 이어서
  show(b.dataset.v,true); }));
addEventListener('hashchange',()=>show(location.hash.slice(1)));
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080); document.getElementById('ui').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit); fit(); show(location.hash.slice(1)||'walk');

/* 소리 버튼: 맨 위 한 줄(뒤로·제목 … 보는 기준·보기 전환)과 같은 높이·크기로 오른쪽 끝에 — 버튼은 맨 바깥 페이지에 있어서 위치를 알려 줌 */
(()=>{ function place(){
    const s=Math.min(innerWidth/1920,innerHeight/1080), ox=innerWidth/2-960*s, oy=innerHeight/2-540*s, w=Math.round(Math.max(30,52*s));
    const cx=ox+1862*s, cy=oy+73*s, b=document.getElementById('snd');
    if(b){ b.style.setProperty('right','auto','important'); b.style.setProperty('left',(cx-w/2)+'px','important'); b.style.setProperty('top',(cy-w/2)+'px','important');
      b.style.setProperty('width',w+'px','important'); b.style.setProperty('height',w+'px','important'); }
    else try{ parent.postMessage(`snd:pos:${cx.toFixed(1)},${cy.toFixed(1)},${w}`,'*'); }catch(e){} }
  addEventListener('resize',place); addEventListener('load',()=>setTimeout(place,60)); place(); setTimeout(place,300); setTimeout(place,1200); })();

/* < 이전으로: 한눈에 비교에서는 거리로 보기로, 거리로 보기에서는 구역 선택 지도로 */
(()=>{const bk=document.querySelector('#ui .back');if(!bk)return;
  const sync=()=>{const m=curV==='map';bk.setAttribute('aria-label',m?'이전으로 (거리로 보기)':'이전으로 (서울 9개 구역 지도)');};
  bk.addEventListener('click',e=>{if(curV!=='map')return;e.preventDefault();e.stopPropagation();
    link('walk');show('walk',true);sync();},true);
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0)));
  addEventListener('hashchange',sync);sync();})();

/* ════════════ 시작 화면 — overloAD 로고 + 거리 사진 + 시작하기 ════════════ */
(()=>{
  const root=document.getElementById("start");if(!root)return;
  const body=document.body;
  if(!body.classList.contains("start-on")){root.remove();return;}   // 다른 페이지에서 돌아올 때(#outro 등)는 건너뜀
  let gone=false;
  function begin(){if(gone)return;gone=true;
    if(window.SND&&SND.tap)SND.tap();          // 이 클릭으로 배경 음악도 시작됨
    root.classList.add("out");
    setTimeout(()=>{body.classList.remove("start-on");dispatchEvent(new Event("ow:start"));},500);
    setTimeout(()=>root.remove(),1400);
  }
  root.querySelector(".go").addEventListener("click",begin);
  addEventListener("keydown",e=>{if(!gone&&e.key==="Enter"&&document.activeElement===body){e.preventDefault();begin();}});
  root.addEventListener("wheel",e=>e.preventDefault(),{passive:false});
  const ph=new Image();ph.onload=()=>root.classList.add("on");ph.onerror=()=>root.classList.add("on");ph.src="img/start.jpg";   // 사진이 준비되면 함께 떠오름
  setTimeout(()=>root.classList.add("on"),1500);
})();

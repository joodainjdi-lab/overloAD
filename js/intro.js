/* 인트로: 문장 3장 → 화살표/스크롤로 넘김 */
/* ════════════ 인트로: 화살표·스크롤 → 다음 문장, 마지막 화살표 → 빠르게 페이드 아웃 → 역사 웹 ════════════ */
(()=>{
  const box=document.getElementById("intro"),scr=[...box.querySelectorAll(".scr")],nx=box.querySelector(".nx"),dots=[...box.querySelectorAll(".dots i")];
  let i=-1,busy=false;
  const place=()=>{const e=scr[0].lastElementChild /* 화살표 위치는 첫 화면 기준으로 고정(변형 영향 없는 레이아웃 값) */,t=e.offsetTop+e.offsetHeight+Math.max(40,VH()*.06);
    nx.style.top=t+"px"};
  function show(n){
    if(i>=0)scr[i].classList.replace("on","out");
    const prev=i;i=n;
    setTimeout(()=>{if(prev>=0)scr[prev].classList.remove("out");scr[i].classList.add("on");dots.forEach((d,k)=>d.classList.toggle("on",k===i));
nx.setAttribute("aria-label",i===scr.length-1?"역사 보기":"다음");
      place();nx.classList.add("on");setTimeout(()=>busy=false,600)},prev>=0?480:200);
  }
  function next(){if(busy)return;busy=true;
    if(i<scr.length-1){nx.classList.remove("on");show(i+1)}
    else finish();
  }
  function prev(){if(busy||i<=0)return;busy=true;nx.classList.remove("on");show(i-1)}
  function finish(){if(box.classList.contains("done"))return;scrollTo(0,0);scr[i].classList.replace("on","out");nx.classList.remove("on");box.querySelector(".dots").style.opacity=0;
    playLead();setTimeout(()=>{box.classList.add("done");setTimeout(()=>box.classList.add("gone"),700)},250)}
  nx.addEventListener("click",next);
  addEventListener("keydown",e=>{if(box.classList.contains("done")||document.body.classList.contains("start-on"))return;if(["Enter","ArrowRight","ArrowDown"," "].includes(e.key)){e.preventDefault();next()}if(["ArrowLeft","Backspace"].includes(e.key)){e.preventDefault();prev()}});
  addEventListener("resize",()=>{if(i>=0)place()});
  // 스크롤(휠)·스와이프로도 넘기기 — 한 번 넘긴 뒤 잠시 잠금
  let lock=0;const go=()=>{const now=Date.now();if(now<lock||box.classList.contains("done"))return;lock=now+1100;next()};
  box.addEventListener("wheel",e=>{e.preventDefault();if(e.deltaY>18)go()},{passive:false});
  let ty0=null;box.addEventListener("touchstart",e=>{ty0=e.touches[0].clientY},{passive:true});
  box.addEventListener("touchend",e=>{if(ty0!==null&&ty0-e.changedTouches[0].clientY>40)go();ty0=null},{passive:true});
  scrollTo(0,0);busy=true;
  if(document.body.classList.contains("start-on"))addEventListener("ow:start",()=>show(0),{once:true});   // 시작 화면을 넘긴 뒤에 첫 문장
  else show(0);
})();

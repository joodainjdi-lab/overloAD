/* 간판개선사업 100년 — 역사 화면(반원 카드·연표·캡션·라이트박스·마무리) */
const MISH = "사진: Neil Mishalov (1968–69)";
const PHOTOS = [
 [1,1400,842,"1910s","전통 상점의 세로 현판"],
 [11,1400,1156,"1910s","‘술’ 법랑 간판"],
 [2,1400,677,"1920s","건물을 가로지른 간판"],
 [3,1400,848,"1920s","목조 상가의 처마 간판"],
 [4,1093,689,"1920s","부산 장수통 거리"],
 [5,1400,519,"1920s","담배 법랑 간판"],
 [6,1064,691,"1920s","경성 거리의 광고탑"],
 [7,1084,688,"1920s","깃발과 돌출 간판"],
 [8,1365,879,"1920s","대구 원정 거리"],
 [10,1400,949,"1920s","작업화 법랑 간판"],
 [12,1340,1076,"1930s","인단 법랑 간판"],
 [13,1400,984,"1930s","나무 ‘營業所’ 간판"],
 [14,1400,931,"1960s","건전지 법랑 간판"],
 [9,1400,1023,"1960s","밀크캐러멜 법랑 간판"],
 [15,1348,1076,"1960s","시멘트 법랑 간판"],
 [16,1400,472,"1960s","극장·연탄 간판"],
 [17,1400,807,"1960s","가설 상가의 판자 간판"],
 [18,1400,1086,"1960s","원형 돌출 간판"],
 [20,1400,1028,"1960s","보육원 표지판"],
 [24,1400,892,"1960s","상가와 옥상 간판"],
 [25,1400,866,"1960s","영문·한글 상점 간판",MISH],
 [27,1400,921,"1960s","‘고향사진관’ 간판",MISH],
 [28,1400,976,"1960s","벽면 전체를 쓴 문자",MISH],
 [32,252,1400,"1960s","세로 나무 현판"],
 [34,1400,877,"1960s","금은방 ‘선광당’",MISH],
 [36,1400,858,"1960s","‘동아상사’ 간판",MISH],
 [37,1400,963,"1960s","나란히 걸린 가로 간판",MISH],
 [39,1400,987,"1960s","손그림 영화 간판",MISH],
 [41,1400,947,"1960s","빌딩 옥상 간판",MISH],
 [42,1400,947,"1960s","옥상 광고탑",MISH],
 [43,1216,1400,"1960s","세로 돌출 간판",MISH],
 [44,1400,792,"1960s","‘강원상회’ 시장 간판",MISH],
 [47,1400,984,"1960s","세로 간판 번화가",MISH],
 [49,1400,938,"1960s","‘인동연탄’ 법랑 간판"],
 [50,1382,1400,"1960s","행정 회의 장면"],
 [51,1400,926,"1970s","손그림 극장 간판"],
 [52,1400,974,"1970s","‘미풍’ 법랑 간판"],
 [53,1400,1045,"1970s","‘소금’ 법랑 간판"],
 [54,1400,1122,"1970s","우표·수입인지 간판"],
 [55,981,1400,"1970s","승차권 판매소 간판"],
 [56,1400,498,"1980s","‘샤니케익’ 간판"],
 [57,622,1400,"1980s","‘아모레’ 세로 간판"],
 [58,1400,1336,"1980s","‘샘표간장’ 법랑 간판"],
 [59,921,1400,"1980s","약국 세로 간판 거리"],
 [60,966,1400,"1980s","‘로케트 전지’ 간판"],
 [61,808,1208,"1980s","크레인 간판 작업"],
 [63,1376,884,"1980s","떼어낸 간판"],
 [64,719,1400,"1990s","‘이발’ 세로 간판"],
 [65,354,1400,"1990s","나무 세로 간판"],
 [66,1400,936,"1990s","‘근대화 연쇄점’"],
 [67,1072,716,"1990s","‘동서가구’ 상점"],
 [68,1093,1400,"1990s","옥상 시계·광고탑"],
 [69,1035,1400,"1990s","밤의 세로 네온"],
 [70,1400,980,"1990s","빌딩 저층 간판"],
 [71,1400,928,"1990s","영화·노래방 간판"],
 [72,973,1400,"2000s","겹겹이 매달린 돌출 간판"],
 [73,1400,742,"2000s","메뉴 간판"],
 [74,1400,786,"2000s","횟집 돌출 간판 거리","","2007 강남구 간판개선사업 시작 사례",2007],
 [75,1400,754,"2000s","한옥 카페의 절제된 간판"],
 [76,788,1400,"2000s","‘노래방’ 일러스트 간판"],
 [77,1400,928,"2000s","벽면을 채운 상가 간판"],
 [78,1400,1050,"2000s","한옥 아래 원색 간판"],
 [79,1400,1050,"2000s","도로변 빌딩 간판"],
 [80,1256,1400,"2000s","빼곡한 빌딩 파사드"],
 [81,660,1400,"2010s","밤의 대형 입체 간판"],
 [82,1400,931,"2010s","저층 상가 간판"],
 [83,1400,1049,"2010s","‘Cyber Cafe’ 네온"],
 [84,1167,1400,"2020s","정비된 건물 간판"],
 [85,1400,1328,"2020s","정비된 유리 파사드"],
 [88,1400,505,"2020s","채널 간판"],
 [89,1088,852,"2020s","팝업스토어 간판"],
 [90,1400,980,"2020s","브랜드 파사드"],
 [91,1400,721,"2020s","밤의 LED 간판"],
 [93,1400,1051,"2020s","다층 상가 판류형 간판"],
 [94,1400,622,"2020s","대형 3D 전광판"],
 [95,1400,1050,"2020s","정비된 오피스·상가"],
].map(([n,w,h,d,t,c,nt,y])=>({n,w,h,ar:w/h,d,t,c:c||"",nt:nt||"",y0:y}));   // nt: 사진 아래 한 줄 메모, y: 이 사진의 연도(있으면 그 해에 맞춰 배치)


const EVENTS = [   // 근거를 확인한 항목만 (출처는 README 참고)
 {y:1876,s:"up",t:"개항"},
 {y:1910,s:"up",t:"네온사인 발명(파리)"},
 {y:1912,s:"up",t:"번화가에 크고 과시적인 간판"},
 {y:1920,s:"up",t:"일본을 거쳐 네온사인 등장"},
 {y:1930,s:"up",t:"입간판 보급"},
 {y:1950,s:"up",t:"일본식 간판 일소·한글 전용 운동"},
 {y:1962,s:"down",t:"광고물등단속법 제정"},
 {y:1963,s:"down",t:"전단도 광고물에 포함"},
 {y:1967,s:"up",t:"네온 규제 해제, 옥상간판 성행"},
 {y:1970,s:"up",t:"강철 간판이 플라스틱으로"},
 {y:1973,s:"down",t:"간판에 한글 표기 의무"},
 {y:1974,s:"up",t:"석유파동, 번화가 네온 소등"},
 {y:1980,s:"down",t:"광고물등관리법으로 개칭"},
 {y:1990,s:"down",t:"옥외광고물등관리법·허가/신고제"},
 {y:1991,s:"down",t:"한글 규정이 시행령으로"},
 {y:2000,s:"up",t:"LED로 건물 전체를 감싼 간판"},
 {y:2002,s:"down",t:"월드컵 계기 첫 체계적 간판 정비"},
 {y:2004,s:"down",t:"경기도 ‘간판이 아름다운 거리’"},
 {y:2007,s:"down",t:"정부 간판정비 시범사업"},
 {y:2012,s:"down",t:"행안부 간판개선사업 시작"},
 {y:2013,s:"up",t:"창문 선팅 광고, ‘간판 빌딩’"},
 {y:2016,s:"down",t:"옥외광고물법·자유표시구역"},
 {y:2023,s:"down",t:"제2기 자유표시구역"},
 {y:2026,s:"down",t:"전광판 밝기 권고"},
];



/* ════════════ 연표 (책 연표 14–15쪽 기준) — 위: 재질·기술·표현의 변화 / 아래: 법·제도·정책의 변화 ════════════ */
const EXP=[[1876,"개항"],[1908,"상표법·상호 독점권"],[1910,"네온사인 공개(파리)"],[1910,"대형 과시 간판"],[1928,"경성에 네온 등장"],
 [1938,"형광등 상용 판매(GE)"],[1953,"함석판 간판 확산"],[1962,"T/C천·입체문자"],[1973,"네온 전면 금지"],[1982,"네온 재등장·통금 해제"],
 [1987,"유연성 원단·버스광고"],[1991,"플렉스 도입(걸프전)"],[1994,"빌딩 전광판"],[1995,"풀컬러 LED 전광판"],[1998,"폴리카보네이트"],
 [2002,"조명동 LED 소자"],[2004,"LED 상용화"],[2006,"채널·사진 간판"],[2016,"디지털 광고물"],[2019,"을지로체 복고 서체"],[2020,"영어 간판 증가","2020s"]];
const LAW=[[1913,"도로취체규정"],[1938,"도로취체규정 전부개정"],[1962,"광고물등단속법 제정","광고물의 표시 장소를 막고, 형상·면적·색채를 제한할 수 있게 돼요."],
 [1963,"전단 규제 추가","전단도 광고물에 포함돼요."],[1973,"간판 한글 포함 시행규칙","시행규칙으로 간판 문자에 한글을 반드시 넣게 해요."],
 [1980,"광고물등관리법 개칭","법 이름이 ‘단속’에서 ‘관리’로 바뀌어요."],[1990,"옥외광고물등관리법 전부 개정","광고물을 달려면 허가를 받거나 신고해야 해요(1991년 시행)."],
 [1991,"한글 규제 시행령","‘간판엔 한글’ 규정이 시행령으로 올라가요."],[2002,"월드컵 간판 정비","월드컵을 계기로 건대 앞 노유거리에서 처음으로 체계적인 간판 정비가 이뤄져요."],
 [2007,"강남구 간판개선사업 추진"],[2012,"개선사업 본격 기금","행정안전부가 옥외광고 기금 수익금으로 간판개선사업을 시작해요."],
 [2016,"제1기 자유표시구역 지정·코엑스","법 이름에 ‘산업 진흥’이 들어가고, 자유표시구역이 생겨요."],
 [2023,"제2기 자유표시구역","명동·광화문·해운대가 자유표시구역으로 추가 지정돼요."],[2026,"전광판 밝기 권고","서울시가 전광판 야간 밝기를 법정 허용치의 3분의 1 수준으로 낮추라고 권고해요."]];

const DECADES=["1910s","1920s","1930s","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];
const RANGE={"1910s":[1870,1919],"1920s":[1920,1929],"1930s":[1930,1945],"1960s":[1946,1969],"1970s":[1970,1979],
 "1980s":[1980,1989],"1990s":[1990,1999],"2000s":[2000,2009],"2010s":[2010,2019],"2020s":[2020,2026]};

/* ════════════ 설정값 (조절용) ════════════ */
let LEAD=0; // 역사 시작 제목이 걷히는 스크롤 구간
const CFG={
  dir:-1,          // 원 회전 방향: -1 = 왼쪽 아래 → 오른쪽 위로 흐름, 1 = 반대
  step:170,        // 사진 한 장 넘어가는 스크롤 길이(px)
  gap:200,         // 카드 사이 간격(px, 1920 기준)
  mainGap:170,     // 메인 카드 양옆 여유
  cardH:160,       // 메인이 아닌 카드 높이(px)
  mainH:.5,        // 메인 카드 높이(화면 높이 배수)
  stand:{y:0,x:0,skew:0},       // 메인이 아닌 간판: 평면(기울기 없음)
  visible:4.6,     // 메인 양옆으로 보이는 카드 수
  dimNear:.74, dimFar:.92,       // 메인이 아닌 카드의 블랙 레이어 농도(가까움 → 멂)
  tilt:14,         // 호버한 카드가 마우스 쪽으로 기우는 정도(°)
  depth:72,        // 호버 시 메인 카드 두께(px, 1920 기준)
  depthSmall:44,   // 호버 시 나머지 카드 두께
  signDepth:110,   // 메인으로 온 간판 박스 두께(px)
  signFrame:9,     // 간판 테두리 프레임 두께(px)
  signPose:{y:-16,x:6},  // 메인 간판의 기본 각도(옆면이 보이도록)
  tiltMain:24,     // 메인 간판 호버 시 기울기(°)
  // 시대 서사: 초반은 제각각(혼란) → 중반은 빽빽(과부하) → 후반은 같은 규격으로 정렬(정리)
  chaosUntil:[.5,.76],   // 이 구간(전체 대비)에서 '제각각'이 사라짐
  denseAt:[.32,.52,.68,.78],// 빽빽해졌다가(앞 두 값) 다시 정렬 간격으로(뒤 두 값)
  orderFrom:[.7,.82],    // 이 구간부터 같은 비율(4:3)·같은 각도로 정렬
  denseGap:1           // 간격은 모두 같게(평면 정렬)
};

/* ════════════ helpers ════════════ */
const $=s=>document.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const rnd=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const N=PHOTOS.length;
const pad=n=>String(n).padStart(2,"0");
(()=>{const g={};PHOTOS.forEach(p=>(g[p.d]=g[p.d]||[]).push(p));
  for(const d in g){const [a,b]=RANGE[d],arr=g[d],L=arr.length;
    // 연도가 정해진 사진(y)은 그 해에, 나머지는 그 사이에 고르게
    const anc=[[-.5,a],...arr.map((p,k)=>p.y0?[k,p.y0]:null).filter(Boolean),[L-.5,b+1]];
    arr.forEach((p,k)=>{if(p.y0){p.year=p.y0;return}let m=0;while(anc[m+1][0]<k)m++;const[k0,y0]=anc[m],[k1,y1]=anc[m+1];p.year=y0+(k-k0)/(k1-k0)*(y1-y0)});}})();

/* ════════════ 카드 ════════════ */
const view=$("#view");
PHOTOS.forEach((p,i)=>{
  const t=i/(N-1);
  p.chaos=1-smooth(CFG.chaosUntil[0],CFG.chaosUntil[1],t);
  p.order=smooth(CFG.orderFrom[0],CFG.orderFrom[1],t);
  const dense=smooth(CFG.denseAt[0],CFG.denseAt[1],t)*(1-smooth(CFG.denseAt[2],CFG.denseAt[3],t));
  p.gapMul=lerp(1,CFG.denseGap,dense);
  // 혼란 구간의 카드별 흔들림(고정값)
  p.jr=(rnd(i+1)-.5); p.jy=(rnd(i+2)-.5); p.js=(rnd(i+3)-.5); p.jo=(rnd(i+4)-.5);
  const el=document.createElement("div");el.className="card";
  el.innerHTML=`<img class="th" src="img/history/thumb/${pad(p.n)}.jpg" alt="${p.t}" decoding="async"><img class="full" alt="" decoding="async"><i class="sd r"></i><i class="sd l"></i><i class="sd t"></i><i class="sd b"></i><i class="sd k"></i><span class="rim"></span><span class="gl"></span>`;
  el.style.setProperty("--img",`url("${new URL(`img/history/thumb/${pad(p.n)}.jpg`,location.href).href}")`); // CSS 변수 url은 css 폴더 기준으로 풀리므로 절대 경로로p.vol=0;p.slab=0;
  el.addEventListener("click",()=>{if(dragMoved)return;if(i===curI)openLB(i);else goTo(i)});
  el.addEventListener("pointerdown",e=>{if(i!==curI||e.button!==0)return;drag={x:e.clientX,y:e.clientY,lx:e.clientX,t:performance.now()};dragMoved=false;spinV=0;el.classList.add("drag");e.preventDefault()});
  view.appendChild(el);p.el=el;p.i=i;p.full=el.querySelector(".full");
});
// 누적 위치(호 길이) — 사진마다 간격이 다르므로 미리 계산
const S=[0];for(let i=1;i<N;i++)S[i]=S[i-1]+CFG.gap*(PHOTOS[i-1].gapMul+PHOTOS[i].gapMul)/2;
const sAt=pos=>{const i=Math.floor(pos),f=pos-i;return i>=N-1?S[N-1]:lerp(S[i],S[i+1],f)};

/* ════════════ 큰 원호 ════════════ */
let K=1,W=0,H=0,ARC={},COL={l:0,r:0,w:0,c:0};
function circle3(a,b,c){
  const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
  const A=a[0]**2+a[1]**2,B=b[0]**2+b[1]**2,C=c[0]**2+c[1]**2;
  const x=(A*(b[1]-c[1])+B*(c[1]-a[1])+C*(a[1]-b[1]))/d, y=(A*(c[0]-b[0])+B*(a[0]-c[0])+C*(b[0]-a[0]))/d;
  return {x,y,r:Math.hypot(a[0]-x,a[1]-y)};
}
function layout(){
  W=innerWidth;H=innerHeight;K=clamp(W/1920,.5,1.15);
  document.documentElement.style.setProperty("--k",K);
  const mob=W<760;
  // 3단 구성: 연표(왼쪽) | 간판(가운데 세로 띠) | 간판개선사업·법(오른쪽)
  COL={l:mob?0:460*K,r:mob?W:W-500*K};COL.w=COL.r-COL.l;COL.c=(COL.l+COL.r)/2;
  const bow=.5;   // 세로 띠: 휘지 않고 가운데 일직선
  const P1=[COL.c-bow,H*1.3], P2=[COL.c,H*.5], P3=[COL.c-bow,-H*.3];
  const c=circle3(P1,P2,P3);
  const a2=Math.atan2(P2[1]-c.y,P2[0]-c.x), a3=Math.atan2(P3[1]-c.y,P3[0]-c.x);
  let d=a3-a2;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
  ARC={cx:c.x,cy:c.y,r:c.r,a0:a2,dir:Math.sign(d)};
  LEAD=0;$("#scene").style.height=((N-1)*CFG.step*K+H+LEAD)+"px";
  Object.assign($("#cap").style,{left:"0px",top:"0px"});
  buildDecs();
}
const arcPoint=s=>{const a=ARC.a0+ARC.dir*s/ARC.r;return {x:ARC.cx+ARC.r*Math.cos(a),y:ARC.cy+ARC.r*Math.sin(a),nx:Math.cos(a),ny:Math.sin(a)}};
/* ════════════ 연표 (좌측) ════════════ */
const decs=$("#decs");let decEls=[];
function buildDecs(){
  if(!decEls.length){DECADES.forEach(d=>{const e=document.createElement("div");e.className="d";e.textContent=d;decs.appendChild(e);decEls.push(e)})}
  placeDecs(curD<0?0:curD,true);
}
let curD=-1;
function placeDecs(c){
  // 지나온 연도는 위에 그대로 쌓이고, 현재 연도가 크게 펼쳐지며, 프로그레스 바는 현재 연도 문구까지 채워진다
  if(innerWidth<760){ // 모바일: 현재 연도와 문구만 위쪽에
    decEls.forEach((e,j)=>{e.classList.toggle("cur",j===c);e.style.color="var(--lime)";e.style.transform=`translateY(${40*K}px)`;e.style.opacity=j===c?1:0});
    $("#key").style.top=(160*K)+"px";return;
  }
  // 현재 연대는 가운데 선 바로 위, 그 연대의 문구는 선 바로 아래 — 오른쪽 법·제도 설명과 같은 높이
  const gap=46,mid=H/K*.5,pos=[],CUR=150,KH=Math.max(24,($("#key").offsetHeight||0)/K);   // KH: 아래 목록 높이만큼 다음 연대를 띄움   // 강조 연도 글자 크기(css .d.cur 와 같게)
 let y=0,curY=0;
  decEls.forEach((e,j)=>{if(j===c){y+=6;pos[j]=curY=y;y+=CUR+34+KH+40}else{pos[j]=y;y+=gap}});
  const shift=(mid-(CUR+12))-curY;
  decEls.forEach((e,j)=>{
    e.style.transform=`translateY(${((pos[j]+shift)*K).toFixed(1)}px)`;
    e.classList.toggle("cur",j===c);e.style.color=j===c?"var(--lime)":"#bdbdbd";e.style.opacity=j<c?.1:j===c?1:.3;
  });
  $("#key").style.top=((curY+CUR+34+shift)*K)+"px";
}
let curEv="";
function setActive(p){
  const di=DECADES.indexOf(p.d);
  if(di!==curD){curD=di;placeDecs(di);window.SND&&SND.setEra(di,DECADES.length);renderLists(p.d)}
}
// 그 연대의 표현(왼쪽)·법·제도(오른쪽) 목록 — 지나온 해는 밝게, 가장 최근 항목은 가장 또렷하게
const inDec=(d,y)=>{const [a,b]=RANGE[d];return y>=a&&y<=b};
const li=(r,law)=>`<li data-y="${r[0]}"><b>${!law&&r[2]?r[2]:r[0]}</b><span>${r[1]}</span>${law&&r[2]?`<em class="ds">${r[2]}</em>`:""}</li>`;
let listYr=null;
function renderLists(d){
  const ex=EXP.filter(r=>inDec(d,r[0])),lw=LAW.filter(r=>inDec(d,r[0]));
  const none=`<li class="none"><span>이 시기엔 기록된 변화가 없어요</span></li>`;
  const kt=$("#keyTxt"),ru=$("#rule");
  [kt,ru].forEach(e=>e.classList.add("swap"));
  setTimeout(()=>{
    kt.innerHTML=`<p class="lh">재질 · 기술 · 표현의 변화</p><ul>${ex.length?ex.map(r=>li(r)).join(""):none}</ul>`;
    ru.innerHTML=`<p class="lh">법 · 제도 · 정책의 변화</p><ul>${lw.length?lw.map(r=>li(r,1)).join(""):none}</ul>`;
    listYr=null;[kt,ru].forEach(e=>e.classList.remove("swap"));placeDecs(curD);
  },200);
}
function markLists(yr){
  const Y=Math.floor(yr);if(Y===listYr)return;listYr=Y;
  ["#keyTxt","#rule"].forEach(sel=>{const L=[...document.querySelectorAll(sel+" li[data-y]")];let last=-1;
    L.forEach((e,k)=>{const on=+e.dataset.y<=Y;e.classList.toggle("past",on);if(on)last=k});
    L.forEach((e,k)=>e.classList.toggle("now",k===last));});
}

/* ════════════ 간판개선사업·법(오른쪽) + 화면을 가로지르는 변화선 ════════════
   c: 변화 양상 — up 강화 / down 완화 / turn 전환 / biz 사업. 문구는 여기서 고칩니다 */
let lastY=scrollY,vel=0;
const CHG={up:"강화",down:"완화",turn:"전환",biz:"사업",ctx:"규칙 이전"};
const RULES=[   // 근거를 확인한 문장만 (출처는 README 참고). c:"ctx"는 법이 아닌 거리의 모습 — 가운데 선 없이 설명만
 {y:1912,c:"ctx", t:"크고 과시적인 간판",     s:"1910년대 번화가에 상점이 빠르게 늘어나요.",e:"상점에 비해 크고 과시적인 간판이 걸려요."},
 {y:1921,c:"ctx", t:"네온사인의 등장",        s:"1920년대 일본을 거쳐 네온사인이 들어와요.",e:"규모가 작고 색도 단조로워 널리 퍼지지는 못했어요."},
 {y:1927,c:"ctx", t:"흰 목판에 단색 한자",    s:"1927년 종로의 간판은 대부분 흰 목판에 단색 한자로 이름을 썼어요.",e:"냉면집엔 국수 가닥, 치과엔 이와 잇몸을 그려 넣었어요."},
 {y:1932,c:"ctx", t:"입간판의 보급",          s:"1930년대부터 입간판이 널리 퍼져요.",e:""},
 {y:1950,c:"ctx", t:"일본식 간판 일소",       s:"광복 이후 일본식 간판을 걷어내는 운동이 일어나요.",e:"정부 정책으로 한글 전용 사용 운동도 펼쳐져요."},
 {y:1962,c:"up",  t:"광고물등단속법",          s:"광고물의 표시 장소를 막고, 형상·면적·색채를 제한할 수 있게 돼요.",e:"1963년 서울 시내 기록 사진엔 여전히 무질서한 입간판이 가득해요."},
 {y:1967,c:"down",t:"네온 규제 해제",          s:"네온사인 규제가 풀려요.",e:"네온탑과 옥상간판이 성행해요."},
 {y:1973,c:"up",  t:"간판에 한글 표기 의무",   s:"시행규칙으로 간판 문자에 한글을 반드시 넣게 해요.",e:"같은 해 11월 석유파동으로 서울 번화가 네온사인이 70% 이상 꺼졌어요."},
 {y:1980,c:"turn",t:"광고물등관리법",          s:"법 이름이 ‘단속’에서 ‘관리’로 바뀌어요.",e:"1983년, 서울 시내에서 간판을 정리하는 모습이 기록으로 남아 있어요."},
 {y:1990,c:"up",  t:"옥외광고물등관리법",      s:"광고물을 달려면 허가를 받거나 신고해야 해요(1991년 시행).",e:"1991년엔 ‘간판엔 한글’ 규정이 시행령으로 올라가요."},
 {y:2002,c:"biz", t:"월드컵 간판 정비",        s:"월드컵을 계기로 건대 앞 노유거리에서 처음으로 체계적인 간판 정비가 이뤄져요.",e:"간판은 가게당 2개, 붉은색 금지, 글씨는 간판 크기의 8분의 3 이내."},
 {y:2004,c:"biz", t:"‘간판이 아름다운 거리’",  s:"경기도가 시·군과 함께 간판 정비 사업을 시작해요.",e:"업소마다 정해진 장소·규격으로 간판을 한두 개씩만 달아요."},
 {y:2007,c:"biz", t:"간판정비 시범사업",       s:"정부가 간판정비 시범사업을 하고, 서울시는 ‘디자인시정’을 시작해요.",e:"압구정 현대아파트상가: 간판 133개를 떼고 업소마다 입체형 간판 1개만."},
 {y:2012,c:"biz", t:"간판개선사업 시작",       s:"행정안전부가 옥외광고 기금 수익금으로 간판개선사업을 시작해요.",e:"2022년까지 252개 지자체에 520억 원이 지원됐어요."},
 {y:2016,c:"down",t:"옥외광고물법",            s:"법 이름에 ‘산업 진흥’이 들어가고, 자유표시구역이 생겨요.",e:"같은 해 법제처: 신고·허가 대상이 아닌 창문 광고는 조례를 어겨도 처분할 수 없다고 해석해요."},
 {y:2023,c:"down",t:"제2기 자유표시구역",      s:"명동·광화문·해운대가 자유표시구역으로 추가 지정돼요.",e:"2024년 명동을 시작으로 대형 전광판이 켜져요."},
 {y:2026,c:"up",  t:"전광판 밝기 권고",        s:"서울시가 전광판 야간 밝기를 법정 허용치의 3분의 1 수준으로 낮추라고 권고해요.",e:"9월엔 국민권익위원회가 옥외광고물 빛공해 예방을 권고해요."},
];
// 그 해가 사진 순서(pos)에서 어디쯤인지
const yearPos=y=>{if(y<=PHOTOS[0].year)return 0;
  for(let i=0;i<N-1;i++){const a=PHOTOS[i].year,b=PHOTOS[i+1].year;if(y>=a&&y<b)return i+(y-a)/(b-a)}return N-1};
RULES.forEach(r=>r.p=yearPos(r.y));
// 오른쪽: 가까운 항목 하나만, 가운데 색 선과 함께 나타남
const ruleEl=$("#rule"),playEl=$("#play"),WIN=1.3;   // WIN: 그 해 앞뒤로 사진 몇 장 거리까지 보일지
ruleEl.addEventListener("click",()=>{if(ruleCur>=0)goPos(RULES[ruleCur].p)});
let ruleCur=-2;
// 오른쪽 끝 진행 막대: 100년 위에 규칙이 생긴 지점 표시 — 누르면 그 해로
const scrub=$("#scrub");
scrub.innerHTML=`<div class="tr"><i class="fill"></i>`+RULES.map((r,j)=>`<button class="mk ${r.c}" data-j="${j}" style="top:${(r.p/(N-1)*100).toFixed(2)}%" aria-label="${r.y} ${r.t}"><span>${r.y} ${r.t}</span></button>`).join("")+`</div>`;
const scrubTr=scrub.querySelector(".tr");
const scrubFill=scrub.querySelector(".fill"),scrubMarks=[...scrub.querySelectorAll(".mk")];
scrub.addEventListener("click",e=>{const b=e.target.closest(".mk");if(b)goPos(RULES[+b.dataset.j].p)});
let ruleFired=-1;
const LAWP=LAW.map(r=>Math.round(yearPos(r[0])));   // 법·제도 선은 그 해에 가장 가까운 간판이 정확히 가운데 줄에 올 때 펼쳐짐 (브레이크도 그 자리에서 정지)
const yearAt=pos=>{const i=Math.floor(pos),a=PHOTOS[i].year,b=PHOTOS[Math.min(i+1,N-1)].year;return a+(b-a)*(pos-i)};
// 아래 미니 연표: 1870–2030 가로축, 위 = 표현(자홍 눈금), 아래 = 법·제도(라임 눈금), 지금 위치 표시
const TL0=1870,TL1=2030,tx_=y=>((y-TL0)/(TL1-TL0)*100).toFixed(2)+"%";
const tlEl=document.createElement("nav");tlEl.id="tl";tlEl.setAttribute("aria-label","연표 — 누르면 그 해로");
tlEl.innerHTML=`<div class="ax"></div>`+[1900,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020].map(y=>`<span class="yl" style="left:${tx_(y)}">${y}</span>`).join("")+
  EXP.map(r=>`<button class="tk up" style="left:${tx_(r[0])}" data-y="${r[0]}" aria-label="${r[2]||r[0]} ${r[1]}"><span>${r[2]||r[0]} ${r[1]}</span></button>`).join("")+
  LAW.map(r=>`<button class="tk dn" style="left:${tx_(r[0])}" data-y="${r[0]}" aria-label="${r[0]} ${r[1]}"><span>${r[0]} ${r[1]}</span></button>`).join("")+`<i class="me"></i>`;
document.body.appendChild(tlEl);
const tlMe=tlEl.querySelector(".me"),tlTk=[...tlEl.querySelectorAll(".tk")];
tlEl.addEventListener("click",e=>{const b=e.target.closest(".tk");if(b)goPos(yearPos(+b.dataset.y))});
function drawRule(pos,s0){
  let cur=-1,best=1e9;LAWP.forEach((p,j)=>{const d=Math.abs(p-pos);if(d<best){best=d;cur=j}});
  const v=best<WIN?smooth(WIN,WIN*.35,best):0;
  playEl.style.transform=`scaleX(${v.toFixed(3)})`;playEl.style.opacity=Math.min(1,v*1.4).toFixed(3);playEl.className="";
  // 법·제도가 바뀌는 해: 가운데 선이 다 펼쳐지는 순간 소리 + 메인 간판 깜빡
  if(v>.85&&ruleFired!==cur){ruleFired=cur;window.SND&&SND.rule("up",LAW[cur][0]);
    const m=curI>=0&&PHOTOS[curI].el;if(m){m.classList.remove("flick","flickw");void m.offsetWidth;m.classList.add("flick")}}
  if(v<.2&&ruleFired===cur)ruleFired=-1;
  const yr=yearAt(pos);markLists(yr);
  tlMe.style.left=tx_(Math.min(TL1,Math.max(TL0,yr)));
  tlTk.forEach(t=>t.classList.toggle("past",+t.dataset.y<=yr));
}

/* ════════════ 시대 개요 + 대표 색채 (진 페이지 01–07, 08은 사진 추출 참고색) ════════════ */
const ERAS={
 "01":{name:"01 전통시대",sub:"물건과 깃발, 현판이 곧 간판이던 시대",
  text:"현판과 깃발, 등롱이 곧 간판이었어요. 장터에선 물건 자체가 홍보물이어서 따로 간판이 필요 없었어요.",
  pal:[["목재","#8B6B4A"],["먹","#2A2622"],["한지·천","#EFE9DD"],["도금","#B8963E"],["옻칠","#7A2E22"]],
  type:["現板 酒","서예·각자(刻字) 한자"]},
 "02":{name:"02 개항기·일제강점기",sub:"대문짝만 한 간판과 네온의 등장",
  text:"1908년 상표법으로 상호가 ‘재산’이 되었어요. 한옥에 대문짝만 한 간판이 걸리고, 1920년대 말 경성에 네온사인이 등장했어요.",
  pal:[["흰 목판","#F2EEE6"],["단색 글씨","#1E1E1E"],["법랑","#2F4F8A"],["네온 적주황","#E2492F"],["아르곤 청","#7F95C9"]],
  type:["京城 商店","붓글씨 한자·한글·가나 병기"]},
 "03":{name:"03 광복~1960년대",sub:"함석과 페인트, 그리고 최초의 간판법",
  text:"함석·목판에 페인트로 상호를 크게 쓴 간판이 대부분이었어요. 1962년 최초의 간판법 ‘광고물등단속법’이 제정되었어요.",
  pal:[["흰 바탕","#F5F3EE"],["검은 글씨","#1A1A1A"],["함석","#9A9C9E"],["페인트 적색","#B23A2E"],["페인트 청색","#2E5E8C"]],
  type:["대한 상회","손 페인트 글씨·한글·한자 혼용"]},
 "04":{name:"04 1970년대",sub:"빛나는 면(面): 아크릴과 형광등",
  text:"형광등을 넣은 아크릴 간판이 절반을 넘었어요. 1973년 석유파동으로 네온사인이 전면 금지되었어요.",
  pal:[["형광 백색","#FAFAF2"],["원색 적","#D7261E"],["원색 청","#1F4FA0"],["원색 황","#F2C200"],["시트 문자","#222222"]],
  type:["천지 부동산","시트지 커팅 고딕·둥근고딕"]},
 "05":{name:"05 1980년대",sub:"통금 해제와 올림픽, 밤의 간판 시장",
  text:"1980년 법 이름이 ‘광고물등관리법’으로 바뀌었어요. 1983년 서울 시내에서 간판 정리가 기록되었어요.",
  pal:[["적","#E0201B"],["녹","#1E8C45"],["청","#1E50B4"],["네온 분홍","#FF4FA8"],["선팅 바탕","#F7F3E8"]],
  type:["을지 면옥","납작붓 페인트 붓글씨·필름 레터링"]},
 "06":{name:"06 1990년대",sub:"플렉스와 실사 출력, 허가·신고제의 시작",
  text:"허가·신고제가 도입되고, 네온 대신 플렉스 간판이 급증했어요. 대기업 CI와 함께 실사 출력이 퍼졌어요.",
  pal:[["플렉스 적","#E60012"],["플렉스 청","#0067B1"],["플렉스 황","#FFD100"],["플렉스 녹","#00A04A"],["유백 원단","#FFFFFF"]],
  type:["SUPER 마트","디지털 폰트·실사 출력"]},
 "07":{name:"07 2000년대",sub:"LED 총천연색과 간판 정비의 시작",
  text:"LED가 건물 전체를 빛으로 감쌌어요. 2002년 월드컵을 계기로 체계적인 간판 정비가 시작되었어요.",
  pal:[["LED 적","#FF1F4B"],["LED 청","#18C3FF"],["LED 녹","#3BE36B"],["형광색","#F4FF2E"],["미색 바탕","#EDE6D8"]],
  type:["LED 치킨","채널 입체문자·사진·원색 문구"]},
 // 08: 진에 아직 페이지가 없어 이 시대 사진들에서 추출한 참고 색 (임시)
 "08a":{name:"08 2010년대",sub:"개선사업 본격화와 디지털광고물",
  text:"2012년 간판개선사업이 본격화되었어요. 2016년 옥외광고물법으로 자유표시구역과 디지털광고물이 도입되었어요.",
  pal:[["사진 추출 적","#C04737"],["사진 추출 녹","#B1D9B5"],["사진 추출 갈","#855152"],["사진 추출 황록","#8F8B69"],["사진 추출 바탕","#D6CCD4"]],
  type:null,extracted:true},
 "08b":{name:"08 2020년대~현재",sub:"정비된 파사드와 대형 전광판",
  text:"제2기 자유표시구역으로 대형 전광판이 늘었어요. 개선사업을 거친 거리는 같은 규격의 간판으로 정리되었어요.",
  pal:[["사진 추출 적","#AB424A"],["사진 추출 회청","#738187"],["사진 추출 남","#474459"],["사진 추출 황록","#ACB47D"],["사진 추출 바탕","#D8DCDE"]],
  type:null,extracted:true}
};
const DEC_ERA={"1910s":"01","1920s":"02","1930s":"02","1960s":"03","1970s":"04","1980s":"05","1990s":"06","2000s":"07","2010s":"08a","2020s":"08b"};
let capEra="";
function setEra(key){
  if(key===capEra)return;const first=!capEra;capEra=key;const e=ERAS[key],box=$("#cap .era");
  const fill=()=>{box.querySelector(".ex").textContent=e.text;
    box.querySelector(".pal").innerHTML=e.pal.map(([n,h])=>`<i style="background:${h}" title="${n} ${h}"></i>`).join("");
    box.classList.remove("swap")};
  if(first)fill();else{box.classList.add("swap");setTimeout(fill,300)}
}
/* ════════════ 캡션 ════════════ */
let capI=-1;
function setCap(i){
  if(i===capI)return;capI=i;const p=PHOTOS[i],c=$("#cap");setEra(DEC_ERA[p.d]);
  c.classList.add("swap");
  setTimeout(()=>{c.querySelector(".t1").textContent=`${p.t}`;c.querySelector(".nt").textContent=p.nt;c.classList.toggle("has-nt",!!p.nt);
    c.classList.remove("swap")},180);
}

/* ════════════ 프레임 ════════════ */
let drag=null,dragMoved=false,spin=0,spinV=0;
let mx=-9999,my=-9999,ticking=false,lbOpen=false,curI=-1,tx=0,ty=0,mainBox=null;const capEl=$("#cap");
function frame(){
  ticking=false;
  const sc=$("#scene"),top=sc.offsetTop;
  const pos=clamp((scrollY-top-LEAD)/(CFG.step*K),0,N-1);
  const i0=Math.round(pos),s0=sAt(pos);
  let moving=false;
  const viewTop=view.getBoundingClientRect().top;
  // 스크롤 속도에 따라 간판 띠가 살짝 기울었다가 멈추면 제자리로
  const dy=scrollY-lastY;lastY=scrollY;vel+=(dy-vel)*.18;if(Math.abs(vel)>.05)moving=true;else vel=0;window.SND&&SND.speed(vel);
  view.style.transform=W<760?"":`skewY(${clamp(vel*.035,-3.5,3.5).toFixed(2)}deg) scaleY(${(1+clamp(Math.abs(vel)*.0012,0,.06)).toFixed(3)})`;
  const hb=CFG.cardH*K*(W<760?.62:1), hm=H*CFG.mainH*(W<760?.62:1);
  // 마우스 아래 카드 (지난 프레임 위치 기준, 앞쪽 카드 우선)
  let hovI=-1,hz=-1;
  if(!lbOpen)for(const p of PHOTOS){if(!p.on||!p.box)continue;const b=p.box;
    if(mx>b.x&&mx<b.x+b.w&&my>b.y&&my<b.y+b.h&&p.z>hz){hz=p.z;hovI=p.i}}
  const over=hovI>=0&&hovI===i0;
  const hb0=hovI>=0?PHOTOS[hovI].box:null;
  const txT=hb0?(mx-(hb0.x+hb0.w/2))/(hb0.w/2):0, tyT=hb0?(my-(hb0.y+hb0.h/2))/(hb0.h/2):0;
  tx+=(txT-tx)*.15;ty+=(tyT-ty)*.15;if(Math.abs(txT-tx)+Math.abs(tyT-ty)>.003)moving=true;
  // 드래그 회전: 놓으면 관성으로 돌다가 정면(360° 단위)으로 스냅
  if(!drag){
    if(Math.abs(spinV)>3){spin+=spinV;spinV*=.95;window.SND&&SND.spin&&SND.spin(spinV)}   // 관성으로 도는 동안 바람 소리
    else{const tg=Math.round(spin/360)*360;spinV+=(tg-spin)*.05;spinV*=.8;spin+=spinV;if(Math.abs(tg-spin)<.05&&Math.abs(spinV)<.05){spin=tg%360;spinV=0}}
    if(spin!==0||spinV!==0)moving=true;
  }
  for(const p of PHOTOS){
    const k=p.i-pos,ak=Math.abs(k);
    if(ak>CFG.visible+.5){if(p.on){p.el.style.display="none";p.on=false}continue}
    if(!p.on){p.el.style.display="";p.on=true}
    const sArc=CFG.dir*((S[p.i]-s0)+clamp(k,-1,1)*CFG.mainGap)*K;
    const pt=arcPoint(sArc);
    const m=1-smooth(0,1,ak);                    // 메인 정도 (1 = 메인)
    const r=smooth(.3,1.15,ak);                  // 세움 정도 (0 = 정면)
    // 크기: 혼란 구간은 제각각, 정렬 구간은 같은 비율(4:3)
    const ar=lerp(p.ar,4/3,p.order*r);
    let h=lerp(hb,hm,m),w=h*ar;
    const wMax=COL.w*(W<760?.86:.8);if(w>wMax){w=wMax;h=w/ar}
    // 혼란 구간: 각도·위치가 흔들림
    const jit=0;   // 흔들림 없음 — 가운데 정렬
    const ox=pt.nx*p.jo*70*K*jit, oy=pt.ny*p.jo*70*K*jit;
    const ry=CFG.stand.y*r+p.jy*26*jit + (k===0?0:0);
    const rz=p.jr*12*jit;
    const isMain=p.i===i0;
    // 부피감: 호버한 카드만 두께가 생기고 마우스 쪽으로 살짝 기움 (크기는 그대로)
    const vT=p.i===hovI?1:0;p.vol+=(vT-p.vol)*.16;if(Math.abs(vT-p.vol)>.003)moving=true;else p.vol=vT;
    const hv=p.vol;
    // 메인 간판: 메인에 가까워질수록 두꺼운 박스로
    const slT=isMain?1:0;p.slab+=(slT-p.slab)*.12;if(Math.abs(slT-p.slab)>.003)moving=true;else p.slab=slT;
    const sl=p.slab*m;
    const tl=lerp(CFG.tilt,CFG.tiltMain,sl);
    const ex=-ty*tl*hv+CFG.signPose.x*sl, ey=tx*tl*hv+CFG.signPose.y*sl;
    const dd=Math.max(sl*CFG.signDepth,hv*(isMain?CFG.depth:CFG.depthSmall))*K;
    if(dd>.5){p.el.classList.add("vol");p.el.style.setProperty("--d",dd.toFixed(1)+"px")}else p.el.classList.remove("vol");
    p.el.classList.toggle("slab",sl>.02);
    if(sl>.02){p.el.style.setProperty("--sl",sl.toFixed(3));p.el.style.setProperty("--fr",(CFG.signFrame*K*sl).toFixed(1)+"px");
      p.el.style.setProperty("--gl",(hv*sl*.9).toFixed(3));
      p.el.style.setProperty("--gx",(50+tx*45).toFixed(1)+"%");p.el.style.setProperty("--gy",(50+ty*45).toFixed(1)+"%")}
    else p.el.style.setProperty("--gl","0");
    const sp=isMain?spin:0;
    p.el.style.width=w.toFixed(1)+"px";p.el.style.height=h.toFixed(1)+"px";
    p.el.style.transform=`translate3d(${(pt.x-w/2+ox).toFixed(1)}px,${(pt.y-h/2+oy).toFixed(1)}px,0) perspective(1600px) rotateY(${(ry+ey).toFixed(2)}deg) rotateX(${(CFG.stand.x*r+ex).toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) skewY(${(CFG.stand.skew*r).toFixed(2)}deg) translateZ(${(dd*.6-dd/2).toFixed(1)}px) rotateY(${sp.toFixed(2)}deg) translateZ(${(dd/2).toFixed(1)}px)`;
    p.el.style.opacity=(1-smooth(CFG.visible-.8,CFG.visible+.4,ak)).toFixed(3);
    const ov=smooth(.3,1,ak)*lerp(CFG.dimNear,CFG.dimFar,smooth(1,4,ak));
    p.el.style.setProperty("--ov",ov.toFixed(3));
    p.z=Math.round(200-ak*20)+(hv>.05?50:0);p.el.style.zIndex=p.z;p.box={x:pt.x-w/2+ox,y:pt.y-h/2+oy,w,h};
    if(isMain){mainBox={x:pt.x-w/2,y:pt.y-h/2,w,h};const ch2=capEl.offsetHeight||30;
      const cx=Math.max(COL.l,pt.x-w/2),cy=clamp(pt.y+h/2+18*K,24*K,H-ch2-24*K)+viewTop;   // viewTop: 화면 끝에서 간판과 함께 올라감   // 사진 제목: 메인 간판 바로 아래
      capEl.style.transform=`translate3d(${cx.toFixed(0)}px,${cy.toFixed(0)}px,0)`}
  }
  if(W>=760)drawRule(pos,s0);
  if(i0!==curI){
    if(curI>=0)PHOTOS[curI].el.classList.remove("main");
    spin=0;spinV=0;drag=null;
    curI=i0;const p=PHOTOS[i0];p.el.classList.add("main");if(curI>=0)window.SND&&SND.tick();
    if(!p.full.src){p.full.onload=()=>p.full.classList.add("ok");p.full.src=`img/history/${pad(p.n)}.jpg`}
    setActive(p);setCap(i0);
  }
  const ot=$("#outro").getBoundingClientRect().top;
  const pr=$("#purpose").getBoundingClientRect();
  const hide=pr.top<H*.6;   // 정비 이유 화면이 올라오면 연표·캡션 숨김
  ["#side","#shade","#cap","#rule","#play","#scrub","#tl"].forEach(s=>$(s).classList.toggle("off",hide));
  if(pr.top<H&&pr.bottom>0){ // 정비 이유: 내려갈수록 안전·경제는 흐려지고, 환경은 라임으로 — 마지막에 이 조사가 보는 것
    const t=clamp(-pr.top/(pr.height-H),0,1), u=$("#purpose");
    // 제목 먼저 → 안전 → 경제 → 환경 차례로 등장 → 환경이 라임으로 강조되며(안전·경제는 흐려짐) 마지막 문장
    const a1=clamp((t-.08)/.12,0,1), a2=clamp((t-.24)/.12,0,1), a3=clamp((t-.40)/.12,0,1);
    const lit=clamp((t-.58)/.14,0,1), fade=lit, end=clamp((t-.64)/.14,0,1);
    for(const [k,v] of [["--a1",a1],["--a2",a2],["--a3",a3],["--fade",fade],["--lit",lit],["--end",end]]) u.style.setProperty(k,v.toFixed(3));
    if(lit>=1&&!u._rang){u._rang=1;window.SND&&SND.rule&&SND.rule();} if(lit<.5)u._rang=0;   // 환경에 불이 들어올 때 '딸깍딸깍'
  }
  if(ot<H){ // 마무리: 사진이 올라오고 → 어두워지며 질문 → 본문 → 다음 버튼
    const oh=$("#outro").offsetHeight,t=clamp(-ot/(oh-H),0,1);
    $("#outroBg").style.transform=`translateY(${(Math.max(ot,0)*.25).toFixed(1)}px) scale(${(1.08-.06*t).toFixed(4)})`;
    const dk=clamp((t-.22)/.3,0,1);$("#outroDim").style.opacity=(dk*dk*(3-2*dk)*.78).toFixed(3);
    const o=$("#outro");o.classList.toggle("c0",t>.03); /* 챕터 제목: 사진이 올라오면 좌측 상단에 계속 표시 */o.classList.toggle("s1",t>.42);o.classList.toggle("s2",t>.52);o.classList.toggle("s3",t>.64);
  }
  view.style.cursor=over?"grab":(hovI>=0?"pointer":"");
  if(moving)req();
}
/* 스크롤 브레이크 — 법·제도 선이 펼쳐지는 해, 연대가 바뀌는 곳에서 확실히 멈춤
   · 휠·트랙패드·키보드·터치로 그 지점을 지나가려 하면 그 자리에 고정
   · 최소 0.8초 + 손을 뗄 때까지(입력이 0.25초 멈출 때까지) 붙잡아 관성으로 미끄러지지 않게
   · 버튼·연표 클릭 같은 자동 이동은 멈추지 않음 */
(()=>{const STOPP=[...new Set([...LAWP,...DECADES.map(d=>PHOTOS.findIndex(p=>p.d===d)).filter(i=>i>0)].filter(p=>p>0&&p<N-1).map(p=>+p.toFixed(3)))].sort((a,b)=>a-b).filter((p,i,arr)=>i===0||p-arr[i-1]>.6);   // 너무 가까운 두 지점은 하나로
  const HOLD=800,IDLE=250;
  let lastY=scrollY,lastIn=-1e9,pin=null,pinT=0,released=null;
  const stops=()=>{const base=$("#scene").offsetTop+LEAD;return STOPP.map(p=>Math.round(base+p*CFG.step*K))};
  const input=()=>{lastIn=performance.now()};
  addEventListener("wheel",e=>{if(e.ctrlKey)return;input();if(pin!==null)e.preventDefault()},{passive:false});
  addEventListener("touchmove",e=>{input();if(pin!==null&&e.cancelable)e.preventDefault()},{passive:false});
  addEventListener("keydown",e=>{if(/^(ArrowDown|ArrowUp|PageDown|PageUp|Space| )$/.test(e.code)||e.key===" "){input();if(pin!==null)e.preventDefault()}});
  function tick(){
    const now=performance.now();
    if(pin!==null){
      if(Math.abs(scrollY-pin)>1)scrollTo(0,pin);
      if(now-pinT>HOLD&&now-lastIn>IDLE){released=pin;pin=null}
    }
    lastY=scrollY;requestAnimationFrame(tick);
  }
  addEventListener("scroll",()=>{
    const y=scrollY,now=performance.now();
    if(pin!==null){if(Math.abs(y-pin)>1)scrollTo(0,pin);lastY=pin;return}
    if(released!==null&&Math.abs(y-released)>40)released=null;
    if(lbOpen||document.body.classList.contains("intro-on")||now-lastIn>400){lastY=y;return}   // 사용자 입력이 아닐 때는 그냥 지나감
    const st=stops();
    const hit=y>lastY?st.find(s=>s>lastY&&s<=y&&s!==released):y<lastY?[...st].reverse().find(s=>s<lastY&&s>=y&&s!==released):undefined;
    if(hit!==undefined){pin=hit;pinT=now;scrollTo(0,hit)}
    lastY=scrollY;
  },{passive:true});
  requestAnimationFrame(tick);
  window.__brakeOff=()=>{pin=null;lastIn=-1e9};   // 연표·버튼으로 이동할 때는 붙잡지 않음
})();
function goPos(p){window.__brakeOff&&__brakeOff();scrollTo({top:$("#scene").offsetTop+LEAD+p*CFG.step*K,behavior:"smooth"})}
function goTo(i){window.__brakeOff&&__brakeOff();scrollTo({top:$("#scene").offsetTop+LEAD+i*CFG.step*K,behavior:"smooth"})}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener("scroll",req,{passive:true});
addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;req()},{passive:true});
addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.lx,now=performance.now();
  if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>5){dragMoved=true;window.__cardSpun=true}
  spin+=dx*.45;spinV=dx*.45*16/Math.max(8,now-drag.t);drag.lx=e.clientX;drag.t=now;window.SND&&SND.spin&&SND.spin(spinV);req()});
addEventListener("pointerup",()=>{if(!drag)return;drag=null;document.querySelectorAll(".card.drag").forEach(c=>c.classList.remove("drag"));req();setTimeout(()=>{dragMoved=false;window.__cardSpun=false},0)});
document.addEventListener("mouseleave",()=>{mx=my=-9999;req()});
addEventListener("resize",()=>{layout();req()});
addEventListener("keydown",e=>{if(lbOpen)return;
  if($("#scene").getBoundingClientRect().bottom<H*.5)return;   // 역사 화면을 지나면 방향키는 기본 스크롤로
  if(["ArrowDown","ArrowRight"].includes(e.key)){e.preventDefault();goTo(clamp(curI+1,0,N-1))}
  if(["ArrowUp","ArrowLeft"].includes(e.key)){e.preventDefault();goTo(clamp(curI-1,0,N-1))}});

/* ════════════ 라이트박스 ════════════ */
let lbI=0;
function openLB(i){
  lbI=i;const p=PHOTOS[i];lbOpen=true;
  $("#lbImg").src=`img/history/${pad(p.n)}.jpg`;$("#lbImg").alt=p.t;
  $("#lbA").textContent=p.d;$("#lbT").textContent=p.t;$("#lbC").textContent=p.c||"";
  $("#lb").classList.add("on");
}
function closeLB(){$("#lb").classList.remove("on");lbOpen=false;req()}
$("#lbX").onclick=closeLB;
$("#lb").addEventListener("click",e=>{if(e.target.id==="lb")closeLB()});
$("#lbP").onclick=()=>openLB((lbI-1+N)%N);
$("#lbN").onclick=()=>openLB((lbI+1)%N);
addEventListener("keydown",e=>{if(!lbOpen)return;if(e.key==="Escape")closeLB();if(e.key==="ArrowLeft")openLB((lbI-1+N)%N);if(e.key==="ArrowRight")openLB((lbI+1)%N)});



layout();req();
addEventListener("load",req);

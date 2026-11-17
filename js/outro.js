/* 마무리 화면의 "다음 페이지" 버튼 */
/* 다음 페이지 주소: 다음 페이지 파일을 만들면 여기만 바꾸면 됨 */
const NEXT_URL="survey.html"; // 서울 9개 구역 지도·조사 방법 페이지 → 그다음 90동 데이터
document.getElementById("outroGo").addEventListener("click",()=>{document.getElementById("fadeOut").classList.add("on");setTimeout(()=>window.SND&&SND.go?SND.go(NEXT_URL):location.href=NEXT_URL,620)});
addEventListener("pageshow",()=>document.getElementById("fadeOut").classList.remove("on"));


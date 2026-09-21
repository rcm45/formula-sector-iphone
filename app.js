const drivers=[
["Anderson","44","S","LEADER","1:24.381","1:23.902",18,312],
["Sebastian","7","M","+1.842","1:26.223","1:24.110",18,309],
["AV Racing","21","S","+3.116","1:25.492","1:24.502",18,315],
["Danila Tolstov","12","M","+4.870","1:27.104","1:24.681",18,307],
["Kaïs Aouida","63","S","+7.221","1:25.910","1:24.901",18,310],
["Kamil Matysek","18","H","+9.045","1:26.822","1:25.031",18,305],
["Solo","5","M","+12.392","1:27.331","1:25.220",18,303],
["Wattu77","77","S","+14.880","1:25.884","1:25.304",18,311],
["Paul-Phiney Bah","28","H","+17.206","1:27.801","1:25.552",18,301],
["Kevin Rangel","16","M","+19.114","1:26.901","1:25.610",18,304],
["Marco Ciccarelli","32","M","+25.772","1:27.992","1:26.014",18,302],
["Aubeck","4","H","+28.190","1:28.510","1:26.221",18,297]

const board=document.querySelector("#board"), gapSeg=document.querySelector("#gap-seg"), hGap=document.querySelector("#h-gap");
let mode="interval", remaining=14*60+17, elapsed=0;

function renderBoard(){
 board.innerHTML=drivers.map((d,i)=>`<li><span class="pos">${i+1}</span><span class="driver">${d[0]} <span class="number">#${d[1]}</span></span><span class="tyre ${d[2]}">${d[2]}</span><span class="gap">${mode==="interval"?d[3]:"+"+ (i? (i*2.1).toFixed(3):"0.000")}</span><span class="muted">${d[4]}</span><span>${d[5]}</span><span>${d[6]}</span><span>${d[7]} km/h</span></li>`).join("");
 hGap.textContent=mode==="interval"?"Interval":"Leader";
}
renderBoard();

gapSeg.addEventListener("click",e=>{if(e.target.dataset.mode){mode=e.target.dataset.mode;gapSeg.dataset.mode=mode;renderBoard()}});

function timer(){
 if(remaining>0)remaining--; elapsed++;
 const m=Math.floor(remaining/60),s=remaining%60,t=`${m}:${String(s).padStart(2,"0")}`;
 document.querySelector("#clock").textContent=t;document.querySelector("#bar-timer").textContent=t;
 document.querySelector("#progress i").style.width=`${Math.max(4,remaining/(14*60+17)*100)}%`;
 if(elapsed%12===0){drivers.forEach(d=>{d[4]=`1:${24+Math.floor(Math.random()*5)}.${String(Math.floor(Math.random()*999)).padStart(3,"0")}`});renderBoard()}
}
setInterval(timer,1000);

const track=document.querySelector("#track"),under=document.querySelector("#track-under"),line=document.querySelector("#track-line");
const path="M45 105 C25 80 45 38 91 38 C137 38 150 68 185 68 C220 68 228 32 278 38 C326 44 334 93 298 111 C260 130 220 110 185 105 C150 100 126 119 92 119 C70 119 53 115 45 105 Z";
[track,under,line].forEach(p=>p.setAttribute("d",path));
const ns="http://www.w3.org/2000/svg",dots=document.querySelector("#dots");
for(let i=0;i<8;i++){let c=document.createElementNS(ns,"circle");c.setAttribute("r",4);c.setAttribute("class","dot");dots.appendChild(c)}
const dotEls=[...dots.children];
function moveDots(){
 const L=track.getTotalLength();
 dotEls.forEach((d,i)=>{const pt=track.getPointAtLength((L*((elapsed*0.0009+i/8)%1)));d.setAttribute("cx",pt.x);d.setAttribute("cy",pt.y)});
}
setInterval(moveDots,80);moveDots();

const feedData=[["14:12","Green flag. Race underway."],["13:48","Driver #77 enters Turn 6 off-line."],["12:56","Fastest lap: Anderson Osas, 1:23.902."],["11:21","DRS enabled across the circuit."],["09:44","Yellow flag cleared at Sector 2."]];
document.querySelector("#feed").innerHTML=feedData.map(x=>`<div class="feed-row"><span class="feed-time">${x[0]}</span><i class="feed-dot"></i><span class="feed-text">${x[1]}</span></div>`).join("");

const root=document.querySelector("#sheet-root"),title=document.querySelector("#sheet-title"),body=document.querySelector("#sheet-body");
function openSheet(t,html){title.textContent=t;body.innerHTML=html;root.hidden=false;document.body.style.overflow="hidden"}
function closeSheet(){root.hidden=true;document.body.style.overflow=""}
document.querySelector("#stored-btn").onclick=()=>openSheet("Stored times",drivers.slice(0,5).map(d=>`<div class="stored-row"><span><b>${d[0]}</b><br><small>Best lap</small></span><b>${d[5]}</b></div>`).join(""));
document.querySelector("#sheet-close").onclick=closeSheet;
document.querySelector("#sheet-backdrop").onclick=closeSheet;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});

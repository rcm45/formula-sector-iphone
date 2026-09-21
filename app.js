const drivers = [
  { pos: 1, name: "Anderson", vehicle: "alpine_a525_csp", laps: 29, time: "39:26.8350", bestLap: "01:18.6080", consistency: "96.68%", led: 24, gapLeader: "39:26.8350", gapInterval: "LEADER" },
  { pos: 2, name: "Sebastian", vehicle: "alpine_a525_csp", laps: 29, time: "+00:23.5460", bestLap: "01:18.7010", consistency: "95.78%", led: 4, gapLeader: "+23.546s", gapInterval: "+23.546s" },
  { pos: 3, name: "Danila Tolstov", vehicle: "aston_martin_amr25_csp", laps: 29, time: "+00:48.5040", bestLap: "01:20.4220", consistency: "98.40%", led: 0, gapLeader: "+48.504s", gapInterval: "+24.958s" },
  { pos: 4, name: "Kamil Matysek", vehicle: "red_bull_rb21_s2_csp", laps: 29, time: "+00:50.4270", bestLap: "01:20.3090", consistency: "96.58%", led: 0, gapLeader: "+50.427s", gapInterval: "+1.923s" },
  { pos: 5, name: "Solo", vehicle: "ferrari_sf25", laps: 29, time: "+01:20.1880", bestLap: "01:19.8670", consistency: "95.01%", led: 0, gapLeader: "+1:20.188s", gapInterval: "+29.761s" },
  { pos: 6, name: "wattu77", vehicle: "mercedes_w16", laps: 28, time: "+1 lap", bestLap: "01:20.0760", consistency: "96.38%", led: 0, gapLeader: "+1 Lap", gapInterval: "+1 Lap" },
  { pos: 7, name: "AV Racing", vehicle: "mclaren_mcl39_csp", laps: 27, time: "+2 laps", bestLap: "01:19.1180", consistency: "92.10%", led: 0, gapLeader: "+2 Laps", gapInterval: "+1 Lap" },
  { pos: 8, name: "Aubeck", vehicle: "mclaren_mcl39_csp", laps: 26, time: "+3 laps", bestLap: "01:21.5940", consistency: "95.67%", led: 1, gapLeader: "+3 Laps", gapInterval: "+1 Lap" }
];

const board = document.querySelector("#board");
const gapSeg = document.querySelector("#gap-seg");
const hGap = document.querySelector("#h-gap");
let mode = "interval";

function renderBoard() {
  board.innerHTML = drivers.map(d => `
    <li onclick="showDriverDetails('${d.name}')">
      <span class="pos">${d.pos}</span>
      <span class="driver">${d.name}</span>
      <span class="vehicle-tag">${d.vehicle}</span>
      <span>${d.laps}</span>
      <span class="gap">${mode === "interval" ? d.gapInterval : d.gapLeader}</span>
      <span class="muted">${d.bestLap}</span>
      <span class="consistency">${d.consistency}</span>
      <span>${d.led}</span>
    </li>
  `).join("");
  hGap.textContent = mode === "interval" ? "Interval" : "To Leader";
}
renderBoard();

gapSeg.addEventListener("click", e => {
  if (e.target.dataset.mode) {
    mode = e.target.dataset.mode;
    gapSeg.dataset.mode = mode;
    renderBoard();
  }
});

// Barcelona SVG Track Coordinates
const track = document.querySelector("#track");
const under = document.querySelector("#track-under");
const line = document.querySelector("#track-line");
const barcelonaPath = "M 80,180 L 380,180 C 420,180 450,160 450,130 C 450,100 420,80 380,80 L 320,80 C 300,80 280,60 280,40 C 280,25 260,20 240,30 L 200,60 C 180,75 160,70 140,50 L 110,25 C 90,10 60,20 60,45 L 60,90 C 60,110 40,125 25,140 C 10,155 30,180 80,180 Z";

[track, under, line].forEach(p => p.setAttribute("d", barcelonaPath));

// Live dynamic racing dots along Barcelona SVG circuit
const ns = "http://www.w3.org/2000/svg";
const dots = document.querySelector("#dots");
for (let i = 0; i < drivers.length; i++) {
  let c = document.createElementNS(ns, "circle");
  c.setAttribute("r", "5");
  c.setAttribute("class", "dot");
  dots.appendChild(c);
}

const dotEls = [...dots.children];
let animProgress = 0;

function moveDots() {
  animProgress += 0.0008;
  const pathLength = track.getTotalLength();
  dotEls.forEach((d, i) => {
    const offset = (animProgress + (i * 0.11)) % 1;
    const pt = track.getPointAtLength(pathLength * offset);
    d.setAttribute("cx", pt.x);
    d.setAttribute("cy", pt.y);
  });
  requestAnimationFrame(moveDots);
}
requestAnimationFrame(moveDots);

// Race Control Log
const feedData = [
  ["39:26", "Chequered Flag: Anderson wins the Spanish GP at Barcelona!"],
  ["38:10", "Anderson sets race leading consistency benchmark at 96.68%."],
  ["31:05", "Danila Tolstov holding P3 with top overall consistency (98.40%)."],
  ["22:40", "Aubeck completes pit stop strategy adjustment."],
  ["00:00", "Green Flag: Spanish Grand Prix is GO!"]
];

document.querySelector("#feed").innerHTML = feedData.map(x => `
  <div class="feed-row">
    <span class="feed-time">${x[0]}</span>
    <i class="feed-dot"></i>
    <span class="feed-text">${x[1]}</span>
  </div>
`).join("");

// Bottom Modal Telemetry Sheet
const root = document.querySelector("#sheet-root");
const title = document.querySelector("#sheet-title");
const body = document.querySelector("#sheet-body");

function openSheet(t, html) {
  title.textContent = t;
  body.innerHTML = html;
  root.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  root.hidden = true;
  document.body.style.overflow = "";
}

window.showDriverDetails = function(driverName) {
  const d = drivers.find(x => x.name === driverName);
  if (!d) return;
  openSheet(`${d.name} (#${d.pos}) Telemetry`, `
    <div style="padding: 10px 0;">
      <p><b>Vehicle Chassis:</b> <code>${d.vehicle}</code></p>
      <p><b>Total Race Time / Status:</b> ${d.time}</p>
      <p><b>Best Lap:</b> ${d.bestLap}</p>
      <p><b>Consistency Index:</b> <span class="consistency">${d.consistency}</span></p>
      <p><b>Laps Completed:</b> ${d.laps}</p>
      <p><b>Laps Led:</b> ${d.led}</p>
    </div>
  `);
};

document.querySelector("#stored-btn").onclick = () => {
  openSheet("Full Roster Telemetry", drivers.map(d => `
    <div class="stored-row">
      <div>
        <b>P${d.pos} ${d.name}</b><br>
        <small>${d.vehicle}</small>
      </div>
      <div style="text-align:right">
        <b>${d.bestLap}</b><br>
        <small class="consistency">${d.consistency}</small>
      </div>
    </div>
  `).join(""));
};

document.querySelector("#sheet-close").onclick = closeSheet;
document.querySelector("#sheet-backdrop").onclick = closeSheet;
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

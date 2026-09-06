type ZoneElement = HTMLElement & { dataset: { x?: string; y?: string; z?: string } };

const WORLD_WIDTH = 7200;
const WORLD_HEIGHT = 4800;
const world = document.querySelector<HTMLElement>("#world");
const viewport = document.querySelector<HTMLElement>("#viewport");
const zones = [...document.querySelectorAll<ZoneElement>(".zone")];
const pins = [...document.querySelectorAll<HTMLButtonElement>(".map-pin")];
const locationReadout = document.querySelector<HTMLElement>("#locationReadout");
const routeProgress = document.querySelector<HTMLElement>("#routeProgress");
const previousButton = document.querySelector<HTMLButtonElement>("#previousButton");
const nextButton = document.querySelector<HTMLButtonElement>("#nextButton");
const mapButton = document.querySelector<HTMLButtonElement>("#mapButton");
const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoomOutButton");
const zoomInButton = document.querySelector<HTMLButtonElement>("#zoomInButton");
const themeButton = document.querySelector<HTMLButtonElement>("#themeButton");
const soundButton = document.querySelector<HTMLButtonElement>("#soundButton");
const fullscreenButton = document.querySelector<HTMLButtonElement>("#fullscreenButton");
const notesButton = document.querySelector<HTMLButtonElement>("#notesButton");
const notesPanel = document.querySelector<HTMLElement>("#notesPanel");
const notesContent = document.querySelector<HTMLElement>("#notesContent");
const notesStop = document.querySelector<HTMLElement>("#notesStop");
const closeNotes = document.querySelector<HTMLButtonElement>("#closeNotes");
const demoReset = document.querySelector<HTMLButtonElement>("#demoReset");
const demoStatus = document.querySelector<HTMLElement>("#demoStatus");
const audioGate = document.querySelector<HTMLButtonElement>("#audioGate");

if (!world || !viewport || !routeProgress || !previousButton || !nextButton) {
  throw new Error("The field map could not be initialized.");
}

zones.forEach((zone) => {
  zone.style.left = `${Number(zone.dataset.x)}px`;
  zone.style.top = `${Number(zone.dataset.y)}px`;
});

let current: number | null = null;
let exploreAnchor: number | null = null;
let camera = { x: 0, y: 0, scale: 1 };
let dragging = false;
let dragMoved = false;
let pointerStart = { x: 0, y: 0, cameraX: 0, cameraY: 0 };
let demoTimers: number[] = [];
let transitionTimer = 0;

class SoundEngine {
  enabled = true;
  private context: AudioContext | null = null;
  private ambient: GainNode | null = null;

  start() {
    if (!this.enabled) return;
    if (this.context?.state === "suspended") void this.context.resume();
    if (this.context) return;

    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    this.context = new AudioContextClass();
    this.ambient = this.context.createGain();
    this.ambient.gain.value = 0.014;
    this.ambient.connect(this.context.destination);

    [42, 63, 84].forEach((frequency, index) => {
      const oscillator = this.context!.createOscillator();
      const gain = this.context!.createGain();
      oscillator.type = index === 1 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.5 : 0.17;
      oscillator.connect(gain).connect(this.ambient!);
      oscillator.start();
    });
    if (audioGate) audioGate.dataset.enabled = "true";
    audioGate?.classList.remove("visible");
  }

  pulse(direction = 1) {
    if (!this.enabled) return;
    this.start();
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(direction > 0 ? 170 : 135, now);
    oscillator.frequency.exponentialRampToValueAtTime(direction > 0 ? 510 : 240, now + .06);
    gain.gain.setValueAtTime(.028, now);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .08);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + .085);
  }

  toggle() {
    this.enabled = !this.enabled;
    document.body.classList.toggle("sound-on", this.enabled);
    if (this.enabled) {
      this.start();
      if (this.context && this.ambient) this.ambient.gain.setTargetAtTime(.014, this.context.currentTime, .04);
    } else if (this.context && this.ambient) {
      this.ambient.gain.setTargetAtTime(.0001, this.context.currentTime, .04);
    }
    const label = soundButton?.querySelector("span");
    if (label) label.textContent = this.enabled ? "ON" : "OFF";
  }
}

declare global {
  interface Window { webkitAudioContext: typeof AudioContext; }
}

const sound = new SoundEngine();
document.body.classList.add("sound-on");

zones.forEach((zone, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.ariaLabel = `Ir al punto ${index + 1}`;
  dot.addEventListener("click", () => goTo(index));
  routeProgress!.append(dot);
});
const progressDots = [...routeProgress.querySelectorAll<HTMLButtonElement>("button")];

function setCamera(next: typeof camera, animate = true) {
  camera = next;
  document.body.classList.toggle("manual-camera", !animate);
  document.body.classList.toggle("camera-moving", animate);
  world!.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`;
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    document.body.classList.remove("manual-camera", "camera-moving");
  }, animate ? 1050 : 80);
}

function overviewCamera(animate = true) {
  const scale = getOverviewScale();
  setCamera({
    scale,
    x: (window.innerWidth - WORLD_WIDTH * scale) / 2,
    y: (window.innerHeight - WORLD_HEIGHT * scale) / 2,
  }, animate);
}

function getOverviewScale() {
  return Math.min(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT) * .88;
}

function focusCamera(index: number, animate = true) {
  const zone = zones[index];
  if (!zone) return;
  const x = Number(zone.dataset.x);
  const y = Number(zone.dataset.y);
  const zoneZoom = Number(zone.dataset.z ?? 1);
  const topSafeArea = 12;
  const bottomSafeArea = 92;
  const availableHeight = window.innerHeight - topSafeArea - bottomSafeArea;
  const centerY = topSafeArea + availableHeight / 2;
  const scale = Math.min(window.innerWidth / 1200, availableHeight / 700) * .92 * zoneZoom;
  setCamera({ scale, x: window.innerWidth / 2 - x * scale, y: centerY - y * scale }, animate);
}

function clearDemo() {
  demoTimers.forEach(window.clearTimeout);
  demoTimers = [];
  document.querySelectorAll(".demo-step").forEach((step) => step.classList.remove("revealed"));
  if (demoStatus) demoStatus.textContent = "AUTO SEQUENCE · 8 SEC";
}

function runDemo() {
  clearDemo();
  const steps = [...document.querySelectorAll<HTMLElement>(".demo-step")]
    .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  steps.forEach((step, index) => {
    demoTimers.push(window.setTimeout(() => {
      step.classList.add("revealed");
      sound.pulse(1);
      if (demoStatus) demoStatus.textContent = index === steps.length - 1 ? "LOOP CLOSED · REALITY INJECTED" : `SIGNAL ${index + 1} / ${steps.length}`;
    }, 600 + index * 1600));
  });
}

function updateNotes() {
  if (current === null) {
    if (notesContent) notesContent.textContent = "Selecciona un punto del mapa. Usa O para volver aquí, scroll para hacer zoom y drag para recorrer el canvas libremente.";
    if (notesStop) notesStop.textContent = "MAP";
    return;
  }
  const aside = zones[current]?.querySelector("aside");
  if (notesContent) notesContent.innerHTML = aside?.innerHTML ?? "";
  if (notesStop) notesStop.textContent = String(current + 1).padStart(2, "0");
}

function updateInterface() {
  zones.forEach((zone, index) => zone.classList.toggle("active", index === current));
  pins.forEach((pin, index) => pin.classList.toggle("active", index === current));
  progressDots.forEach((dot, index) => dot.classList.toggle("active", index === current));
  previousButton!.disabled = current === null || current === 0;
  nextButton!.disabled = current === zones.length - 1;
  if (locationReadout) locationReadout.textContent = current === null ? `OVERVIEW / ${zones.length} STOPS` : `${String(current + 1).padStart(2, "0")} / ${String(zones.length).padStart(2, "0")} · ${pins[current]?.querySelector("small")?.textContent ?? ""}`;
  updateNotes();
}

function showOverview(animate = true) {
  current = null;
  exploreAnchor = null;
  clearDemo();
  document.body.classList.add("overview");
  document.body.classList.remove("free-explore");
  history.replaceState(null, "", "#map");
  document.title = "MAP · Vibe Hardware";
  updateInterface();
  overviewCamera(animate);
  sound.pulse(-1);
}

function goTo(index: number, animate = true) {
  const next = Math.max(0, Math.min(zones.length - 1, index));
  const direction = current === null || next >= current ? 1 : -1;
  current = next;
  exploreAnchor = next;
  document.body.classList.remove("overview", "free-explore");
  history.replaceState(null, "", `#${next + 1}`);
  document.title = `${String(next + 1).padStart(2, "0")} · Vibe Hardware`;
  updateInterface();
  focusCamera(next, animate);
  clearDemo();
  if (zones[next]?.classList.contains("live-zone")) runDemo();
  sound.pulse(direction);
}

function enterFreeExplore() {
  const alreadyExploring = document.body.classList.contains("free-explore");
  if (!alreadyExploring) exploreAnchor = current;
  document.body.classList.remove("overview");
  document.body.classList.add("free-explore");
  if (!alreadyExploring) {
    if (locationReadout) locationReadout.textContent = "FREE MAP · O TO RESET";
    history.replaceState(null, "", "#explore");
    document.title = "EXPLORE · Vibe Hardware";
  }
}

function setExploreAnchor(worldX: number, worldY: number) {
  exploreAnchor = zones.reduce((nearest, zone, index) => {
    const nearestZone = zones[nearest]!;
    const nearestDistance = (Number(nearestZone.dataset.x) - worldX) ** 2 + (Number(nearestZone.dataset.y) - worldY) ** 2;
    const distance = (Number(zone.dataset.x) - worldX) ** 2 + (Number(zone.dataset.y) - worldY) ** 2;
    return distance < nearestDistance ? index : nearest;
  }, 0);
  previousButton!.disabled = exploreAnchor === 0;
  nextButton!.disabled = exploreAnchor === zones.length - 1;
  if (locationReadout) {
    const label = pins[exploreAnchor]?.querySelector("small")?.textContent ?? "";
    locationReadout.textContent = `FREE MAP · NEAR ${String(exploreAnchor + 1).padStart(2, "0")} · ${label}`;
  }
}

function navigationAnchor() {
  return document.body.classList.contains("free-explore") ? exploreAnchor : current;
}

function zoomAt(factor: number, screenX = window.innerWidth / 2, screenY = window.innerHeight / 2) {
  const worldX = (screenX - camera.x) / camera.scale;
  const worldY = (screenY - camera.y) / camera.scale;
  const scale = Math.max(getOverviewScale(), Math.min(2.2, camera.scale * factor));
  if (factor < 1 && scale <= getOverviewScale() * 1.12) {
    showOverview();
    return;
  }
  enterFreeExplore();
  setExploreAnchor(worldX, worldY);
  setCamera({ scale, x: screenX - worldX * scale, y: screenY - worldY * scale }, false);
}

function toggleNotes() {
  const open = notesPanel?.classList.toggle("open") ?? false;
  notesButton?.classList.toggle("active", open);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  themeButton?.classList.toggle("active", next === "light");
  sound.pulse(1);
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
}

pins.forEach((pin) => pin.addEventListener("click", (event) => {
  event.stopPropagation();
  goTo(Number(pin.dataset.target));
}));

viewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  zoomAt(event.deltaY < 0 ? 1.12 : .89, event.clientX, event.clientY);
}, { passive: false });

viewport.addEventListener("pointerdown", (event) => {
  if ((event.target as Element).closest("button, a")) return;
  dragging = true;
  dragMoved = false;
  pointerStart = { x: event.clientX, y: event.clientY, cameraX: camera.x, cameraY: camera.y };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add("dragging");
  document.body.classList.add("manual-camera");
});

viewport.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
  enterFreeExplore();
  setCamera({ ...camera, x: pointerStart.cameraX + dx, y: pointerStart.cameraY + dy }, false);
});

viewport.addEventListener("pointerup", (event) => {
  dragging = false;
  viewport.releasePointerCapture(event.pointerId);
  viewport.classList.remove("dragging");
  document.body.classList.remove("manual-camera");
  if (dragMoved) {
    setExploreAnchor(
      (window.innerWidth / 2 - camera.x) / camera.scale,
      (window.innerHeight / 2 - camera.y) / camera.scale,
    );
  }
});

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(event.key)) {
    event.preventDefault();
    const anchor = navigationAnchor();
    goTo(anchor === null ? 0 : anchor + 1);
  }
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    const anchor = navigationAnchor();
    if (anchor !== null) goTo(anchor - 1);
  }
  if (event.key === "Home" || event.key === "Escape" || event.key.toLowerCase() === "o") showOverview();
  if (event.key === "End") goTo(zones.length - 1);
  if (event.key === "+" || event.key === "=") zoomAt(1.15);
  if (event.key === "-") zoomAt(.87);
  if (event.key.toLowerCase() === "t") toggleTheme();
  if (event.key.toLowerCase() === "m") sound.toggle();
  if (event.key.toLowerCase() === "f") toggleFullscreen();
  if (event.key.toLowerCase() === "n") toggleNotes();
  if (event.key.toLowerCase() === "r" && current !== null && zones[current]?.classList.contains("live-zone")) runDemo();
});

mapButton?.addEventListener("click", () => showOverview());
zoomOutButton?.addEventListener("click", () => zoomAt(.82));
zoomInButton?.addEventListener("click", () => zoomAt(1.22));
previousButton.addEventListener("click", () => {
  const anchor = navigationAnchor();
  if (anchor !== null) goTo(anchor - 1);
});
nextButton.addEventListener("click", () => {
  const anchor = navigationAnchor();
  goTo(anchor === null ? 0 : anchor + 1);
});
themeButton?.addEventListener("click", toggleTheme);
soundButton?.addEventListener("click", () => sound.toggle());
fullscreenButton?.addEventListener("click", toggleFullscreen);
notesButton?.addEventListener("click", toggleNotes);
closeNotes?.addEventListener("click", toggleNotes);
demoReset?.addEventListener("click", runDemo);
audioGate?.addEventListener("click", () => sound.start());

window.addEventListener("resize", () => {
  if (document.body.classList.contains("overview")) overviewCamera(false);
  else if (!document.body.classList.contains("free-explore") && current !== null) focusCamera(current, false);
});

window.addEventListener("hashchange", () => {
  const value = location.hash.slice(1);
  if (value === "map" || !value) showOverview();
  else if (Number.isFinite(Number(value))) goTo(Number(value) - 1);
});

const initialHash = location.hash.slice(1);
if (initialHash && initialHash !== "map" && Number.isFinite(Number(initialHash))) goTo(Number(initialHash) - 1, false);
else showOverview(false);

window.setTimeout(() => document.querySelector("#boot")?.classList.add("ready"), 750);
window.setTimeout(() => {
  if (audioGate?.dataset.enabled !== "true") audioGate?.classList.add("visible");
}, 2100);

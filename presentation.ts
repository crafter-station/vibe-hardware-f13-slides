const slides = [...document.querySelectorAll<HTMLElement>(".slide")];
const notesPanel = document.querySelector<HTMLElement>("#notesPanel");
const notesContent = document.querySelector<HTMLElement>("#notesContent");
const notesSlide = document.querySelector<HTMLElement>("#notesSlide");
const closeNotes = document.querySelector<HTMLButtonElement>("#closeNotes");

if (slides.length === 0) {
  throw new Error("The presentation has no slides.");
}

const clampIndex = (index: number): number =>
  Math.max(0, Math.min(slides.length - 1, index));

const indexFromHash = (): number => {
  const parsed = Number(window.location.hash.slice(1));
  return Number.isInteger(parsed) && parsed > 0 ? clampIndex(parsed - 1) : 0;
};

let current = indexFromHash();

const updateNotes = (): void => {
  const aside = slides[current]?.querySelector("aside");
  if (notesContent) notesContent.innerHTML = aside?.innerHTML ?? "";
  if (notesSlide) notesSlide.textContent = String(current + 1).padStart(2, "0");
};

const showSlide = (index: number, updateHash = true): void => {
  current = clampIndex(index);

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === current;
    slide.classList.toggle("active", active);
    slide.ariaHidden = String(!active);
  });

  if (updateHash) history.replaceState(null, "", `#${current + 1}`);
  document.title = `${String(current + 1).padStart(2, "0")} · Vibe Hardware`;
  updateNotes();
};

const toggleNotes = (): void => {
  const open = notesPanel?.classList.toggle("open") ?? false;
  notesPanel?.setAttribute("aria-hidden", String(!open));
};

const toggleFullscreen = (): void => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
};

document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(event.key)) {
    event.preventDefault();
    showSlide(current + 1);
  }

  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    showSlide(current - 1);
  }

  if (event.key === "Home") showSlide(0);
  if (event.key === "End") showSlide(slides.length - 1);
  if (event.key.toLowerCase() === "n") toggleNotes();
  if (event.key.toLowerCase() === "f") toggleFullscreen();
});

document.addEventListener("click", (event) => {
  if ((event.target as Element).closest("button, a, .notes-panel")) return;
  showSlide(current + 1);
});

closeNotes?.addEventListener("click", toggleNotes);
window.addEventListener("hashchange", () => showSlide(indexFromHash(), false));

showSlide(current, false);

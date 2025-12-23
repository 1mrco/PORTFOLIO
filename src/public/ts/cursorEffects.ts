type CubeConfig = {
  readonly maxCubes: number;
  readonly spawnIntervalMs: number;
  readonly lifetimeMs: number;
};

const CONFIG: CubeConfig = {
  maxCubes: 40,
  spawnIntervalMs: 50,
  lifetimeMs: 1600
};

let lastSpawnTime = 0;
let cubeContainer: HTMLDivElement | null = null;

function ensureContainer(): HTMLDivElement {
  if (cubeContainer && document.body.contains(cubeContainer)) {
    return cubeContainer;
  }

  const container = document.createElement("div");
  container.id = "cursor-cube-layer";
  document.body.appendChild(container);
  cubeContainer = container;
  return container;
}

function currentTimestamp(): number {
  return window.performance?.now() ?? Date.now();
}

function spawnCube(event: MouseEvent): void {
  const now = currentTimestamp();
  if (now - lastSpawnTime < CONFIG.spawnIntervalMs) {
    return;
  }
  lastSpawnTime = now;

  const container = ensureContainer();
  const rect = container.getBoundingClientRect();

  const relX = event.clientX - rect.left;
  const relY = event.clientY - rect.top;

  const cube = document.createElement("div");
  cube.className = "cursor-cube";

  const size = 10 + Math.random() * 18;

  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = (Math.random() - 0.5) * 40;

  cube.style.width = `${size}px`;
  cube.style.height = `${size}px`;
  cube.style.left = `${relX + offsetX}px`;
  cube.style.top = `${relY + offsetY}px`;

  const rotateZStart = Math.random() * 360;
  cube.style.setProperty("--cube-rotate-z-start", `${rotateZStart}deg`);

  container.appendChild(cube);

  while (container.children.length > CONFIG.maxCubes) {
    const first = container.firstElementChild;
    if (first) {
      container.removeChild(first);
    } else {
      break;
    }
  }

  window.setTimeout(() => {
    cube.remove();
  }, CONFIG.lifetimeMs + 200);
}

function initCursorEffects(): void {
  ensureContainer();
  window.addEventListener("mousemove", spawnCube);
}

document.addEventListener("DOMContentLoaded", () => {
  initCursorEffects();
});




"use strict";
const CONFIG = {
    maxCubes: 40,
    spawnIntervalMs: 50,
    lifetimeMs: 1600
};
let lastSpawnTime = 0;
let cubeContainer = null;
function ensureContainer() {
    if (cubeContainer && document.body.contains(cubeContainer)) {
        return cubeContainer;
    }
    const container = document.createElement("div");
    container.id = "cursor-cube-layer";
    document.body.appendChild(container);
    cubeContainer = container;
    return container;
}
function currentTimestamp() {
    var _a, _b;
    return (_b = (_a = window.performance) === null || _a === void 0 ? void 0 : _a.now()) !== null && _b !== void 0 ? _b : Date.now();
}
function spawnCube(event) {
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
        }
        else {
            break;
        }
    }
    window.setTimeout(() => {
        cube.remove();
    }, CONFIG.lifetimeMs + 200);
}
function initCursorEffects() {
    ensureContainer();
    window.addEventListener("mousemove", spawnCube);
}
document.addEventListener("DOMContentLoaded", () => {
    initCursorEffects();
});

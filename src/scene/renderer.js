import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { CONFIG } from '../utils/config.js';
import { isTouchDevice } from '../utils/math.js';

export function createRenderers(container) {
  // Determine performance settings dynamically
  const isTouch = isTouchDevice();
  CONFIG.performance.maxPixelRatio = isTouch ? 1 : 2;
  CONFIG.performance.usePostProcessing = !isTouch;
  CONFIG.performance.useShadows = !isTouch;
  
  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',  // Tell GPU driver to use fast mode
    stencil: false,                        // Disable unused stencil buffer
    depth: true,
  });
  // Cap pixel ratio at 1.5 — going to 2x doubles GPU work for minimal gain
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = false;       // No shadows
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // CSS2D Renderer (For Labels)
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(container.clientWidth, container.clientHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  labelRenderer.domElement.style.pointerEvents = 'none';
  labelRenderer.domElement.id = 'label-renderer-layer';
  container.appendChild(labelRenderer.domElement);

  // Handle Resize
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
  });

  return { renderer, labelRenderer };
}

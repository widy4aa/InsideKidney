import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { createScene } from './src/scene/scene.js';
import { createCamera } from './src/scene/camera.js';
import { createRenderers } from './src/scene/renderer.js';
import { setupLighting } from './src/scene/lights.js';
import { loadKidneyModels, MODEL_DEFS } from './src/models/kidney.js';
import { t, getCurrentLang } from './src/lang/translations.js';

// ─── i18n helpers for part data ─────────────────────────────────
function partName(part)     { return getCurrentLang() === 'th' && part.name_th     ? part.name_th     : part.name; }
function partCategory(part) { return getCurrentLang() === 'th' && part.category_th ? part.category_th : (part.category || ''); }
function partDesc(part)     { return getCurrentLang() === 'th' && part.description_th ? part.description_th : (part.description || ''); }
function partFacts(part)    { return getCurrentLang() === 'th' && part.facts_th     ? part.facts_th    : (part.facts || []); }

let scene, camera, renderer, labelRenderer, controls;
let activeModelGroup = null;
let KIDNEY_PARTS = [];
let labelObjects = []; // { part, css2dObj, el }
let defaultSceneBackground = null;
let defaultSceneFog = null;

// ─── Edit / Drag State ───────────────────────────────────────
let isEditMode = false;   // controlled by the toggle in the sidebar
let dragState  = null;
let isDragging = false;

// ─── Camera Animation ─────────────────────────────────────────
// Set camAnim.active = true to smoothly fly the camera to a new position.
const camAnim = {
  active:    false,
  targetPos: new THREE.Vector3(),   // where camera should end up
  targetPiv: new THREE.Vector3(),   // where controls.target should end up
  speed:     0.08,                  // lerp factor per frame (0–1), higher = faster
};

// ─── AR Camera Mode State ─────────────────────────────────────
const arState = {
  active: false,
  stream: null,
  scale: 0.8,
  opacity: 0.9,
  angle: 'front',
  launchRequested: false,
  orientationEnabled: false,
  baseAlpha: null,
  baseBeta: null,
  baseGamma: null,
  yaw: 0,
  pitch: 0,
  target: new THREE.Vector3(),
  radius: 5,
};

// ─── Config ──────────────────────────────────────────────────
async function fetchConfig() {
  try {
    const response = await fetch('conf.json');
    KIDNEY_PARTS = await response.json();
    init();
  } catch (err) {
    console.error('Failed to load conf.json', err);
  }
}

// ─── Init ─────────────────────────────────────────────────────
function init() {
  const container = document.getElementById('viewer-container');

  scene = createScene();
  defaultSceneBackground = scene.background ? scene.background.clone() : null;
  defaultSceneFog = scene.fog ? scene.fog.clone() : null;
  camera = createCamera(container);

  const renderers = createRenderers(container);
  renderer = renderers.renderer;
  labelRenderer = renderers.labelRenderer;

  setupLighting(scene, renderer);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 20;

  initUI();
  initLabelManager();
  initDragSystem();
  initModelPositionEditor();
  initARControls();
  initARLaunchMode();

  const progressBar  = document.getElementById('progress-bar');
  const loadingText  = document.getElementById('loading-text');

  loadKidneyModels(
    scene,
    (progress) => {
      const percent = Math.round(progress * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (loadingText) loadingText.textContent = `${t('loading_models')} ${percent}%`;
    },
    (modelGroup) => {
      activeModelGroup = modelGroup;

      const box    = new THREE.Box3().setFromObject(modelGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      camera.position.set(center.x, center.y, center.z + maxDim * 1.5);
      controls.target.copy(center);
      controls.update();

      renderLabels();
      populateFilterList(modelGroup);
      syncModelPositionEditor();
      applyARPresentation();
      if (arState.launchRequested) prepareARLaunch();

      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
      }
    }
  );

  animate();
}

// ─── Render Labels ────────────────────────────────────────────
function renderLabels() {
  // Remove old labels
  labelObjects.forEach(({ css2dObj }) => scene.remove(css2dObj));
  labelObjects = [];

  KIDNEY_PARTS.forEach((part, index) => {
    if (part.visible === false || !part.labelOffset) return;

    const el = document.createElement('div');
    el.className = 'label3d';
    el.dataset.partIndex = index;

    const nameSpan = document.createElement('span');
    // Display number instead of long name to reduce clutter
    nameSpan.textContent = String(index + 1);
    nameSpan.className = 'label-number';
    el.appendChild(nameSpan);

    // Drag handle icon
    const dragHandle = document.createElement('span');
    dragHandle.className = 'label-drag-handle';
    dragHandle.textContent = '⠿';
    dragHandle.title = 'Drag to move label';
    el.appendChild(dragHandle);

    // Left-click → open info popup
    nameSpan.addEventListener('click', (e) => {
      if (isDragging) return;
      e.stopPropagation();
      focusOnPart(part);
    });

    const css2dObj = new CSS2DObject(el);
    css2dObj.position.set(part.labelOffset[0], part.labelOffset[1], part.labelOffset[2]);
    scene.add(css2dObj);

    labelObjects.push({ part, css2dObj, el, index });
  });
}

// ─── Drag System ─────────────────────────────────────────────
function initDragSystem() {
  const container = document.getElementById('viewer-container');

  // Wire up Edit Mode toggle
  const toggle = document.getElementById('toggle-edit-labels');
  if (toggle) {
    toggle.addEventListener('change', () => {
      isEditMode = toggle.checked;
      document.body.classList.toggle('label-edit-mode', isEditMode);
    });
  }

  // We listen on container (capture phase) so we can intercept before OrbitControls
  container.addEventListener('mousedown', onDragStart, true);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  // Cancel fly-in animation the moment user touches the canvas (orbit or drag)
  container.addEventListener('mousedown', () => { camAnim.active = false; });
  container.addEventListener('touchstart', () => { camAnim.active = false; }, { passive: true });

  // Touch support
  container.addEventListener('touchstart', onTouchDragStart, { capture: true, passive: false });
  window.addEventListener('touchmove', onTouchDragMove, { passive: false });
  window.addEventListener('touchend', onTouchDragEnd);
}

function getEventCoords(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
  // Only allow drag when Edit Mode is on
  if (!isEditMode) return;

  const handle = e.target.closest('.label-drag-handle');
  if (!handle) return;

  e.preventDefault();
  e.stopPropagation();

  const labelEl  = handle.closest('.label3d');
  const partIdx  = parseInt(labelEl.dataset.partIndex, 10);
  const entry    = labelObjects.find(o => o.index === partIdx);
  if (!entry) return;

  isDragging = false; // will become true on first move
  const { x, y } = getEventCoords(e);
  dragState = {
    entry,
    startMouse: new THREE.Vector2(x, y),
    lastMouse:  new THREE.Vector2(x, y),
    startWorld: entry.css2dObj.position.clone(),
  };

  // Disable orbit controls while dragging
  controls.enabled = false;
  document.body.style.cursor = 'grabbing';
  labelEl.style.opacity = '0.6';
}

function onDragMove(e) {
  if (!dragState) return;

  const { x, y } = getEventCoords(e);
  const mouse = new THREE.Vector2(x, y);
  const delta = mouse.clone().sub(dragState.startMouse);

  // Only start drag after a threshold to allow clicks
  if (!isDragging && delta.length() < 4) return;
  isDragging = true;

  moveLabelByScreenDelta(delta);
}

function onDragEnd() {
  if (!dragState) return;

  if (isDragging) {
    // Persist final position back to part data
    const { entry } = dragState;
    const pos = entry.css2dObj.position;
    entry.part.labelOffset = [
      parseFloat(pos.x.toFixed(3)),
      parseFloat(pos.y.toFixed(3)),
      parseFloat(pos.z.toFixed(3))
    ];
    syncLabelManagerToEntry(entry);
  }

  dragState.entry.el.style.opacity = '';
  dragState = null;
  isDragging = false;
  controls.enabled = true;
  document.body.style.cursor = '';
}

// Touch wrappers
function onTouchDragStart(e) {
  const handle = e.target.closest('.label-drag-handle');
  if (!handle) return;
  onDragStart(e);
}
function onTouchDragMove(e) {
  if (!dragState) return;
  e.preventDefault();
  onDragMove(e);
}
function onTouchDragEnd(e) { onDragEnd(e); }

// Project screen-space delta to world-space movement on a plane perpendicular to camera
function moveLabelByScreenDelta(screenDelta) {
  if (!dragState) return;
  const { entry, startWorld } = dragState;
  const container = document.getElementById('viewer-container');
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Plane: passes through label's world pos, facing the camera
  const plane = new THREE.Plane();
  const normal = camera.position.clone().sub(startWorld).normalize();
  plane.setFromNormalAndCoplanarPoint(normal, startWorld);

  // Unproject start mouse + delta to get two world points on the plane
  const toWorld = (sx, sy) => {
    const ndc = new THREE.Vector2(
      (sx / W) * 2 - 1,
      -(sy / H) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const result = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, result);
    return result;
  };

  const origin    = toWorld(dragState.startMouse.x, dragState.startMouse.y);
  const current   = toWorld(
    dragState.startMouse.x + screenDelta.x,
    dragState.startMouse.y + screenDelta.y
  );

  if (!origin || !current) return;

  const worldDelta = current.clone().sub(origin);
  const newPos     = startWorld.clone().add(worldDelta);
  entry.css2dObj.position.copy(newPos);

  // Live-update Label Manager inputs
  syncLabelManagerToEntry(entry);
}

// ─── Sync Label Manager Inputs ────────────────────────────────
function syncLabelManagerToEntry(entry) {
  const select = document.getElementById('label-select');
  if (!select) return;
  const selectedId = parseInt(select.value, 10);
  if (selectedId !== entry.part.id) return; // Only update if this label is selected

  const pos = entry.css2dObj.position;
  const inX = document.getElementById('label-x');
  const inY = document.getElementById('label-y');
  const inZ = document.getElementById('label-z');
  if (inX) inX.value = pos.x.toFixed(3);
  if (inY) inY.value = pos.y.toFixed(3);
  if (inZ) inZ.value = pos.z.toFixed(3);
}

// ─── UI ───────────────────────────────────────────────────────
function initUI() {
  window.addEventListener('partClicked', (e) => {
    focusOnPart(e.detail);
  });

  const anatomyList = document.getElementById('anatomy-list');
  if (anatomyList) {
    anatomyList.innerHTML = '';
    KIDNEY_PARTS.forEach((part, index) => {
      if (part.visible === false) return;
      const card = document.createElement('div');
      card.className = 'part-card';
      card.innerHTML = `
        <div class="part-icon number-badge">${index + 1}</div>
        <div class="part-info">
          <h4>${partName(part)}</h4>
          <p>${partCategory(part) || 'Custom'}</p>
        </div>
      `;
      card.onclick = () => focusOnPart(part);
      anatomyList.appendChild(card);
    });
  }

  // ── Wire language toggle in viewer (re-render on change) ────────
  const langCb = document.getElementById('lang-checkbox');
  if (langCb && !langCb.dataset.mainBound) {
    langCb.dataset.mainBound = '1';
    langCb.addEventListener('change', () => {
      // Re-render 3D labels with new language
      renderLabels();
      // Refresh anatomy sidebar list
      initUI();
      const btnAR = document.getElementById('btn-toggle-ar');
      if (btnAR) btnAR.textContent = arState.active ? t('btn_ar_stop') : t('btn_ar_start');
      const btnQuickStart = document.getElementById('ar-quick-start');
      if (btnQuickStart) btnQuickStart.textContent = t('btn_ar_start');
    });
  }

  const btnSettings = document.getElementById('btn-settings');
  if (btnSettings) {
    btnSettings.onclick = () => {
      document.getElementById('right-sidebar').classList.toggle('hidden');
    };
  }

  const btnCloseSettings = document.getElementById('btn-close-settings');
  if (btnCloseSettings) {
    btnCloseSettings.onclick = () => {
      document.getElementById('right-sidebar').classList.add('hidden');
    };
  }

  const btnCloseInfo = document.getElementById('btn-close-info');
  if (btnCloseInfo) {
    btnCloseInfo.onclick = () => {
      document.getElementById('info-popup').classList.add('hidden');
      clearFocusMode(); // Restore opacities when popup is closed
    };
  }

  const btnReadMore = document.getElementById('btn-read-more');
  if (btnReadMore) {
    btnReadMore.addEventListener('click', () => {
      const popup = document.getElementById('info-popup');
      if (popup) {
        popup.classList.toggle('expanded');
        const isExpanded = popup.classList.contains('expanded');
        const textSpan = document.getElementById('read-more-text');
        if (textSpan) {
          const key = isExpanded ? 'read_less' : 'read_more';
          textSpan.setAttribute('data-i18n', key);
          textSpan.innerHTML = t(key, getCurrentLang());
        }
      }
    });
  }

  const btnResetCam = document.getElementById('btn-reset-cam');
  const btnHeaderResetCam = document.getElementById('btn-header-reset-cam');

  function resetCamera() {
    clearFocusMode(); // Restore opacities on reset
    
    // Close the info popup if it's open
    const popup = document.getElementById('info-popup');
    if (popup) popup.classList.add('hidden');

    if (activeModelGroup) {
      const box    = new THREE.Box3().setFromObject(activeModelGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Smooth reset using camAnim
      camAnim.targetPiv.copy(center);
      camAnim.targetPos.set(center.x, center.y, center.z + maxDim * 1.5);
      camAnim.active = true;
    } else {
      camAnim.targetPiv.set(0, 0, 0);
      camAnim.targetPos.set(0, 0, 8);
      camAnim.active = true;
    }
  }

  if (btnResetCam) btnResetCam.onclick = resetCamera;
  if (btnHeaderResetCam) btnHeaderResetCam.onclick = resetCamera;

  const toggleLabels = document.getElementById('toggle-labels');
  if (toggleLabels) {
    toggleLabels.addEventListener('change', (e) => {
      document.querySelectorAll('.label3d').forEach(l => {
        l.classList.toggle('hidden-label', !e.target.checked);
      });
    });
  }

  const toggleBlood = document.getElementById('toggle-blood');
  if (toggleBlood) {
    toggleBlood.addEventListener('change', (e) => {
      toggleObjectVisibilityByName('Artery', e.target.checked);
      toggleObjectVisibilityByName('Vein', e.target.checked);
    });
  }

  const toggleUrine = document.getElementById('toggle-urine');
  if (toggleUrine) {
    toggleUrine.addEventListener('change', (e) => {
      toggleObjectVisibilityByName('Urinary Collecting System', e.target.checked);
    });
  }
}

// ─── AR Camera Mode ──────────────────────────────────────────
function initARControls() {
  const btnToggle = document.getElementById('btn-toggle-ar');
  const btnQuickStart = document.getElementById('ar-quick-start');
  const scaleInput = document.getElementById('ar-scale');
  const opacityInput = document.getElementById('ar-opacity');
  const presetButtons = document.querySelectorAll('.ar-preset');

  if (!btnToggle && !btnQuickStart) return;

  const toggleAR = () => {
    if (arState.active) {
      stopARMode();
    } else {
      startARMode();
    }
  };

  if (btnToggle) btnToggle.addEventListener('click', toggleAR);
  if (btnQuickStart) btnQuickStart.addEventListener('click', startARMode);

  if (scaleInput) {
    arState.scale = parseFloat(scaleInput.value) || arState.scale;
    scaleInput.addEventListener('input', () => {
      arState.scale = parseFloat(scaleInput.value) || arState.scale;
      applyARPresentation();
      if (arState.active) applyARCameraAngle(arState.angle);
    });
  }

  if (opacityInput) {
    arState.opacity = parseFloat(opacityInput.value) || arState.opacity;
    opacityInput.addEventListener('input', () => {
      arState.opacity = parseFloat(opacityInput.value) || arState.opacity;
      applyARPresentation();
    });
  }

  presetButtons.forEach((button) => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => {
      setARAngle(button.dataset.arAngle || 'front');
    });
  });
}

function initARLaunchMode() {
  const params = new URLSearchParams(window.location.search);
  arState.launchRequested = params.get('mode') === 'ar' || params.has('ar');
  if (arState.launchRequested) prepareARLaunch();
}

function prepareARLaunch() {
  const btnQuickStart = document.getElementById('ar-quick-start');
  if (btnQuickStart && !arState.active) {
    btnQuickStart.classList.remove('hidden');
    btnQuickStart.textContent = t('btn_ar_start');
  }

  const rightSidebar = document.getElementById('right-sidebar');
  if (rightSidebar && window.innerWidth > 768) rightSidebar.classList.remove('hidden');

  if (!arState.active) showARStatus(t('ar_launch_hint'));
  setARAngle(arState.angle);
}

async function startARMode() {
  const video = document.getElementById('ar-camera-feed');
  const btnToggle = document.getElementById('btn-toggle-ar');
  const btnQuickStart = document.getElementById('ar-quick-start');
  if (!video || arState.active) return;

  if (!window.isSecureContext) {
    showARStatus(t('ar_requires_https'));
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showARStatus(t('ar_camera_unsupported'));
    return;
  }

  if (btnToggle) {
    btnToggle.disabled = true;
    btnToggle.textContent = t('ar_starting');
  }
  if (btnQuickStart) {
    btnQuickStart.disabled = true;
    btnQuickStart.textContent = t('ar_starting');
  }

  try {
    const hasMotionAccess = await requestDeviceMotionAccess();
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    arState.stream = stream;
    arState.active = true;
    video.srcObject = stream;
    await video.play();

    document.body.classList.add('ar-mode');
    scene.background = null;
    scene.fog = null;
    renderer.setClearAlpha(0);
    applyARPresentation();
    applyARCameraAngle(arState.angle);
    if (btnQuickStart) btnQuickStart.classList.add('hidden');

    if (hasMotionAccess) {
      enableAROrientation();
      showARStatus(t('ar_motion_active'));
    } else {
      showARStatus(t('ar_motion_unavailable'));
    }
  } catch (err) {
    console.error('Unable to start AR camera mode', err);
    showARStatus(t('ar_camera_error'));
    stopARStream();
  } finally {
    if (btnToggle) {
      btnToggle.disabled = false;
      btnToggle.textContent = arState.active ? t('btn_ar_stop') : t('btn_ar_start');
    }
    if (btnQuickStart) {
      btnQuickStart.disabled = false;
      btnQuickStart.textContent = t('btn_ar_start');
      btnQuickStart.classList.toggle('hidden', arState.active || !arState.launchRequested);
    }
  }
}

function stopARMode() {
  stopARStream();
  disableAROrientation();
  arState.active = false;
  document.body.classList.remove('ar-mode');
  scene.background = defaultSceneBackground ? defaultSceneBackground.clone() : null;
  scene.fog = defaultSceneFog ? defaultSceneFog.clone() : null;
  renderer.setClearAlpha(1);

  if (activeModelGroup) activeModelGroup.scale.setScalar(1);
  clearFocusMode();

  const btnToggle = document.getElementById('btn-toggle-ar');
  if (btnToggle) btnToggle.textContent = t('btn_ar_start');
  const btnQuickStart = document.getElementById('ar-quick-start');
  if (btnQuickStart) btnQuickStart.classList.toggle('hidden', !arState.launchRequested);
  showARStatus('');
}

function stopARStream() {
  if (arState.stream) {
    arState.stream.getTracks().forEach(track => track.stop());
    arState.stream = null;
  }

  const video = document.getElementById('ar-camera-feed');
  if (video) video.srcObject = null;
}

function setARAngle(angle) {
  arState.angle = angle;
  document.querySelectorAll('.ar-preset').forEach((button) => {
    const isActive = button.dataset.arAngle === angle;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  applyARCameraAngle(angle);
}

function applyARCameraAngle(angle) {
  if (!activeModelGroup) return;

  const box = new THREE.Box3().setFromObject(activeModelGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1);
  const distance = Math.max(maxDim * 1.25, 4);

  arState.target.copy(center);
  arState.radius = distance;

  camAnim.targetPiv.copy(center);
  if (arState.active && arState.orientationEnabled) {
    updateAROrientationCamera();
    return;
  }

  if (angle === 'top') {
    camAnim.targetPos.set(center.x, center.y + distance, center.z + distance * 0.15);
  } else if (angle === 'side') {
    camAnim.targetPos.set(center.x + distance, center.y + distance * 0.12, center.z);
  } else {
    camAnim.targetPos.set(center.x, center.y, center.z + distance);
  }
  camAnim.active = true;
}

function applyARPresentation() {
  if (!activeModelGroup) return;

  activeModelGroup.scale.setScalar(arState.active ? arState.scale : 1);
  activeModelGroup.traverse((mesh) => {
    if (!mesh.isMesh || !mesh.material) return;
    const parentPart = MODEL_DEFS.find(def => {
      let node = mesh;
      while (node) {
        if (node.name === def.name) return true;
        node = node.parent;
      }
      return false;
    });
    const baseOpacity = parentPart ? parentPart.opacity : 1;
    mesh.material.opacity = arState.active ? Math.min(baseOpacity, arState.opacity) : baseOpacity;
    mesh.material.transparent = mesh.material.opacity < 1.0;
    mesh.material.needsUpdate = true;
  });
}

async function requestDeviceMotionAccess() {
  if (typeof DeviceOrientationEvent === 'undefined') return false;

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      return result === 'granted';
    } catch (err) {
      console.warn('Device orientation permission rejected', err);
      return false;
    }
  }

  return true;
}

function enableAROrientation() {
  if (arState.orientationEnabled) return;
  arState.orientationEnabled = true;
  arState.baseAlpha = null;
  arState.baseBeta = null;
  arState.baseGamma = null;
  arState.yaw = 0;
  arState.pitch = 0;
  controls.enabled = false;
  camAnim.active = false;
  window.addEventListener('deviceorientation', onDeviceOrientation, true);
}

function disableAROrientation() {
  if (!arState.orientationEnabled) return;
  arState.orientationEnabled = false;
  window.removeEventListener('deviceorientation', onDeviceOrientation, true);
  controls.enabled = true;
}

function onDeviceOrientation(event) {
  if (!arState.active || !arState.orientationEnabled) return;
  const alpha = event.alpha ?? 0;
  const beta = event.beta ?? 0;
  const gamma = event.gamma ?? 0;

  if (arState.baseAlpha === null) {
    arState.baseAlpha = alpha;
    arState.baseBeta = beta;
    arState.baseGamma = gamma;
  }

  const yawDeg = shortestAngleDelta(alpha, arState.baseAlpha) + (gamma - arState.baseGamma) * 0.35;
  const pitchDeg = beta - arState.baseBeta;
  arState.yaw = THREE.MathUtils.degToRad(yawDeg);
  arState.pitch = THREE.MathUtils.clamp(THREE.MathUtils.degToRad(pitchDeg), -1.05, 1.05);
}

function shortestAngleDelta(current, base) {
  return ((current - base + 540) % 360) - 180;
}

function updateAROrientationCamera() {
  if (!activeModelGroup) return;
  const target = arState.target;
  const radius = arState.radius;
  const cosPitch = Math.cos(arState.pitch);

  camera.position.set(
    target.x + Math.sin(arState.yaw) * cosPitch * radius,
    target.y + Math.sin(arState.pitch) * radius,
    target.z + Math.cos(arState.yaw) * cosPitch * radius
  );
  camera.lookAt(target);
}

function showARStatus(message) {
  const status = document.getElementById('ar-status');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('hidden', !message);
}

// ─── Label Manager ────────────────────────────────────────────
function initLabelManager() {
  const select    = document.getElementById('label-select');
  const inName    = document.getElementById('label-name');
  const inVisible = document.getElementById('label-visible');
  const inX       = document.getElementById('label-x');
  const inY       = document.getElementById('label-y');
  const inZ       = document.getElementById('label-z');
  const btnDelete = document.getElementById('btn-delete-label');
  const btnAdd    = document.getElementById('btn-add-label');
  const btnSave   = document.getElementById('btn-save-conf');

  if (!select) return;

  function updateSelect() {
    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Select Label to Edit --</option>';
    KIDNEY_PARTS.forEach(part => {
      const opt = document.createElement('option');
      opt.value = part.id;
      opt.textContent = part.name;
      select.appendChild(opt);
    });
    select.value = currentVal;
  }
  updateSelect();

  select.onchange = () => {
    const part = KIDNEY_PARTS.find(p => p.id == select.value);
    if (part) {
      inName.disabled    = false;
      inX.disabled       = false;
      inY.disabled       = false;
      inZ.disabled       = false;
      btnDelete.disabled = false;
      inVisible.disabled = false;

      inName.value    = part.name;
      inVisible.checked = part.visible !== false;
      inX.value = part.labelOffset ? part.labelOffset[0] : 0;
      inY.value = part.labelOffset ? part.labelOffset[1] : 0;
      inZ.value = part.labelOffset ? part.labelOffset[2] : 0;
    } else {
      inName.disabled    = true;
      inX.disabled       = true;
      inY.disabled       = true;
      inZ.disabled       = true;
      btnDelete.disabled = true;
      inVisible.disabled = true;
      inName.value = ''; inX.value = ''; inY.value = ''; inZ.value = '';
      inVisible.checked = false;
    }
  };

  function updatePartFromInputs() {
    const part = KIDNEY_PARTS.find(p => p.id == select.value);
    if (!part) return;

    part.name    = inName.value;
    part.visible = inVisible.checked;
    part.labelOffset = [
      parseFloat(inX.value) || 0,
      parseFloat(inY.value) || 0,
      parseFloat(inZ.value) || 0
    ];

    // Live-update the CSS2DObject position without full re-render
    const entry = labelObjects.find(o => o.part === part);
    if (entry) {
      entry.css2dObj.position.set(part.labelOffset[0], part.labelOffset[1], part.labelOffset[2]);
    } else {
      renderLabels();
    }
    initUI(); // refresh left sidebar name if changed
    const currentVal = select.value;
    updateSelect();
    select.value = currentVal;
  }

  inName.oninput    = updatePartFromInputs;
  inVisible.onchange = updatePartFromInputs;
  inX.oninput       = updatePartFromInputs;
  inY.oninput       = updatePartFromInputs;
  inZ.oninput       = updatePartFromInputs;

  btnAdd.onclick = () => {
    const newId = Date.now();
    KIDNEY_PARTS.push({
      id: newId,
      name: 'New Label',
      category: 'Custom',
      color: '#ffffff',
      icon: '📌',
      description: 'Custom label.',
      facts: [],
      cameraTarget: [0, 0, 0],
      labelOffset: [0, 0, 0],
      visible: true
    });
    updateSelect();
    select.value = newId;
    select.onchange();
    renderLabels();
    initUI();
  };

  btnDelete.onclick = () => {
    if (confirm('Delete this label?')) {
      KIDNEY_PARTS = KIDNEY_PARTS.filter(p => p.id != select.value);
      select.value = '';
      select.onchange();
      updateSelect();
      renderLabels();
      initUI();
    }
  };

  btnSave.onclick = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(KIDNEY_PARTS, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'conf.json';
    a.click();
    alert('conf.json downloaded! Replace the existing conf.json in your project folder to save these positions permanently.');
  };
}

// ─── Model Position Editor ────────────────────────────────────
function initModelPositionEditor() {
  const select  = document.getElementById('model-select');
  const inX     = document.getElementById('model-pos-x');
  const inY     = document.getElementById('model-pos-y');
  const inZ     = document.getElementById('model-pos-z');
  const btnReset = document.getElementById('btn-reset-model-pos');
  const btnLog  = document.getElementById('btn-log-model-pos');

  if (!select) return;

  // Populate dropdown from MODEL_DEFS (available before models load)
  MODEL_DEFS.forEach((def, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = def.name;
    select.appendChild(opt);
  });

  function getSelectedMesh() {
    const idx = parseInt(select.value);
    if (isNaN(idx) || !activeModelGroup) return null;
    return activeModelGroup.children.find(c => c.name === MODEL_DEFS[idx].name) || null;
  }

  select.onchange = () => {
    const idx = parseInt(select.value);
    const hasSelection = !isNaN(idx);
    inX.disabled = inY.disabled = inZ.disabled = btnReset.disabled = !hasSelection;
    if (!hasSelection) { inX.value = inY.value = inZ.value = ''; return; }

    const mesh = getSelectedMesh();
    if (mesh) {
      inX.value = mesh.position.x.toFixed(3);
      inY.value = mesh.position.y.toFixed(3);
      inZ.value = mesh.position.z.toFixed(3);
    } else {
      const off = MODEL_DEFS[idx].offset;
      inX.value = off[0]; inY.value = off[1]; inZ.value = off[2];
    }
  };

  function applyPosition() {
    const idx = parseInt(select.value);
    if (isNaN(idx)) return;
    const x = parseFloat(inX.value) || 0;
    const y = parseFloat(inY.value) || 0;
    const z = parseFloat(inZ.value) || 0;
    const mesh = getSelectedMesh();
    if (mesh) {
      mesh.position.set(x, y, z);
      MODEL_DEFS[idx].offset = [x, y, z];
    }
  }

  inX.oninput = inY.oninput = inZ.oninput = applyPosition;

  btnReset.onclick = () => {
    const idx = parseInt(select.value);
    if (isNaN(idx)) return;
    const mesh = getSelectedMesh();
    if (mesh) {
      mesh.position.set(0, 0, 0);
      MODEL_DEFS[idx].offset = [0, 0, 0];
      inX.value = '0'; inY.value = '0'; inZ.value = '0';
    }
  };

  btnLog.onclick = () => {
    if (!activeModelGroup) { console.log('Models not loaded yet'); return; }
    const positions = MODEL_DEFS.map((def) => {
      const mesh = activeModelGroup.children.find(c => c.name === def.name);
      return mesh
        ? { name: def.name, offset: [+mesh.position.x.toFixed(3), +mesh.position.y.toFixed(3), +mesh.position.z.toFixed(3)] }
        : { name: def.name, offset: def.offset };
    });
    console.log('Current model offsets (paste into MODEL_DEFS):\n', JSON.stringify(positions, null, 2));
    alert('Model positions logged to browser console (F12 → Console).');
  };
}

// Called after models load to sync inputs if a model was already selected
function syncModelPositionEditor() {
  const select = document.getElementById('model-select');
  if (!select || select.value === '') return;
  select.onchange();
}

// ─── Filter list ──────────────────────────────────────────────
function populateFilterList(modelGroup) {
  const filterList = document.getElementById('filter-objects-list');
  if (!filterList) return;
  filterList.innerHTML = '';

  MODEL_DEFS.forEach((def) => {
    // Find by name — async loading means children[] order is not guaranteed
    const mesh = modelGroup.children.find(c => c.name === def.name);

    const label    = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = mesh ? mesh.visible : true;
    checkbox.onchange = (e) => { if (mesh) mesh.visible = e.target.checked; };

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + def.name));
    filterList.appendChild(label);
  });
}

function toggleObjectVisibilityByName(name, isVisible) {
  if (!activeModelGroup) return;
  activeModelGroup.children.forEach(child => {
    if (child.name === name) {
      child.visible = isVisible;
      const filterList = document.getElementById('filter-objects-list');
      if (filterList) {
        filterList.querySelectorAll('label').forEach(lbl => {
          if (lbl.textContent.trim().includes(name)) {
            const cb = lbl.querySelector('input');
            if (cb) cb.checked = isVisible;
          }
        });
      }
    }
  });
}

// ─── Preview Image Map ────────────────────────────────────────────────
// Maps part.id (0–6) to the corresponding image in the preview/ folder
const PREVIEW_IMAGES = {
  0: 'preview/Urinary Collecting System.png',
  1: 'preview/kidney.png',
  2: 'preview/Human Body.png',
  3: 'preview/Skeletal System.png',
  4: 'preview/Vein.png',
  5: 'preview/Artery.png',
  6: 'preview/Skeletal.png',
};

function showPreviewImage(partId) {
  const img = document.getElementById('preview-img');
  if (!img) return;

  const src = PREVIEW_IMAGES[partId];
  if (!src) {
    img.src = '';
    img.style.display = 'none';
    return;
  }

  img.style.display = 'block';
  img.style.opacity = '0';
  img.src = src;
  img.onload = () => {
    img.style.opacity = '1';
  };
}


// ─── Focus / Info Popup ──────────────────────────────────────────────
function focusOnPart(part) {
  // Show image preview for the corresponding part
  showPreviewImage(part.id);

  const titleEl = document.getElementById('info-title');
  if (titleEl) titleEl.textContent = partName(part);

  const subEl   = document.getElementById('info-subtitle');
  if (subEl)   subEl.textContent = partCategory(part);

  const descEl  = document.getElementById('info-desc');
  if (descEl)  descEl.textContent = partDesc(part);

  const factsList = document.getElementById('info-facts');
  if (factsList) {
    const facts = partFacts(part);
    factsList.innerHTML = facts.length
      ? facts.map(f => `<li>${f}</li>`).join('')
      : '';
  }

  const popup = document.getElementById('info-popup');
  if (popup) {
    popup.classList.remove('hidden');
    popup.classList.remove('expanded'); // Reset expansion state
    const textSpan = document.getElementById('read-more-text');
    if (textSpan) {
      textSpan.setAttribute('data-i18n', 'read_more');
      textSpan.innerHTML = t('read_more', getCurrentLang());
    }
  }

  if (activeModelGroup) {
    // Dim all models except the focused one
    activeModelGroup.children.forEach(child => {
      let isTarget = (child.name === part.name);
      
      child.traverse(mesh => {
        if (!mesh.isMesh || !mesh.material) return;
        if (isTarget) {
          // Highlight focused part
          const def = MODEL_DEFS.find(d => d.name === child.name);
          if (def) {
            mesh.material.opacity = def.opacity;
            mesh.material.transparent = def.opacity < 1.0;
          }
        } else {
          // Dim other parts
          mesh.material.transparent = true;
          mesh.material.opacity = 0.1; // Low opacity for spotlight effect
        }
        mesh.material.needsUpdate = true;
      });
    });

    // Automatically find the actual 3D mesh for this part
    const mesh = activeModelGroup.children.find(c => c.name === part.name);
    if (mesh) {
      // Calculate exact center of the 3D model
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate how far camera should be based on object size
      const maxDim = Math.max(size.x, size.y, size.z);
      // Small objects need closer zoom, large objects need further zoom
      const distance = Math.max(maxDim * 1.5, 3); 

      // Kick off smooth camera fly-in
      camAnim.targetPiv.copy(center);
      camAnim.targetPos.set(center.x, center.y, center.z + distance);
      camAnim.active = true;
    } else if (part.cameraTarget && part.cameraTarget.length === 3) {
      // Fallback to conf.json if mesh not found
      const [tx, ty, tz] = part.cameraTarget;
      camAnim.targetPiv.set(tx, ty, tz);
      camAnim.targetPos.set(tx, ty, tz + 4);
      camAnim.active = true;
    }
  }
}

// ─── Focus Utilities ──────────────────────────────────────────
function clearFocusMode() {
  if (!activeModelGroup) return;
  activeModelGroup.children.forEach(child => {
    const def = MODEL_DEFS.find(d => d.name === child.name);
    if (def) {
      child.traverse(mesh => {
        if (!mesh.isMesh || !mesh.material) return;
        mesh.material.opacity = arState.active ? Math.min(def.opacity, arState.opacity) : def.opacity;
        mesh.material.transparent = mesh.material.opacity < 1.0;
        mesh.material.needsUpdate = true;
      });
    }
  });
}

// ─── Camera Overlay ───────────────────────────────────────────
function updateCameraOverlay() {
  const cx = document.getElementById('cam-x');
  const cy = document.getElementById('cam-y');
  const cz = document.getElementById('cam-z');
  if (cx && cy && cz) {
    cx.textContent = camera.position.x.toFixed(2);
    cy.textContent = camera.position.y.toFixed(2);
    cz.textContent = camera.position.z.toFixed(2);
  }
}

// ─── Animate ─────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  if (arState.active && arState.orientationEnabled) {
    updateAROrientationCamera();
  }

  // Smooth camera fly-in (lerp toward camAnim targets)
  if (camAnim.active && !(arState.active && arState.orientationEnabled)) {
    camera.position.lerp(camAnim.targetPos, camAnim.speed);
    controls.target.lerp(camAnim.targetPiv, camAnim.speed);

    // Stop animating once we're close enough
    if (
      camera.position.distanceTo(camAnim.targetPos) < 0.01 &&
      controls.target.distanceTo(camAnim.targetPiv) < 0.01
    ) {
      camera.position.copy(camAnim.targetPos);
      controls.target.copy(camAnim.targetPiv);
      camAnim.active = false;
    }
  }

  if (!(arState.active && arState.orientationEnabled)) controls.update();
  updateCameraOverlay();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// Start
fetchConfig();

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { createScene } from './src/scene/scene.js';
import { createCamera } from './src/scene/camera.js';
import { createRenderers } from './src/scene/renderer.js';
import { setupLighting } from './src/scene/lights.js';
import { loadKidneyModels, MODEL_DEFS } from './src/models/kidney.js';

let scene, camera, renderer, labelRenderer, controls;
let activeModelGroup = null;
let KIDNEY_PARTS = [];
let labelObjects = []; // { part, css2dObj, el }

// ─── Edit / Drag State ───────────────────────────────────────
let isEditMode = false;   // controlled by the toggle in the sidebar
let dragState  = null;
let isDragging = false;

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

  const progressBar  = document.getElementById('progress-bar');
  const loadingText  = document.getElementById('loading-text');

  loadKidneyModels(
    scene,
    (progress) => {
      const percent = Math.round(progress * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (loadingText) loadingText.textContent = `Loading Anatomical Models... ${percent}%`;
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
    nameSpan.textContent = part.name;
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
    KIDNEY_PARTS.forEach(part => {
      if (part.visible === false) return;
      const card = document.createElement('div');
      card.className = 'part-card';
      card.innerHTML = `
        <div class="part-icon">${part.icon || '📌'}</div>
        <div class="part-info">
          <h4>${part.name}</h4>
          <p>${part.category || 'Custom'}</p>
        </div>
      `;
      card.onclick = () => focusOnPart(part);
      anatomyList.appendChild(card);
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
    };
  }

  const btnResetCam = document.getElementById('btn-reset-cam');
  if (btnResetCam) {
    btnResetCam.onclick = () => {
      if (activeModelGroup) {
        const box    = new THREE.Box3().setFromObject(activeModelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.set(center.x, center.y, center.z + maxDim * 1.5);
        controls.target.copy(center);
      } else {
        camera.position.set(0, 0, 8);
        controls.target.set(0, 0, 0);
      }
    };
  }

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

  MODEL_DEFS.forEach((def, index) => {
    const mesh = modelGroup.children[index];
    if (mesh) mesh.name = def.name;

    const label    = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = true;
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
  if (titleEl) titleEl.textContent = part.name;

  const subEl   = document.getElementById('info-subtitle');
  if (subEl)   subEl.textContent = part.category || '';

  const descEl  = document.getElementById('info-desc');
  if (descEl)  descEl.textContent = part.description || '';

  const factsList = document.getElementById('info-facts');
  if (factsList) {
    factsList.innerHTML = part.facts
      ? part.facts.map(f => `<li>${f}</li>`).join('')
      : '';
  }

  const popup = document.getElementById('info-popup');
  if (popup) popup.classList.remove('hidden');

  if (part.cameraTarget && part.cameraTarget.length === 3) {
    camera.position.set(
      part.cameraTarget[0],
      part.cameraTarget[1],
      part.cameraTarget[2] + 4
    );
    controls.target.set(
      part.cameraTarget[0],
      part.cameraTarget[1],
      part.cameraTarget[2]
    );
  }
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
  controls.update();
  updateCameraOverlay();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// Start
fetchConfig();
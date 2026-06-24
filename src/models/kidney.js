import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { CONFIG } from '../utils/config.js';

// Mapping the available OBJs to our new medical theme materials
// offset: [x, y, z] applied in the group's local space (after Z-up→Y-up rotation)
export const MODEL_DEFS = [
  { file: 'model_0.obj', color: 0xf0e68c, opacity: 0.4,  name: 'Skeletal',                 offset: [0, 0, 0] },
  { file: 'model_1.obj', color: 0xe9c46a, opacity: 0.7,  name: 'Skeletal System',           offset: [0, 0, 0] },
  { file: 'model_2.obj', color: 0x4361ee, opacity: 1.0,  name: 'Vein',                      offset: [0, 0, 0] },
  { file: 'model_3.obj', color: 0xff4d6d, opacity: 0.85, name: 'Urinary Collecting System', offset: [0, 0, 0] },
  { file: 'model_4.obj', color: 0xff6b6b, opacity: 0.85, name: 'Kidney',                    offset: [0, 0, 0] },
  { file: 'model_5.obj', color: 0xc9184a, opacity: 1.0,  name: 'Artery',                    offset: [0, 0, 0] },
  { file: 'model_6.obj', color: 0xf4a261, opacity: 0.35, name: 'Human Body',                offset: [0, 0, 0] },
];

export function loadKidneyModels(scene, onProgress, onComplete) {
  const loader = new OBJLoader();
  let loadedCount = 0;
  const group = new THREE.Group();
  
  // Fix orientation: convert Z-up (from export) to Y-up (Three.js standard)
  // This makes the model stand upright and fixes the Spin/Orbit axes
  group.rotation.x = -Math.PI / 2;
  
  scene.add(group);

  MODEL_DEFS.forEach((def) => {
    // MeshStandardMaterial: good quality, ~2-3x faster than MeshPhysicalMaterial
    const needsTransparency = def.opacity < 1.0;
    const material = new THREE.MeshStandardMaterial({
      color:       def.color,
      roughness:   0.4,
      metalness:   0.05,
      transparent: needsTransparency,
      opacity:     def.opacity,
      // DoubleSide only for transparent/skeletal meshes where back-faces are visible
      side: needsTransparency ? THREE.DoubleSide : THREE.FrontSide,
      depthWrite: !needsTransparency,  // Improves transparency sort performance
    });

    loader.load(
      `Kidney3d/${def.file}`,
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
            child.frustumCulled = true;
          }
        });

        // Name the object and apply per-model offset.
        // Do NOT center individually — preserve the original relative positions
        // so all parts stay in their correct anatomical arrangement.
        obj.name = def.name;
        obj.position.set(def.offset[0], def.offset[1], def.offset[2]);

        group.add(obj);
        loadedCount++;
        
        if (onProgress) onProgress(loadedCount / MODEL_DEFS.length);
        
        if (loadedCount === MODEL_DEFS.length) {
          if (onComplete) onComplete(group);
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading ${def.file}:`, error);
        // Ensure progress completes even if one fails
        loadedCount++;
        if (loadedCount === MODEL_DEFS.length && onComplete) onComplete(group);
      }
    );
  });
}

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { CONFIG } from '../utils/config.js';

// Mapping the available OBJs to our new medical theme materials
export const MODEL_DEFS = [
  { file: 'model_0.obj', color: CONFIG.theme.blood, opacity: 0.85, name: 'Urinary Collecting System' },
  { file: 'model_1.obj', color: CONFIG.theme.venous, opacity: 0.85, name: 'Kidney' },
  { file: 'model_2.obj', color: CONFIG.theme.tubules, opacity: 0.9, name: 'Human Body' },
  { file: 'model_3.obj', color: CONFIG.theme.urine, opacity: 0.7, name: 'Skeletal System' },
  { file: 'model_4.obj', color: 0xff8fa3, opacity: 1.0, name: 'Vein' },
  { file: 'model_5.obj', color: 0xc9184a, opacity: 1.0, name: 'Artery' },
  { file: 'model_6.obj', color: 0xffd166, opacity: 0.4, name: 'Skeletal' }
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
            child.frustumCulled = true; // Skip off-screen meshes
          }
        });
        
        // Center the geometry roughly based on bounding box
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        obj.position.sub(center); // Recenter the part

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

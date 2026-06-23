import * as THREE from 'three';
import { CONFIG } from '../utils/config.js';

export function createCamera(container) {
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    aspect,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  
  camera.position.set(...CONFIG.camera.defaultPosition);
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  return camera;
}

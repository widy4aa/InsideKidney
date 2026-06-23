import * as THREE from 'three';
import { CONFIG } from '../utils/config.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CONFIG.theme.background);
  
  // Optional: Add some ambient floating particles or subtle fog here
  scene.fog = new THREE.FogExp2(CONFIG.theme.background, 0.02);

  return scene;
}

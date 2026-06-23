import * as THREE from 'three';

export function setupLighting(scene) {
  // Ambient: base fill
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambientLight);

  // Key light: main directional (no shadows)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(5, 10, 7);
  scene.add(keyLight);

  // Cyan accent: holographic feel (DirectionalLight is cheaper than PointLight)
  const accentLight = new THREE.DirectionalLight(0x00e5ff, 0.6);
  accentLight.position.set(-4, 2, -3);
  scene.add(accentLight);

  // Warm back-light for depth
  const fillLight = new THREE.DirectionalLight(0xff4d6d, 0.3);
  fillLight.position.set(3, -4, -5);
  scene.add(fillLight);

  return { ambientLight, keyLight };
}

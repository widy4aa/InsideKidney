import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export function createLabels(scene, partsData) {
  partsData.forEach(part => {
    // Only create labels for parts that have an offset defined
    if (!part.labelOffset) return;

    const el = document.createElement('div');
    el.className = 'label3d';
    el.textContent = part.name;
    
    // Optional: click to trigger UI Focus (could dispatch a custom event)
    el.onclick = () => {
      // Very basic event dispatch to let main.js know
      window.dispatchEvent(new CustomEvent('partClicked', { detail: part }));
    };

    const labelObj = new CSS2DObject(el);
    labelObj.position.set(part.labelOffset[0], part.labelOffset[1], part.labelOffset[2]);
    
    scene.add(labelObj);
  });
}

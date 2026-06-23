// Application-wide configuration

export const CONFIG = {
  theme: {
    background: 0x050816, // Medical dark blue/black
    accent: 0x00e5ff,     // Cyan holographic glow
    blood: 0xff4d6d,      // Arterial blood red
    venous: 0x00b4d8,     // Venous blood blue
    tubules: 0x9d4edd,    // Nephron tubules purple
    urine: 0xffd166       // Filtrate/Urine yellow
  },
  performance: {
    // These will be overridden by runtime device detection
    maxPixelRatio: 1,         // Cap at 1x — biggest single FPS win
    usePostProcessing: false,
    useShadows: false,        // Shadows cost too much for organic meshes
    useEnvironment: false,    // PMREM env map is heavy; accent lights are enough
    enableLabelOcclusion: false,
  },
  camera: {
    defaultPosition: [0, 0, 8],
    defaultTarget: [0, 0, 0],
    fov: 45,
    near: 0.1,
    far: 1000,
    animationDuration: 1200 // ms
  },
  labels: {
    fallbackAnchor: [0.15, 0.35, 0.15],
    showGuideLines: false,
    guideLineColor: 0x00e5ff,
    labelEditable: 0
  },
  simulation: {
    baseSpeed: 1.0,
    bloodFlowEnabled: true,
    filtrationEnabled: true
  }
};

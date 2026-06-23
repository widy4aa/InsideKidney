export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// Ease out cubic
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Check if device is likely a mobile/touch device
export function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

// Generate procedural noise (adapted from original bacteria procedural textures)
export function smoothNoise(x, y) {
  const fractX = x - Math.floor(x);
  const fractY = y - Math.floor(y);
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  const v1 = hash2D(ix, iy);
  const v2 = hash2D(ix + 1, iy);
  const v3 = hash2D(ix, iy + 1);
  const v4 = hash2D(ix + 1, iy + 1);

  const sx = fractX * fractX * (3 - 2 * fractX);
  const sy = fractY * fractY * (3 - 2 * fractY);

  const i1 = v1 * (1 - sx) + v2 * sx;
  const i2 = v3 * (1 - sx) + v4 * sx;

  return i1 * (1 - sy) + i2 * sy;
}

function hash2D(x, y) {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

export function fbm(x, y, octaves = 5) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return val;
}

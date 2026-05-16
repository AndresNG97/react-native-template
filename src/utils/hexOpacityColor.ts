export function hexOpacityColor(color: string, opacity: number) {
  let r = '0x',
    g = '0x',
    b = '0x';

  // 3 digits
  if (color.length === 4) {
    r = '0x' + color[1] + color[1];
    g = '0x' + color[2] + color[2];
    b = '0x' + color[3] + color[3];

    // 6 digits
  } else if (color.length === 7) {
    r = '0x' + color[1] + color[2];
    g = '0x' + color[3] + color[4];
    b = '0x' + color[5] + color[6];
  }

  return `rgba(${+r},${+g},${+b},${opacity})`;
}

export function hexToneColor(
  color: string,
  type: 'dark' | 'light',
  intensity: number,
) {
  let r = 0,
    g = 0,
    b = 0;

  if (color.length === 4) {
    r = parseInt(color[1] + color[1], 16);
    g = parseInt(color[2] + color[2], 16);
    b = parseInt(color[3] + color[3], 16);
  } else if (color.length === 7) {
    r = parseInt(color[1] + color[2], 16);
    g = parseInt(color[3] + color[4], 16);
    b = parseInt(color[5] + color[6], 16);
  }

  // Curva exponencial: suave al inicio, más agresiva al final
  const factor = Math.pow(intensity, 1.5) / Math.pow(100, 0.5);

  if (type === 'dark') {
    r = Math.round(r * (1 - factor / 100));
    g = Math.round(g * (1 - factor / 100));
    b = Math.round(b * (1 - factor / 100));
  } else {
    r = Math.round(r + (255 - r) * (factor / 100));
    g = Math.round(g + (255 - g) * (factor / 100));
    b = Math.round(b + (255 - b) * (factor / 100));
  }

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

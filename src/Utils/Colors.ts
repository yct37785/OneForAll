export const rgba32ToRgbaCss = (rgba: number): string => {
  const v = rgba >>> 0;
  const r = (v >>> 24) & 255;
  const g = (v >>> 16) & 255;
  const b = (v >>> 8) & 255;
  const a = (v & 255) / 255;
  return `rgba(${r},${g},${b},${a})`;
};

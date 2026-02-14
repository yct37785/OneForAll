export const APP_BAR_H = 64;
export const SPACE_UNIT = 8;

/**
 * Shorthand spacing helper
 */
export const s = (multiplier: number): number => {
  return SPACE_UNIT * multiplier;
};

/**
 * Style values
 */
export const TOUCHABLE_DEFAULTS = {
  // iOS pressed opacity
  pressedOpacityLight: 0.6,
  pressedOpacityDark: 0.75,
  // Android ripple
  rippleColorLight: 'rgba(0,0,0,0.10)',
  rippleColorDark: 'rgba(255,255,255,0.14)',
  rippleBorderless: false,
} as const;

export const X_BTN_ICON_S = 2.5;
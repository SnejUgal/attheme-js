import Attheme from ".";
import { Color, ColorSignature } from "./types";

/**
 * Serializes the color.
 * @param color The color to serialize.
 * @param colorSignature The way the color should be encoded, "hex" for
 * #aarrggbb and "int" for Java int color.
 * @returns The serialized color.
 */
const serializeColor = (
  color: Color,
  colorSignature: ColorSignature,
): string => {
  const red = color.red.toString(16).padStart(2, `0`);
  const green = color.green.toString(16).padStart(2, `0`);
  const blue = color.blue.toString(16).padStart(2, `0`);
  const alpha = color.alpha.toString(16).padStart(2, `0`);
  const hex = `${alpha}${red}${green}${blue}`;

  if (colorSignature === `hex`) {
    return `#${hex}`;
  }

  return String(Number.parseInt(hex, 16) << 0);
};

/**
 * Serializes the theme.
 * @param theme The theme to serialize.
 * @param colorSignature The way the colors should be encoded, "hex" for
 * #aarrggbb and "int" for Java int color.
 * @returns The serialized theme.
 */
const serializeTheme = (
  theme: Attheme,
  colorSignature: ColorSignature = `int`,
): string => {
  let result = ``;

  for (const [variable, color] of theme) {
    const hex = serializeColor(color, colorSignature);

    result += `${variable}=${hex}\n`;
  }

  if (theme.hasWallpaper()) {
    result += `\nWPS\n${theme.getWallpaper()}\nWPE\n`;
  }

  return result;
};

export default serializeTheme;

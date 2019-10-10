import { Theme, Color, VariableIterator, ColorSignature } from "./types";
import parseContents from "./parseContents";
import serializeTheme from "./serializeTheme";

export default class Attheme {
  private _variables: Theme = new Map();
  private _wallpaper?: string | null;

  /**
   * Constructs a new theme.
   * @param contents The .attheme contents to parse.
   * @throws {TypeError} If any of the provided arguments is of a wrong type.
   */
  constructor(contents?: string | VariableIterator | null) {
    if (typeof contents === `string`) {
      const { variables, wallpaper } = parseContents(contents);

      this._variables = variables;
      this._wallpaper = wallpaper;
    } else if (contents) {
      this._variables = new Map();

      const iterator = contents[Symbol.iterator]();

      while (true) {
        const result = iterator.next();

        if (result.done) {
          break;
        } else {
          const [variable, color] = result.value;
          this._variables.set(variable, { ...color });
        }
      }
    }
  }

  /**
   * Gets the theme's wallpaper.
   * @returns The theme's wallpaper.
   */
  getWallpaper() {
    return this._wallpaper ? this._wallpaper : null;
  }

  /**
   * Sets the new wallpaper.
   * @param newWallpaper The new wallpaper.
   */
  setWallpaper(newWallpaper: string) {
    this._wallpaper = newWallpaper;
  }

  /**
   * Checks whether the theme has a wallpaper.
   * @returns Whether the theme has a wallpaper.
   */
  hasWallpaper() {
    return typeof this._wallpaper === `string`;
  }

  /**
   * Deletes the wallpaper.
   */
  deleteWallpaper() {
    delete this._wallpaper;
  }

  /**
   * Checks whether the theme has the specified variables.
   * @param variable The varialbe to check existence of.
   * @returns Whehter the theme has the variable.
   */
  has(variable: string) {
    return this._variables.has(variable);
  }

  /**
   * Deletes the variable.
   * @param variable The variable to delete.
   */
  delete(variable: string) {
    this._variables.delete(variable);
  }

  /**
   * Gets the value of the specified variable.
   * @param variable The variable to get value of.
   * @returns The value of the variable.
   */
  get(variable: string) {
    const value = this._variables.get(variable);

    return value === undefined ? null : { ...value };
  }

  /**
   * Sets the variable to the specified value.
   * @param variable The variable to set.
   * @param value The value of the variable.
   */
  set(variable: string, value: Color) {
    this._variables.set(variable, { ...value });
  }

  /**
   * Gets the amount of variables in the theme.
   * @returns The amount of variable in the theme.
   */
  getVariablesAmount() {
    return this._variables.size;
  }

  /**
   * Gets an array of all variables in the theme.
   * @returns An array of varialbes.
   */
  getVariablesList() {
    return [...this._variables.keys()];
  }

  /**
   * Sorts the theme's variables by their names in place.
   */
  sort() {
    this._variables = new Map(
      [...this._variables].sort(([a], [b]) => a.localeCompare(b)),
    );
  }

  /**
   * Fallbacks this theme to another theme:
   *
   * - Every variable which is present in `other` but not in `this`, is copied
   *   to `this`.
   * - If `this` doesn't have a wallpaper, the wallpaper is copied from `other`.
   *
   * @param other The other theme to fallback to.
   */
  fallbackToOther(other: Attheme) {
    for (const [variable, color] of other._variables) {
      if (!this._variables.has(variable)) {
        this._variables.set(variable, { ...color });
      }
    }

    if (this._wallpaper === undefined) {
      this._wallpaper = other._wallpaper;
    }
  }

  *[Symbol.iterator]() {
    for (const [variable, value] of this._variables) {
      const entry: [string, Color] = [variable, { ...value }];
      yield entry;
    }
  }

  /**
   * Serializes the theme.
   * @param colorSignature The way the colors should be serialized. "hex" for
   * #aarrggbb and "int" for Java int color.
   * @returns The serialized theme.
   */
  toString(colorSignature?: ColorSignature) {
    return serializeTheme(this, colorSignature);
  }
}

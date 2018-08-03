import test from "ava";
import fromFile from "../../lib/tools/node/fromFile";
import jimp from "jimp";
import path from "path";

test(`Reads the file properly`, async (t) => {
  const theme = await fromFile(path.join(__dirname, `../exampleTheme.attheme`));

  const wallpaperBuffer = Buffer.from(theme.getWallpaper(), `binary`);

  // If the image is incorrectly read, it will throw
  t.notThrows(() => jimp.read(wallpaperBuffer));

  const expectedTheme = new Map([
    [`divider`, {
      red: 217,
      green: 217,
      blue: 217,
      alpha: 255,
    }],
  ]);

  t.deepEqual(theme._variables, expectedTheme);
});

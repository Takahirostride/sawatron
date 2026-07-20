import { access, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assets = [
  ["public/assets/hero-racer.png", "public/assets/hero-racer.webp", 1920],
  ["public/assets/hero-car.png", "public/assets/hero-car.webp", 1920],
  ["public/assets/hero/gp-ciber-machine-stream.png", "public/assets/hero/gp-ciber-machine-stream.webp", 1700],
  ["public/assets/hero/gp-ciber-machine-dogfight.png", "public/assets/hero/gp-ciber-machine-dogfight.webp", 1340],
  ["public/assets/hero/ace-player.png", "public/assets/hero/ace-player.webp", 1980],
  ["public/assets/hero/ace-player-dark.png", "public/assets/hero/ace-player-dark.webp", 1980],
];

async function shouldWrite(input, output) {
  try {
    await access(input);
  } catch {
    console.warn(`skipped missing asset ${input}`);
    return false;
  }

  try {
    const [inputStat, outputStat] = await Promise.all([stat(input), stat(output)]);
    return inputStat.mtimeMs > outputStat.mtimeMs;
  } catch {
    return true;
  }
}

await Promise.all(
  assets.map(async ([input, output, width]) => {
    if (!(await shouldWrite(input, output))) {
      return;
    }

    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);

    console.log(`optimized ${path.basename(input)} -> ${path.basename(output)}`);
  }),
);

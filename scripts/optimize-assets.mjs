import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assets = [
  ["public/assets/hero-racer.png", "public/assets/hero-racer.webp", 1920],
  ["public/assets/hero-car.png", "public/assets/hero-car.webp", 1920],
  ["public/assets/contact-racer.png", "public/assets/contact-racer.webp", 1600],
];

async function shouldWrite(input, output) {
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

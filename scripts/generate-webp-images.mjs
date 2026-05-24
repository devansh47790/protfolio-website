import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, 'public', 'project-images');
const QUALITY = 78;

async function main() {
  const entries = await readdir(IMAGE_DIR);
  const candidates = entries.filter((name) => /\.(jpe?g|png)$/i.test(name));

  for (const name of candidates) {
    const input = path.join(IMAGE_DIR, name);
    const output = input.replace(/\.(jpe?g|png)$/i, '.webp');
    const sourceInfo = await stat(input);

    try {
      const outputInfo = await stat(output);
      if (outputInfo.mtimeMs >= sourceInfo.mtimeMs) {
        console.log(`skip ${path.basename(output)}`);
        continue;
      }
    } catch {
      // Missing output, generate it below.
    }

    await sharp(input)
      .rotate()
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(output);

    console.log(`wrote ${path.basename(output)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

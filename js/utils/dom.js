const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../../images');
const isSourceImage = file => /\.(jpe?g|png)$/i.test(file);

const convertImageToWebp = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    console.log(`✅ Optimisé : ${outputPath}`);
  } catch (error) {
    console.error(`❌ Échec : ${inputPath} — ${error.message}`);
    process.exitCode = 1;
  }
};

const processDirectory = async inputDir => {
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(inputPath);
      continue;
    }

    if (!entry.isFile() || !isSourceImage(entry.name)) continue;

    const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, '.webp');
    await convertImageToWebp(inputPath, outputPath);
  }
};

(async () => {
  console.log('Optimisation des images…');
  await processDirectory(INPUT_DIR);
  console.log('✅ Optimisation terminée. Les originaux ont été conservés.');
})();

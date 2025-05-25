/* node js/utils/dom.js */


const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../../images');

const isImage = (file) => /\.(jpe?g|png)$/i.test(file) && !/\.webp$/i.test(file);

const convertImageToWebp = async (inputPath, outputPath) => {
  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️ Fichier introuvable : ${inputPath}`);
    return;
  }

  try {
    await sharp(inputPath)
      .resize({ width: 800 })
      .webp({ quality: 80 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath);
    console.log(`✅ Converti et supprimé : ${outputPath}`);
  } catch (err) {
    console.error(`❌ Échec de la conversion de ${inputPath}`);
    console.error(`Raison : ${err.message}`);
  }
};

const processDirectory = async (inputDir) => {
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, '.webp');

    if (entry.isDirectory()) {
      await processDirectory(inputPath);
    } else if (entry.isFile() && isImage(entry.name)) {
      await convertImageToWebp(inputPath, outputPath);
    }
  }
};

(async () => {
  console.log('Démarrage de la conversion des images...');
  await processDirectory(INPUT_DIR);
  console.log('✅ Conversion terminée.');
})();



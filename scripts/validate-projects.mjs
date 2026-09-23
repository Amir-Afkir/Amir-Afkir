import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const projectsPath = path.join(root, 'data', 'projects.json');
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const errors = [];
const warnings = [];
const ids = new Set();

const localPath = value => {
  if (
    !value ||
    /^https?:\/\//i.test(value) ||
    /^(mailto:|tel:|data:|javascript:)/i.test(value) ||
    value.startsWith('#')
  ) return null;

  const clean = value.split('#')[0].split('?')[0];
  const relative = clean.replace(/^\.\//, '').replace(/^\//, '');
  return relative || null;
};

const verifyLocalAsset = (context, value) => {
  const relative = localPath(value);
  if (!relative) return;

  if (relative.startsWith('F.')) {
    errors.push(`${context} : chemin suspect = ${value}`);
    return;
  }

  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) {
    errors.push(`${context} : asset introuvable = ${value}`);
    return;
  }

  const stat = fs.statSync(absolute);
  if (stat.isFile() && stat.size > 1_000_000) {
    warnings.push(`Asset lourd (${(stat.size / 1_000_000).toFixed(1)} Mo) : ${relative}`);
  }
};

for (const project of projects) {
  if (!project.id) errors.push('Un projet ne possède pas d’identifiant.');
  if (ids.has(project.id)) errors.push(`Identifiant dupliqué : ${project.id}`);
  ids.add(project.id);

  if (!project.title) errors.push(`Projet ${project.id || '?'} : titre manquant.`);
  if (!project.category) errors.push(`Projet ${project.id || '?'} : catégorie manquante.`);

  verifyLocalAsset(`Projet ${project.id} / image`, project.image);
  (project.gallery || []).forEach((value, index) => {
    verifyLocalAsset(`Projet ${project.id} / gallery[${index}]`, value);
  });
}

for (const htmlFile of ['index.html', 'cv.html']) {
  const html = fs.readFileSync(path.join(root, htmlFile), 'utf8');
  const references = html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g);

  for (const match of references) {
    verifyLocalAsset(`${htmlFile} / référence locale`, match[1]);
  }
}

if (warnings.length) {
  console.warn('\nAvertissements :');
  [...new Set(warnings)].forEach(message => console.warn(`- ${message}`));
}

if (errors.length) {
  console.error('\nValidation échouée :');
  errors.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`✅ Portfolio valide : ${projects.length} projets, aucun chemin local cassé.`);

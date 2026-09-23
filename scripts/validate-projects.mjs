import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const projectsPath = path.join(root, 'data', 'projects.json');
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

const errors = [];
const warnings = [];
const ids = new Set();

const localPath = value => {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith('#')) return null;
  return value.replace(/^\.\//, '').replace(/^\//, '');
};

for (const project of projects) {
  if (!project.id) errors.push('Un projet ne possède pas d’identifiant.');
  if (ids.has(project.id)) errors.push(`Identifiant dupliqué : ${project.id}`);
  ids.add(project.id);

  if (!project.title) errors.push(`Projet ${project.id || '?'} : titre manquant.`);
  if (!project.category) errors.push(`Projet ${project.id || '?'} : catégorie manquante.`);

  const refs = [
    ['image', project.image],
    ...(project.gallery || []).map((value, index) => [`gallery[${index}]`, value]),
  ];

  for (const [label, value] of refs) {
    const relative = localPath(value);
    if (!relative) continue;

    if (relative.startsWith('F.')) {
      errors.push(`Projet ${project.id} : chemin suspect ${label} = ${value}`);
      continue;
    }

    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) {
      errors.push(`Projet ${project.id} : asset introuvable ${label} = ${value}`);
      continue;
    }

    const size = fs.statSync(absolute).size;
    if (size > 1_000_000) {
      warnings.push(`Asset lourd (${(size / 1_000_000).toFixed(1)} Mo) : ${relative}`);
    }
  }
}

if (warnings.length) {
  console.warn('\nAvertissements :');
  warnings.forEach(message => console.warn(`- ${message}`));
}

if (errors.length) {
  console.error('\nValidation échouée :');
  errors.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`✅ Portfolio valide : ${projects.length} projets, aucun chemin local cassé.`);

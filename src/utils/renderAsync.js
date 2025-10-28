// src/utils/renderAsync.js
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const VIEWS_DIR  = path.join(__dirname, '..', 'views');

export async function render(view, data = {}, ejsOptions = {}) {
  const file = path.join(VIEWS_DIR, `${view}.ejs`);
  // async:true permite <%- await ... %> si lo usas; aquí solo nos interesa que devuelva una promesa
  return ejs.renderFile(file, data, { async: true, ...ejsOptions });
}

// Renderiza una vista dentro de layout.ejs
export async function renderLayout(res, view, data = {}) {
  const body = await render(view, data);
  res.render('layout', { ...data, body });
}

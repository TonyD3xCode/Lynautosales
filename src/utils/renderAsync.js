// src/utils/renderAsync.js
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export async function renderAsync(res, viewName, locals = {}) {
  const viewsRoot = path.join(__dirname, '..', 'views');

  // 1) Renderizamos la vista interna (home, about, etc.)
  const inner = await ejs.renderFile(
    path.join(viewsRoot, `${viewName}.ejs`),
    { ...res.locals, ...locals },
    { async: true }
  );

  // 2) Inyectamos ese HTML en el layout global
  const html = await ejs.renderFile(
    path.join(viewsRoot, 'layout.ejs'),
    { ...res.locals, ...locals, content: inner },
    { async: true }
  );

  return html;
}

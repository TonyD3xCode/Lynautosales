// src/utils/renderAsync.js
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const VIEWS_DIR  = path.join(__dirname, '..', 'views');

/**
 * Renderiza una vista EJS y devuelve HTML (sin layout)
 */
const render = (viewName, locals = {}) =>
  new Promise((resolve, reject) => {
    const file = path.join(VIEWS_DIR, `${viewName}.ejs`);
    ejs.renderFile(file, locals, {}, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });

/**
 * Renderiza una vista dentro del layout.ejs
 * viewName: nombre del archivo EJS en /src/views sin extensión (ej: 'home')
 * locals: variables adicionales para la vista
 */
export const renderLayout = async (req, res, viewName, locals = {}) => {
  try {
    // Base disponible en TODAS las vistas
    const base = {
      req,
      user: req.session?.user || null,
      __: req.__ ? req.__.bind(req) : (k) => k,
      t : req.__ ? req.__.bind(req) : (k) => k,
      title: '',
      meta_description: ''
    };

    // Merge: res.locals (middleware) -> base -> locals de la ruta
    const merged = { ...base, ...res.locals, ...locals };

    // Render del cuerpo primero
    const body = await render(viewName, merged);

    // Render del layout con el body inyectado
    res.render('layout', { ...merged, body });
  } catch (err) {
    console.error('renderLayout error:', err);
    res.status(500).send('Template error');
  }
};

export { render };
export default renderLayout;

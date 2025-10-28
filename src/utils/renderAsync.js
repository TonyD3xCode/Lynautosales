// src/utils/renderAsync.js
export function renderAsync(res, view, params = {}) {
  return new Promise((resolve, reject) => {
    // Mezcla variables globales de las vistas + params específicos
    const data = { ...res.locals, ...params };

    res.render(view, data, (err, html) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
}

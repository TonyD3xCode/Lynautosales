// src/utils/renderAsync.js
export function renderAsync(app, view, data = {}) {
  return new Promise((resolve, reject) => {
    app.render(view, data, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

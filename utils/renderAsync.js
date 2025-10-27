export function renderAsync(app, view, data = {}) {
  return new Promise((resolve, reject) => {
    app.render(view, data, (err, html) => (err ? reject(err) : resolve(html)));
  });
}

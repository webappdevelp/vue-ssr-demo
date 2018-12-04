const path = require('path');
const fs = require('fs');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const isProd = process.env.NODE_ENV === 'production';
const templatePath = path.resolve(__dirname, '../../public/index.html');

const app = express();
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false
    })
  );
}

app.use('/dist', express.static(path.join(__dirname, '../../dist')));
app.use('/public', express(path.join(__dirname, '../../public')));

let renderer;
let readyPromise;
if (isProd) {
  const bundle = require('../../dist/vue-ssr-server-bundle.json');
  const clientManifest = require('../../dist/vue-ssr-client-manifest.json');
  const template = fs.readFileSync(templatePath, 'utf-8');
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  readyPromise = require('../../config/dev')(app, templatePath, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  })
}

function render(req, res) {
  const s = Date.now();

  const context = {
    title: 'Vue SSR Demo',
    url: req.url
  };

  res.setHeader('Content-Type', 'text/html');
  renderer.renderToString(context, (err, html) => {
    console.log(JSON.stringify(html));
    if (err) {
      res.status(500).send('Internal Error');
      return;
    }
    res.send(html);
    console.log(`whole request: ${Date.now() - s}ms\n`);
  });
}

app.get('*', isProd ? render: (req, res) => {
  readyPromise.then(() => render(req, res));
});

app.listen(8080);

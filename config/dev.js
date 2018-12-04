const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const MFS = require('memory-fs');
const webpack = require('webpack');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
  } catch (e) {}
};

module.exports = function setDevServer(app, templatePath, cb) {
  let bundle;
  let template;
  let clientManifest;

  let ready;
  const readyPromise = new Promise(r => { ready = r})
  const update = () => {
    if (bundle && clientManifest) {
      ready();
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }

  // 监控template文件的修改
  template = fs.readFileSync(templatePath, 'utf-8');
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8');
    console.log('index.html template updated\n');
    update();
  });

  // hot client reload
  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app
  ];

  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  const clientCompiler = webpack(clientConfig);
  const devMiddleWare = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });
  app.use(devMiddleWare);
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.log(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;
    clientManifest = JSON.parse(
      readFile(devMiddleWare.fileSystem, 'vue-ssr-client-manifest.json')
    );
    update();
  });
  app.use(
    require('webpack-hot-middleware')(clientCompiler, {
      heartbeat: 5000
    })
  );

  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    update();
  });

  return readyPromise;
};

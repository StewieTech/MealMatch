const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routeDir = path.join(root, 'api', 'src', 'routes');
const controllerDir = path.join(root, 'api', 'src', 'controllers');
const serviceDir = path.join(root, 'api', 'src', 'services');

function listTs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith('.ts')).sort();
}

const summary = {
  routes: listTs(routeDir),
  controllers: listTs(controllerDir),
  services: listTs(serviceDir),
};

console.log(JSON.stringify(summary, null, 2));
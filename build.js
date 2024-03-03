const fs = require('fs');
const path = require('path');

const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

fs.writeFileSync(path.join(__dirname, 'dist', 'dev.user.js'), generateHeader(true));
if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
  fs.writeFileSync(path.join(__dirname, 'dist', 'user.js'), generateHeader(false) + fs.readFileSync(path.join(__dirname, 'dist', 'bundle.js'), 'utf-8').toString());
}

function generateHeader(devlopment = false) {
  const data = {
    ...JSON.parse(fs.readFileSync(path.resolve(__dirname, 'userscript.json'), 'utf8')),
    version: packageJSON.version,
    author: packageJSON.author,
    license: packageJSON.license,
  };

  if (devlopment) {
    if (!Object.keys(data).includes('require')) {
      data.require = [];
    }
    data.name += ' (DEV)';
    data.require.push('file:///' + path.resolve(__dirname, 'dist', 'bundle.js').replace(/\\/g, '/'));
  }

  const spaces = (key) => {
    const number = 16 - key.length;
    return ' '.repeat(number);
  };

  let header = '';
  header += '// ==UserScript==\n';
  for (const key in data) {
    const value = data[key];
    if (value instanceof Array) {
      value.forEach((v) => {
        header += `// @${key}${spaces(key)}${v}\n`;
      });
    } else {
      header += `// @${key}${spaces(key)}${value}\n`;
    }
  }
  header += '// ==/UserScript==\n\n\n';

  return header;
}

const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify/js').js;

const packageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

fs.writeFileSync(path.join(__dirname, 'dist', 'user.dev.js'), generateHeader(true));
if (fs.existsSync(path.join(__dirname, 'dist', 'bundle.js'))) {
  const userjs = generateHeader(false) + fs.readFileSync(path.join(__dirname, 'dist', 'bundle.js'), 'utf-8').toString();
  fs.writeFileSync(path.join(__dirname, 'dist', 'user.js'), userjs);
  fs.writeFileSync(path.join(__dirname, 'dist', 'user.format.js'), beautify(userjs, { indent_with_tabs: true }));
}

updateReadme(packageJSON.version);

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
    data.name = '[DEV] ' + data.name;
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

function updateReadme(version) {
  const SEPARATOR = '<!-- The following content is auto-generated, please do not modify directly. -->';

  let [readme, _] = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8').toString().split(SEPARATOR);
  readme += SEPARATOR + '\n\n';

  readme += `## 功能列表\n\n`;

  const plugins = fs.readdirSync(path.join(__dirname, 'src/plugins'));
  for (const plugin of plugins) {
    if (fs.existsSync(path.join(__dirname, 'src/plugins', plugin, 'README.md'))) {
      for (const line of fs.readFileSync(path.join(__dirname, 'src/plugins', plugin, 'README.md'), 'utf-8').toString().split('\n')) {
        if (line.startsWith('## ')) {
          const title = line.slice(3);
          readme += `### ${title} [\`${plugin}\`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/${plugin})\n`;
        } else {
          readme += line + '\n';
        }
      }
      readme += '\n\n';
    }
  }

  readme += `> 以上功能介绍基于版本 ${version} 生成，在最新版中可能发生改变，请参见 [项目仓库](https://github.com/memset0/Learning-at-ZJU-Helper)。\n\n`;

  // console.log(readme);
  fs.writeFileSync(path.join(__dirname, 'README.md'), readme);
  fs.writeFileSync(path.join(__dirname, 'dist/README.md'), readme);
}

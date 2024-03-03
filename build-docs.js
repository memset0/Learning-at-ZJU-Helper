const fs = require('fs');
const path = require('path');

const SEPARATOR = '<!-- The following content is auto-generated, please do not modify directly. -->';

let [readme, _] = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf-8').toString().split(SEPARATOR);
readme += SEPARATOR + '\n\n';

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

// console.log(readme);
fs.writeFileSync(path.join(__dirname, 'README.md'), readme);
fs.writeFileSync(path.join(__dirname, 'dist/README.md'), readme);

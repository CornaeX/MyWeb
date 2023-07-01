const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const buildDirectory = 'dist';
const viewsDirectory = './scr/views';
const data = {
  message: 'Hello, World!', // Add any data you want to pass to the template
};

if (!fs.existsSync(buildDirectory)) {
  fs.mkdirSync(buildDirectory);
}

const ejsFiles = fs.readdirSync(viewsDirectory).filter((file) => path.extname(file) === '.ejs');

ejsFiles.forEach((file) => {
  const template = fs.readFileSync(path.join(viewsDirectory, file), 'utf-8');
  const html = ejs.render(template, data); // Pass the data to the template

  fs.writeFileSync(path.join(buildDirectory, `${path.parse(file).name}.html`), html);
});
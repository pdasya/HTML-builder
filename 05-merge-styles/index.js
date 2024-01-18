const fs = require('fs').promises;
const path = require('path');

const stylesDirectory = path.join(__dirname, 'styles');
const projectDistDirectory = path.join(__dirname, 'project-dist');

function readStylesFolder() {
  return fs
    .readdir(stylesDirectory)
    .then((files) => {
      const cssFiles = files.filter((file) => path.extname(file) === '.css');
      const promises = cssFiles.map((file) => {
        const filePath = path.join(stylesDirectory, file);
        return fs
          .readFile(filePath, 'utf-8')
          .then((content) => ({ fileName: file, content }))
          .catch((err) => {
            console.error(`Error reading file ${file}: ${err.message}`);
            return null;
          });
      });
      return Promise.all(promises.filter(Boolean));
    })
    .catch((err) => {
      console.error(`Error reading styles directory: ${err.message}`);
      return [];
    });
}

function writeBundleFile(fileContent) {
  const bundleFilePath = path.join(projectDistDirectory, 'bundle.css');
  const fileContentString = fileContent.map((file) => file.content).join('\n');

  return fs
    .writeFile(bundleFilePath, fileContentString, 'utf-8')
    .then(() => console.log(`Bundle file written to ${bundleFilePath}`))
    .catch((err) => console.error(`Error writing bundle file: ${err.message}`));
}

// Асинхронно создаем директорию
fs.mkdir(projectDistDirectory, { recursive: true })
  .then(readStylesFolder)
  .then(writeBundleFile);

const fs = require('fs');
const path = require('path');

const charset = 'utf8';
const projectDistFolder = 'project-dist';
const assetsFolder = 'assets';

const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const distFolderPath = path.join(__dirname, projectDistFolder);
const indexFilePath = path.join(distFolderPath, 'index.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const distStylePath = path.join(__dirname, projectDistFolder, 'style.css');
const assetsSourcePath = path.join(__dirname, assetsFolder);
const assetsDistPath = path.join(__dirname, projectDistFolder, assetsFolder);

let templateContent;
const components = [];

function getComponents(callback) {
  fs.readFile(templateFilePath, charset, (err, content) => {
    if (err) {
      console.error('Error reading template file:', err.message);
      return callback(err);
    }

    templateContent = content;

    const componentRegEx = /{{(.*?)}}/g;
    let component;
    while ((component = componentRegEx.exec(templateContent))) {
      components.push(component[1]);
    }

    callback(null, components);
  });
}

function replaceTagsWithContent(components, callback) {
  components.forEach((componentName) => {
    const componentFilePath = path.join(
      componentsFolderPath,
      `${componentName}.html`,
    );
    fs.readFile(componentFilePath, charset, (err, componentContent) => {
      if (err) {
        console.error(
          `Error reading component file ${componentName}.html:`,
          err.message,
        );
        return callback(err);
      }

      templateContent = templateContent.replace(
        `{{${componentName}}}`,
        componentContent,
      );
    });
  });

  callback(null);
}

function saveModifiedTemplate(callback) {
  fs.rm(distFolderPath, { force: true, recursive: true }, (err) => {
    if (err) {
      console.error('Error removing existing dist folder:', err.message);
      return callback(err);
    }

    fs.mkdir(distFolderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating dist folder:', err.message);
        return callback(err);
      }

      fs.writeFile(indexFilePath, templateContent, charset, callback);
    });
  });
}

function createStyleFile(callback) {
  fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading styles folder:', err.message);
      return callback(err);
    }

    const writeStream = fs.createWriteStream(distStylePath, {
      encoding: charset,
    });

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesFolderPath, file.name);
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(writeStream);
      }
    });

    writeStream.on('finish', callback);
  });
}

function copyAssets(sourcePath, distPath, callback) {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating assets dist folder:', err.message);
      return callback(err);
    }

    fs.readdir(sourcePath, (err, files) => {
      if (err) {
        console.error('Error reading assets source folder:', err.message);
        return callback(err);
      }

      const copyFile = (fileName, callback) => {
        const fileSourcePath = path.join(sourcePath, fileName);
        const fileDistPath = path.join(distPath, fileName);

        fs.stat(fileSourcePath, (err, fileStats) => {
          if (err) {
            console.error(
              `Error checking file stats for ${fileName}:`,
              err.message,
            );
            return callback(err);
          }

          if (fileStats.isDirectory()) {
            copyAssets(fileSourcePath, fileDistPath, callback);
          } else {
            fs.copyFile(fileSourcePath, fileDistPath, callback);
          }
        });
      };

      const copyFilePromises = files.map((fileName) => {
        return new Promise((resolve, reject) => {
          copyFile(fileName, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(copyFilePromises)
        .then(() => callback(null))
        .catch(callback);
    });
  });
}

function run() {
  getComponents((err, components) => {
    if (err) {
      console.error('Error getting components:', err.message);
      return;
    }

    replaceTagsWithContent(components, (err) => {
      if (err) {
        console.error('Error replacing tags with content:', err.message);
        return;
      }

      saveModifiedTemplate((err) => {
        if (err) {
          console.error('Error saving modified template:', err.message);
          return;
        }

        createStyleFile((err) => {
          if (err) {
            console.error('Error creating style file:', err.message);
            return;
          }

          copyAssets(assetsSourcePath, assetsDistPath, (err) => {
            if (err) {
              console.error('Error copying assets:', err.message);
              return;
            }

            console.log('Build completed successfully.');
          });
        });
      });
    });
  });
}

run();

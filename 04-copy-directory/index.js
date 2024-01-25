const fsPromises = require('fs/promises');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'files');
const targetFolderPath = path.join(__dirname, 'files-copy');

function copyDir() {
  fsPromises
    .rm(targetFolderPath, { force: true, recursive: true })
    .then(() => fsPromises.mkdir(targetFolderPath, { recursive: true }))
    .then(() => fsPromises.readdir(sourceFolderPath))
    .then((files) => {
      files.forEach((file) => {
        const sourceFilePath = path.join(sourceFolderPath, file);
        const targetFilePath = path.join(targetFolderPath, file);
        fsPromises
          .copyFile(sourceFilePath, targetFilePath)
          .catch((err) => console.log(err.message));
      });
    })
    .catch((err) => console.log(err.message));
}

copyDir();

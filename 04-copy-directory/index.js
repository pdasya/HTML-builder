const fs = require('fs');
const path = require('path');

function copyDir(callback) {
  const sourceDir = path.join(__dirname, 'files');
  const desiredDir = path.join(__dirname, 'files-copy');

  fs.mkdir(desiredDir, { recursive: true }, (mkdirError) => {
    if (mkdirError) {
      return callback(`Error creating directory: ${mkdirError.message}`);
    }

    fs.readdir(sourceDir, (readDirError, files) => {
      if (readDirError) {
        return callback(`Error reading directory: ${readDirError.message}`);
      }

      files.forEach((file) => {
        const sourcePath = path.join(sourceDir, file);
        const desiredPath = path.join(desiredDir, file);

        fs.copyFile(sourcePath, desiredPath, (copyFileError) => {
          if (copyFileError) {
            console.error(
              `Error copying file ${file}: ${copyFileError.message}`,
            );
          } else {
            console.log(`File copied: ${file}`);
          }
        });
      });

      console.log('Directory copied successfully.');
      callback(null);
    });
  });
}

copyDir((error) => {
  if (error) {
    console.error(error);
  }
});

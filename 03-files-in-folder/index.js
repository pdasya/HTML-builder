const fs = require('fs');
const path = require('path');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder');

function displayFileInfo() {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      stdout.write(`Error reading folder: ${err.message}\n`);
      return;
    }

    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (statErr, fileStats) => {
          if (statErr) {
            stdout.write(`Error getting file stats: ${statErr.message}\n`);
            return;
          }

          const fileSizeInKB = (fileStats.size / 1024).toFixed(3);
          const fileExtension = path.extname(file.name);
          const fileNameWithoutExtension = path.basename(
            file.name,
            fileExtension,
          );

          stdout.write(
            `${fileNameWithoutExtension} - ${fileExtension.slice(
              1,
            )} - ${fileSizeInKB}kb\n`,
          );
        });
      } else {
        stdout.write(
          `Error: ${file.name} is a directory. Only files are allowed.\n`,
        );
      }
    });
  });
}

displayFileInfo();

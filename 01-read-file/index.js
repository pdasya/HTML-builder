const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'text.txt'), 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err.message);
  } else {
    console.log(data);
  }
});

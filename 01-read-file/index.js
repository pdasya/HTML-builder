const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);

readStream.setEncoding('utf8');
readStream.on('data', (part) => {
  process.stdout.write(part);
});

readStream.on('end', () => {
  console.log('\nFile read finished.');
});

readStream.on('error', (err) => {
  console.error(`Error reading the file: ${err.message}`);
});

const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'output.txt');

stdout.write('Welcome! Please enter text or type "exit" to quit:\n');

stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') {
    stdout.write('\nThank you! See you!\n');
    process.exit(0);
  } else {
    fs.appendFile(filePath, `${input}\n`, (err) => {
      if (err) {
        stdout.write(`Error writing to file: ${err.message}\n`);
      } else {
        stdout.write(
          '\nText written. Enter more text or type "exit" to quit\n',
        );
      }
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('\nCaught interrupt signal. Thank you! See you!\n');
  process.exit(0);
});

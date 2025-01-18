const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (chunk) => {
  process.stdout.write(
    `
    ================================================
    The text in "text.txt" is:
    ` + '\n',
  );
  process.stdout.write('   ' + chunk);
  process.stdout.write(
    `
    ================================================
    `,
  );
});

readStream.on('error', (err) => {
  console.error('Error reading file:', err.message);
});

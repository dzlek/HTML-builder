const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const welcomeText = `
=================== Welcome! ===================
Enter text to save it to the file "text.txt". 
Type "exit" or press Ctrl+C to quit.
================================================`;

const farewellText = `
=================== Goodbye! ===================
Text saved to the "text.txt". 
================================================`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdout.write(welcomeText + '\n');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    farewellAndExit();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  farewellAndExit();
});

function farewellAndExit() {
  process.stdout.write(farewellText);
  rl.close();
  writeStream.end();
  process.exit();
}

rl.prompt();

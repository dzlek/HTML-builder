const fs = require('fs/promises');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.rm(outputFile, { force: true });
    await fs.mkdir(outputFolder, { recursive: true });
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    const styles = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf8');
        styles.push(content);
      }
    }

    await fs.writeFile(outputFile, styles.join('\n'));
    process.stdout.write(
      '===== Styles successfully merged into "bundle.css" =====\n',
    );
  } catch (error) {
    process.stderr.write(`Error merging styles: ${error}\n`);
  }
}

mergeStyles();

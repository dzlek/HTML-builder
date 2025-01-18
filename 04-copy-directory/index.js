const fs = require('fs/promises');
const path = require('path');

const pathOfCurrentFolder = path.join(__dirname, 'files');
const pathOfCopyFolder = path.join(__dirname, 'files-copy');

async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    process.stderr.write(`Ups, something went wrong: ${error}\n`);
  }
}

async function main() {
  try {
    await fs.rm(pathOfCopyFolder, { recursive: true, force: true }); //remove old folder if exists
    await copyDirectory(pathOfCurrentFolder, pathOfCopyFolder);
    process.stdout.write(
      '\n===== Files copied from "files" to "files-copy" =====\n',
    );
  } catch (error) {
    process.stderr.write(`Ups, something went wrong: ${error}\n`);
  }
}

main();

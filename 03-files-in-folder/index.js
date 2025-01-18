const { readdir } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, { withFileTypes: true })
  .then((items) => {
    process.stdout.write(
      '\n========== List of files in "secret-folder": =========\n',
    );
    const filePromises = items
      .filter((item) => item.isFile())
      .map((file) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(folderPath, file.name);
          const fileExt = path.extname(file.name).slice(1);
          const fileName = path.basename(file.name, path.extname(file.name));

          fs.stat(filePath, (err, stats) => {
            if (err) {
              return reject(err);
            }
            const fileSize = (stats.size / 1024).toFixed(3);
            process.stdout.write(`${fileName} - ${fileExt} - ${fileSize}kb\n`);
            resolve();
          });
        });
      });

    return Promise.all(filePromises);
  })
  .then(() => {
    process.stdout.write(
      '===================== End of list ====================\n',
    );
  })
  .catch((err) => {
    process.stderr.write(`Error reading the folder: ${err.message}\n`);
  });

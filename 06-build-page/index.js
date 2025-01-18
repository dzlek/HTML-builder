const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const outputFile = path.join(projectDist, 'index.html');
const outputStyles = path.join(projectDist, 'style.css');

async function copyDirectory(src, dest) {
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
}

async function buildPage() {
  try {
    await fs.rm(projectDist, { recursive: true, force: true });
    await fs.mkdir(projectDist, { recursive: true });

    let template = await fs.readFile(templateFile, 'utf8');
    const componentTags = template.match(/{{\s*[\w]+\s*}}/g) || [];

    for (let tag of componentTags) {
      const componentName = tag.replace(/{{\s*|[\s*}}]/g, '');
      const componentFile = path.join(
        componentsFolder,
        `${componentName}.html`,
      );
      try {
        const componentContent = await fs.readFile(componentFile, 'utf8');
        template = template.replace(tag, componentContent);
      } catch (error) {
        process.stderr.write(`Component ${componentName} not found.\n`);
      }
    }

    await fs.writeFile(outputFile, template);
    process.stdout.write(
      '======== "index.html" created successfully. =======\n',
    );

    const styleFiles = await fs.readdir(stylesFolder, { withFileTypes: true });
    const styles = [];

    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleContent = await fs.readFile(
          path.join(stylesFolder, file.name),
          'utf8',
        );
        styles.push(styleContent);
      }
    }

    await fs.writeFile(outputStyles, styles.join('\n'));
    process.stdout.write(
      '======== "style.css" created successfully.========\n',
    );

    await copyDirectory(assetsFolder, path.join(projectDist, 'assets'));
    process.stdout.write(
      '======== Assets folder copied successfully. =======\n',
    );
  } catch (error) {
    process.stderr.write(`Error building the page: ${error}\n`);
  }
}

buildPage();

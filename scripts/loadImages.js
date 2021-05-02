// import * as fs from 'fs';

const fs = require('fs');

const files = [];
const basePath = './dist/images/';

const recur = previousPath => {
    const fileNames = fs.readdirSync(previousPath);

    for (const name of fileNames) {
        const currentPath = previousPath + name;

        if (
            fs.existsSync(currentPath) &&
            fs.lstatSync(currentPath).isDirectory()
        ) {
            recur(currentPath + '/');
        }
        if (
            fs.lstatSync(currentPath).isFile() &&
            (currentPath.endsWith('png') ||
                currentPath.endsWith('jpg') ||
                currentPath.endsWith('jpeg'))
        ) {
            files.push(currentPath.replace('dist/', ''));
        }
    }
    return files;
};

recur(basePath);

fs.writeFileSync('./src/assets/JSON/images.json', JSON.stringify(files));

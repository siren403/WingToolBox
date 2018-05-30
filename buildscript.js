const fs = require('fs');
const path = require('path');

let copyFiles = [
    'node_modules',
    'out',
    'package.json'
];

let sourceBasePath = path.dirname(__dirname);
let appName = path.basename(sourceBasePath);

// let targetBasePath = path.join(vscode.env.appRoot, 'extensions', appName);
let targetBasePath = 'C:/Program Files/Microsoft VS Code/resources/app/extensions/wingtoolbox';

if (fs.existsSync(targetBasePath) === false) {
    fs.mkdirSync(targetBasePath);
}

for (let files of copyFiles) {
    let sourcePath = path.join(sourceBasePath, files);
    let targetPath = path.join(targetBasePath, 'extensions', appName, files);

    copyFile(sourcePath, targetPath)
        .then((file) => {
            console.log('copy complete', file);
        })
        .catch((e) => {
            console.log(e);
        });
}

function copyFile(source, target) {
    var rd = fs.createReadStream(source);
    var wr = fs.createWriteStream(target);
    return new Promise(function (resolve, reject) {
        rd.on('error', reject);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    }).catch(function (error) {
        rd.destroy();
        wr.end();
        throw error;
    });
}
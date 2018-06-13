import * as path from 'path';
import * as fs from 'fs';
import { isEmpty } from './Compare';
// import * as vscode from 'vscode';

function createDir(targetPath: string): void {

    if (isEmpty(path.extname(targetPath)) !== true) {
        targetPath = targetPath.replace(path.extname(targetPath), '');
    }

    let pattern = /\/|\\/;
    let directorys: string[] = targetPath.split(pattern);
    let currentDir: string = '';
    for (let dir of directorys) {
        if(dir.indexOf(':') > 0){
            dir += '/';
        }
        currentDir = path.join(currentDir, dir);
        if (fs.existsSync(currentDir) === false) {
            fs.mkdirSync(currentDir);
        }
    }
}

function write(dir: string, fileName: string, data: any) {
    return new Promise((resolve, reject) => {

        createDir(dir);

        let fileDir = path.join(dir, fileName + '.json');
        fs.writeFile(fileDir, JSON.stringify(data), (err) => {
            if (!err) {
                resolve();
            }
            else {
                reject(err);
            }
        });
    });
}

export { write };
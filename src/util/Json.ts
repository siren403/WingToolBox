import * as path from 'path';
import * as fs from 'fs';

function write(dir: string, fileName: string, data: any) {
    return new Promise((resolve, reject) => {
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
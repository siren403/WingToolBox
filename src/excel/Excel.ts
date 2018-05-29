import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import WingToolBox from '../WingToolBox';

interface ICellInfo {
    col: string;
    row: number;
}




function writeMapSheet(workSheet: XLSX.WorkSheet): void {
    try {
        let sheetArray = convertSheet(workSheet);

        let resultMap: any = {};

        let keyPropertyName: string = '';
        let obj: any = {};
        let keyMap: any = {};
        for (let i = 0; i < sheetArray.length; i++) {
            if (i === 0) {
                let isKey = false;
                for (let key in sheetArray[i]) {
                    if (isKey === false) {
                        isKey = true;
                        keyPropertyName = key;
                        console.log(keyPropertyName);
                        continue;
                    }
                    obj[(sheetArray[i] as any)[key]] = key;
                    keyMap[key] = (sheetArray[i] as any)[key];
                }
                continue;
            }

            let row: any = sheetArray[i];
            console.log(row);
            for (let key in row) {
                if (key !== keyPropertyName) {
                    obj[keyMap[key]] = row[key];
                }
            }
            resultMap[row[keyPropertyName]] = Object.assign({}, obj);

        }
        writeJson('resource', 'langMap', resultMap)
            .then(() => {
                console.log('write complete');
            })
            .catch((e) => {
                console.log(e);
            });

    } catch (e) {
        console.log(e);
    }
}

function writeArraySheet(workSheet: XLSX.WorkSheet): void {
    try {
        let sheetArray = convertSheet(workSheet);

        let resultArray: Array<any> = [];
        let obj: any = {};
        let keyMap: any = {};
        for (let i = 0; i < sheetArray.length; i++) {
            if (i === 0) {
                for (let key in sheetArray[i]) {
                    obj[(sheetArray[i] as any)[key]] = key;
                    keyMap[key] = (sheetArray[i] as any)[key];
                }
                continue;
            }
            let row: any = sheetArray[i];
            for (let key in row) {
                obj[keyMap[key]] = row[key];
            }
            resultArray.push(Object.assign({}, obj));
        }
        writeJson('resource', 'lang', resultArray)
            .then(() => {
                console.log('write complete');
            })
            .catch((e) => {
                console.log(e);
            });

    } catch (e) {
        console.log(e);
    }
}


function convertSheet(sheet: XLSX.WorkSheet): Array<Object> {
    let array: Array<Object> = [];
    let out: ICellInfo = { col: '', row: 0 };
    let prevRowNum: number = 1;

    let obj: any = {};
    for (let key in sheet) {
        if (createCellInfo(key, out)) {
            if (prevRowNum !== out.row) {
                array.push(Object.assign({}, obj));
            }
            obj[out.col] = sheet[key].v;
            prevRowNum = out.row;
        }
    }
    return array;
}

function createCellInfo(cellKey: string, out: ICellInfo): boolean {
    if (cellKey.indexOf('!') !== -1) {
        return false;
    }

    out.col = cellKey.replace(/[0-9]/g, '');
    out.row = parseInt(cellKey.replace(/[a-z]/gi, ''));

    return true;
}



function writeJson(dir: string, fileName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        let fileDir = path.join(path.dirname(__dirname), dir, fileName + '.json');
        fs.writeFile(fileDir, JSON.stringify(data), (err) => {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}

interface IConfig {
    resources: string[];
    export: string;
}

function defaultConfig(): IConfig {
    let config: IConfig = {
        resources: ['assets/table'],
        export: 'resource/table'
    };
    return config;
}

async function convert():Promise<void>{
    let config:IConfig = WingToolBox.config.excelConfig;
}

export {
    IConfig,
    defaultConfig,
    convert
};
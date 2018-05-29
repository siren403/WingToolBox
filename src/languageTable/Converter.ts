import { write } from '../util/Json';
import { WingToolBox } from '../WingToolBox';
import { glob } from '../interfaces/IGlobFs';
import { convertSheetFromDir } from '../excel/Excel';
import * as path from 'path';

enum EConvertStruct {
    Map = "map",
    Array = "array"
}

interface IConfig {
    resources: string[];
    export: string;
    struct: string;
}

function defaultConfig(): IConfig {
    let config: IConfig = {
        resources: [],
        export: 'resource/table',
        struct: EConvertStruct.Map
    };
    return config;
}
// async function convert(): Promise<void> {
//     let config: IConfig = WingToolBox.config.excelConfig;
// }

async function convert(): Promise<void> {
    let rootPath: string = WingToolBox.config.root;
    let config: IConfig = WingToolBox.config.excelConfig;

    let struct: EConvertStruct = config.struct as EConvertStruct;

    for (let resPath of config.resources) {
        let files: string[] = glob.clear().readdirSync(path.join(rootPath, resPath), {});

        for (let filePath of files) {
            let sheet = convertSheetFromDir(filePath);
            if (sheet.length > 0) {
                let writePath: string = path.join(rootPath, config.export);
                let fileName: string = path.basename(filePath);
                fileName = fileName.replace(path.extname(fileName), '');
                switch (struct) {
                    case EConvertStruct.Map:
                        write(writePath, fileName, convertMap(sheet));
                        break;
                    case EConvertStruct.Array:
                        write(writePath, fileName, convertArray(sheet));
                        break;
                }
            }
        }
    }
}
function convertMap(sheetArray: Array<Object>): any {
    try {
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
                        continue;
                    }
                    obj[(sheetArray[i] as any)[key]] = key;
                    keyMap[key] = (sheetArray[i] as any)[key];
                }
                continue;
            }

            let row: any = sheetArray[i];
            for (let key in row) {
                if (key !== keyPropertyName) {
                    obj[keyMap[key]] = row[key];
                }
            }
            resultMap[row[keyPropertyName]] = Object.assign({}, obj);
        }
        return resultMap;
    } catch (e) {
        console.log(e);
        return e;
    }
}

function convertArray(sheetArray: Array<Object>): Array<any> {
    try {

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

        return resultArray;
    } catch (e) {
        console.log(e);
        return [e];
    }
}


export {
    IConfig,
    defaultConfig,
    convert
};

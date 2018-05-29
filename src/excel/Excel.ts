import * as XLSX from 'xlsx';

interface ICellInfo {
    col: string;
    row: number;
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

function convertSheetFromDir(dir: string): Array<Object> {
    
    let result: Array<Object> = [];

    let book: XLSX.WorkBook = XLSX.readFile(dir);

    if (book.SheetNames.length > 0) {
        let sheet: XLSX.WorkSheet = book.Sheets[book.SheetNames[0]];
        result = convertSheet(sheet);
    }

    return result;
}

function createCellInfo(cellKey: string, out: ICellInfo): boolean {
    if (cellKey.indexOf('!') !== -1) {
        return false;
    }

    out.col = cellKey.replace(/[0-9]/g, '');
    out.row = parseInt(cellKey.replace(/[a-z]/gi, ''));

    return true;
}

export {
    convertSheet,
    convertSheetFromDir
};




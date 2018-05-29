import { Stream } from 'stream';

interface IGlobFs {
    readdir(pattern: string, options: Object, callback: Function): void;
    readdirSync(pattern: string, options: Object): Array<string>;
    readdirStream(pattern: string, options: Object): Stream;
    readdirPromise(pattern: string, options: Object): Promise<Array<string>>;

    files: string[];

    clear(): IGlobFs;
}

let glob: IGlobFs = require('glob-fs')({ gitignore: true });
glob.clear = function () {
    this.files.splice(0);
    return this;
};
export { IGlobFs, glob };
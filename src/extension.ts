'use strict';
import * as vscode from 'vscode';
import WingToolBox from './WingToolBox';
import { Stream } from 'stream';
import * as path from 'path';

let glob: IGlobFs = require('glob-fs')({ gitignore: true });

interface IGlobFs {
    readdir(pattern: string, options: Object, callback: Function): void;
    readdirSync(pattern: string, options: Object): Array<string>;
    readdirStream(pattern: string, options: Object): Stream;
    readdirPromise(pattern: string, options: Object): Promise<Array<string>>;
}

export function activate(context: vscode.ExtensionContext) {

    console.log('activate wingtoolbox');

    let disposable = vscode.commands.registerCommand('wingtoolbox.init', () => {
        WingToolBox.intialize().then(() => {
            console.log('init complete');
        });
    });

    let readFile = vscode.commands.registerCommand('wingtoolbox.readFile', () => {
        let paths = [
            path.join(WingToolBox.config.root, 'test1/*.json'),
            path.join(WingToolBox.config.root, 'test2/*.json')
        ];

        let files = glob.readdirSync(paths[0], {});
        console.log(files);

    });

    context.subscriptions.push(disposable, readFile);
}

// this method is called when your extension is deactivated
export function deactivate() {

}
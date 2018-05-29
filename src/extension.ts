'use strict';
import * as vscode from 'vscode';
import {
    WingToolBox,
    convertTable
} from './WingToolBox';

import * as path from 'path';
import { glob } from './interfaces/IGlobFs';

const prefix: string = 'wingtoolbox';

export function activate(context: vscode.ExtensionContext) {

    console.log('activate wingtoolbox');

    let disposables: vscode.Disposable[] = [
        vscode.commands.registerCommand(getCommandName('init'), () => {
            WingToolBox.intialize().then(() => {
                console.log('init complete');
            });
        }),
        vscode.commands.registerCommand(getCommandName('readFile'), () => {
            WingToolBox.intialize().then(() => {
                let paths = [
                    path.join(WingToolBox.config.root, 'table/*.xlsx'),
                    path.join(WingToolBox.config.root, 'table/*.xls')
                ];
                for (let filepath of paths) {
                    console.log(filepath, glob.clear().readdirSync(filepath,{}));
                }
            });
        }),
        vscode.commands.registerCommand(getCommandName('convertTable'), () => {
            convertTable();
        })
    ];

    context.subscriptions.push(...disposables);
}

function getCommandName(name: string): string {
    return `${prefix}.${name}`;
}

// this method is called when your extension is deactivated
export function deactivate() {

}
import * as path from 'path';
import * as fs from 'fs';
import {
    workspace,
    WorkspaceFolder
} from 'vscode';

import * as TableConverter from './LanguageTable/Converter';

class WingToolBox {

    public static getRootPath(): string {
        let result: string = '';
        if (workspace.workspaceFolders !== undefined) {
            let folders: WorkspaceFolder[] = workspace.workspaceFolders;
            if (folders.length > 0) {
                result = folders[0].uri.path;
            }
        }
        return result;
    }

    public static getConfig(): Promise<IConfig> {
        // if (this.isInit === false) {
        return new Promise<IConfig>((resolve, reject) => {
            let rootPath = this.getRootPath();
            let configPath = 'toolbox.config.json';
            fs.readFile(path.join(rootPath, configPath), 'utf-8', (err, data) => {
                if (!err && data) {
                    this.loadedConfig = JSON.parse(data);
                    resolve(this.loadedConfig);
                } else {
                    return this.createConfig(rootPath, configPath).then((config) => {
                        this.loadedConfig = config;
                    });
                }
            });
        });
        // } else {
        // return Promise.resolve(this.loadedConfig);
        // }
    }

    public static createConfig(rootPath: string, configPath: string): Promise<IConfig> {
        return new Promise<IConfig>((resolve, reject) => {
            let config: IConfig = {
                root: rootPath,
                excelConfig: TableConverter.defaultConfig()
            };
            fs.writeFile(path.join(rootPath, configPath), JSON.stringify(config), (err) => {
                if (!err) {
                    console.log('create config file');
                    resolve(config);
                } else {
                    reject(err);
                }
            });
        });
    }

    public static async intialize(): Promise<void> {
        await this.getConfig();
    }

    private static loadedConfig: IConfig;

    public static get config(): IConfig {
        return this.loadedConfig;
    }

}

interface IConfig {
    root: string;
    excelConfig: TableConverter.IConfig;
}

function convertTable(): void {
    WingToolBox.intialize().then(() => TableConverter.convert()).catch((e) => console.log(e));
}

export {
    WingToolBox,
    convertTable
};

/**
 * 
let pathLog:any = {
        extension: context.extensionPath,
        storage: context.storagePath,
        asAbsolute: context.asAbsolutePath('resource')
    };

    if(workspace.workspaceFolders){
        pathLog["folders"] = workspace.workspaceFolders;
    }
    
    writeJson('resource', 'path', pathLog);


{
    "extension": "/Users/aaron/.vscode/extensions/helloworld",
    "storage": "/Users/aaron/Library/Application Support/Code/User/workspaceStorage/2a7e57503f1a1d272c251937d7387807/aaron.helloworld",
    "asAbsolute": "/Users/aaron/.vscode/extensions/helloworld/resource",
    "folders": [
        {
            "uri": {
                "$mid": 1,
                "fsPath": "/Users/aaron/workspace/vscode-extension/helloworld",
                "external": "file:///Users/aaron/workspace/vscode-extension/helloworld",
                "path": "/Users/aaron/workspace/vscode-extension/helloworld",
                "scheme": "file"
            },
            "name": "helloworld",
            "index": 0
        }
    ]
}
 */
import * as path from 'path';
import * as fs from 'fs';
import * as Excel from './excel/Excel';
import {
    workspace,
    WorkspaceFolder
} from 'vscode';

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
        return new Promise<IConfig>((resolve, reject) => {
            let rootPath = this.getRootPath();
            let configPath = 'toolbox.config.json';
            fs.readFile(path.join(rootPath, configPath), 'utf-8', (err, data) => {
                if (!err && data) {
                    let config: IConfig = JSON.parse(data);
                    resolve(config);
                } else {
                    return this.createConfig(rootPath, configPath);
                }
            });
        });
    }

    public static createConfig(rootPath: string, configPath: string): Promise<IConfig> {
        return new Promise<IConfig>((resolve, reject) => {
            let config: IConfig = {
                root: rootPath,
                excelConfig: Excel.defaultConfig()
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
        this.loadedConfig = await this.getConfig();
    }

    private static loadedConfig: IConfig;

    public static get config(): IConfig {
        return this.loadedConfig;
    }
}
interface IConfig {
    root: string;
    excelConfig: Excel.IConfig;
}


export default WingToolBox;

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
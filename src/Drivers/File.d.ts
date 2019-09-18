import { SessionDriverContract, SessionConfigContract } from '@ioc:Adonis/Addons/Session';
export declare class FileDriver implements SessionDriverContract {
    private _config;
    constructor(_config: SessionConfigContract);
    private _getFilePath;
    read(sessionId: string): Promise<string>;
    write(sessionId: string, value: any): Promise<void>;
    destroy(sessionId: string): Promise<void>;
}

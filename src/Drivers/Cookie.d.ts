/// <reference path="../../adonis-typings/session.d.ts" />
import { HttpContextContract } from '@poppinss/http-server';
import { SessionDriverContract, SessionConfigContract } from '@ioc:Adonis/Addons/Session';
export declare class CookieDriver implements SessionDriverContract {
    private _config;
    private _ctx;
    constructor(_config: SessionConfigContract, _ctx: HttpContextContract);
    read(sessionId: string): Promise<string>;
    write(sessionId: string, value: string): Promise<void>;
    destroy(sessionId: string): Promise<void>;
}

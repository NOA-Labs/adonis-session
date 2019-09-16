/// <reference path="../../adonis-typings/session.d.ts" />
import { HttpContextContract } from '@poppinss/http-server';
import { SessionConfigContract, SessionDriverContract, SessionContract, AllowedSessionValues } from '@ioc:Adonis/Addons/Session';
export declare class Session implements SessionContract {
    private _config;
    private _ctx;
    private _driver;
    initiated: boolean;
    fresh: boolean;
    readonly: boolean;
    sessionId: string;
    private _store;
    private _regenerate;
    constructor(_config: SessionConfigContract, _ctx: HttpContextContract, _driver: SessionDriverContract);
    private _getSessionId;
    private _ensureIsReady;
    initiate(readonly: boolean): Promise<void>;
    regenerate(): void;
    put(key: string, value: AllowedSessionValues): void;
    get(key: string, defaultValue?: any): any;
    all(): any;
    forget(key: string): void;
    pull(key: string, defaultValue?: any): any;
    increment(key: string, steps?: number): any;
    decrement(key: string, steps?: number): any;
    clear(): void;
    commit(): Promise<void>;
}

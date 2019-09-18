import { IocContract } from '@adonisjs/fold';
import { HttpContextContract } from '@poppinss/http-server';
import { SessionConfigContract, SessionDriverCallback, SessionManagerContract } from '@ioc:Adonis/Addons/Session';
import { Session } from '../Session';
export declare class SessionManager implements SessionManagerContract {
    private _container;
    private _config;
    private _extendedDrivers;
    constructor(_container: IocContract, _config: SessionConfigContract);
    private _createDriver;
    create(ctx: HttpContextContract): Session;
    extend(driver: string, callback: SessionDriverCallback): void;
}

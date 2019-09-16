declare module '@ioc:Adonis/Addons/Session' {
    import { ObjectID } from 'bson';
    import { IocContract } from '@adonisjs/fold';
    import { CookieOptions } from '@poppinss/cookie';
    import { HttpContextContract } from '@poppinss/http-server';
    interface SessionConfigContract {
        driver: string;
        cookieName: string;
        clearWithBrowser: boolean;
        age: string | number;
        cookie: Omit<Partial<CookieOptions>, 'maxAge'>;
        file?: {
            location: string;
        };
        redis?: {
            host: string;
            port: number;
            password?: string;
            db?: string;
            keyPrefix?: string;
        } & {
            [key: string]: any;
        };
    }
    interface SessionDriverContract {
        read(sessionId: string): Promise<string>;
        write(sessionId: string, value: string): Promise<void>;
        destroy(sessionId: string): Promise<void>;
    }
    type SessionDriverCallback = (container: IocContract, config: SessionConfigContract, ctx: HttpContextContract) => SessionDriverContract;
    type AllowedSessionValues = string | boolean | number | object | Date | Array<any> | ObjectID;
    interface SessionContract {
        initiated: boolean;
        readonly: boolean;
        fresh: boolean;
        sessionId: string;
        initiate(readonly: boolean): Promise<void>;
        commit(): Promise<void>;
        regenerate(): void;
        put(key: string, value: AllowedSessionValues): void;
        get(key: string, defaultValue?: any): any;
        all(): any;
        forget(key: string): void;
        pull(key: string, defaultValue?: any): any;
        increment(key: string, steps?: number): any;
        decrement(key: string, steps?: number): any;
        clear(): void;
    }
    interface SessionManagerContract {
        create(ctx: HttpContextContract): SessionContract;
        extend(driver: string, callback: CallableFunction): void;
    }
}

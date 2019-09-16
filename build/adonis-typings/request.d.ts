/// <reference path="session.d.ts" />
import { SessionContract } from '@ioc:Adonis/Addons/Session';
declare module '@ioc:Adonis/Core/HttpContext' {
    interface HttpContextContract {
        session: SessionContract;
    }
}

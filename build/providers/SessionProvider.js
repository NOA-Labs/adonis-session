"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionManager_1 = require("../src/SessionManager");
class SessionProvider {
    constructor($container) {
        this.$container = $container;
    }
    register() {
        this.$container.singleton('Adonis/Addons/SessionManager', () => {
            const Config = this.$container.use('Adonis/Core/Config');
            return new SessionManager_1.SessionManager(this.$container, Config.get('session'));
        });
    }
    boot() {
        this.$container.with(['Adonis/Core/Server', 'Adonis/Addons/SessionManager'], (Server, Session) => {
            Server.before(async (ctx) => {
                ctx.session = Session.create(ctx);
                await ctx.session.initiate(false);
            });
            Server.after(async (ctx) => {
                await ctx.session.commit();
            });
        });
    }
}
exports.default = SessionProvider;

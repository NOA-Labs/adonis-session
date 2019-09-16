"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ms = require("ms");
const test = require("japa");
const http_1 = require("http");
const fold_1 = require("@adonisjs/fold");
const supertest = require("supertest");
const http_server_1 = require("@poppinss/http-server");
const SessionManager_1 = require("../src/SessionManager");
const SECRET = Math.random().toFixed(36).substring(2, 38);
const config = {
    driver: 'cookie',
    cookieName: 'adonis-session',
    clearWithBrowser: false,
    age: '2h',
    cookie: {
        path: '/',
    },
};
test.group('Session Manager', () => {
    test('do not set expiry clearWithBrowser is true', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const manager = new SessionManager_1.SessionManager(new fold_1.Ioc(), Object.assign({}, config, { clearWithBrowser: true }));
            const session = manager.create(ctx);
            await session.initiate(false);
            session.put('user', { username: 'virk' });
            await session.commit();
            ctx.response.send('');
        });
        const { headers } = await supertest(server).get('/');
        assert.lengthOf(headers['set-cookie'][0].split(';'), 2);
    });
    test('set expiry when clearWithBrowser is false', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const manager = new SessionManager_1.SessionManager(new fold_1.Ioc(), config);
            const session = manager.create(ctx);
            await session.initiate(false);
            session.put('user', { username: 'virk' });
            await session.commit();
            ctx.response.send('');
        });
        const { headers } = await supertest(server).get('/');
        assert.lengthOf(headers['set-cookie'][0].split(';'), 3);
        const expires = headers['set-cookie'][0].split(';')[2].replace('Expires=', '');
        assert.equal(ms(Date.parse(expires) - Date.now()), '2h');
    });
});

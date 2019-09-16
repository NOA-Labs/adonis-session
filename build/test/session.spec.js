"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("japa");
const supertest = require("supertest");
const http_1 = require("http");
const http_server_1 = require("@poppinss/http-server");
const cookie_1 = require("@poppinss/cookie");
const Store_1 = require("../src/Store");
const Session_1 = require("../src/Session");
const Memory_1 = require("../src/Drivers/Memory");
const SECRET = Math.random().toFixed(36).substring(2, 38);
const config = {
    driver: 'cookie',
    cookieName: 'adonis-session',
    clearWithBrowser: false,
    age: 3000,
    cookie: {
        path: '/',
    },
};
test.group('Session', (group) => {
    group.afterEach(() => {
        Memory_1.MemoryDriver.sessions.clear();
    });
    test('initiate session with fresh session id when there isn\'t session', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            assert.isTrue(session.fresh);
            assert.isTrue(session.initiated);
            res.end();
        });
        await supertest(server).get('/');
    });
    test('initiate session with empty store when session id exists', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            assert.isFalse(session.fresh);
            assert.equal(session.sessionId, '1234');
            assert.isTrue(session.initiated);
            res.end();
        });
        await supertest(server).get('/').set('cookie', cookie_1.serialize(config.cookieName, '1234', SECRET));
    });
    test('write session values with driver on commit', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            session.put('user', { username: 'virk' });
            await session.commit();
            ctx.response.send('');
        });
        const { headers } = await supertest(server).get('/');
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.property(cookies.signedCookies, config.cookieName);
        const session = Memory_1.MemoryDriver.sessions.get(cookies.signedCookies[config.cookieName]);
        assert.deepEqual(new Store_1.Store(session).all(), { user: { username: 'virk' } });
    });
    test('re-use existing session id', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            session.put('user', { username: 'virk' });
            await session.commit();
            ctx.response.send('');
        });
        const { headers } = await supertest(server)
            .get('/')
            .set('cookie', cookie_1.serialize(config.cookieName, '1234', SECRET));
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.equal(cookies.signedCookies[config.cookieName], '1234');
        const session = Memory_1.MemoryDriver.sessions.get('1234');
        assert.deepEqual(new Store_1.Store(session).all(), { user: { username: 'virk' } });
    });
    test('retain driver existing values', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            session.put('user.username', 'virk');
            await session.commit();
            ctx.response.send('');
        });
        const store = new Store_1.Store('');
        store.set('user.age', 22);
        Memory_1.MemoryDriver.sessions.set('1234', store.toString());
        const { headers } = await supertest(server)
            .get('/')
            .set('cookie', cookie_1.serialize(config.cookieName, '1234', SECRET));
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.equal(cookies.signedCookies[config.cookieName], '1234');
        const session = Memory_1.MemoryDriver.sessions.get('1234');
        assert.deepEqual(new Store_1.Store(session).all(), { user: { username: 'virk', age: 22 } });
    });
    test('regenerate session id when regenerate method is called', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            session.regenerate();
            session.put('user.username', 'virk');
            await session.commit();
            ctx.response.send('');
        });
        const store = new Store_1.Store('');
        store.set('user.age', 22);
        Memory_1.MemoryDriver.sessions.set('1234', store.toString());
        const { headers } = await supertest(server)
            .get('/')
            .set('cookie', cookie_1.serialize(config.cookieName, '1234', SECRET));
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.notEqual(cookies.signedCookies[config.cookieName], '1234');
        const session = Memory_1.MemoryDriver.sessions.get(cookies.signedCookies[config.cookieName]);
        assert.deepEqual(new Store_1.Store(session).all(), { user: { username: 'virk', age: 22 } });
        assert.isUndefined(Memory_1.MemoryDriver.sessions.get('1234'));
    });
    test('remove session values when the store is empty', async (assert) => {
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            ctx.response['_config'].secret = SECRET;
            const driver = new Memory_1.MemoryDriver();
            const session = new Session_1.Session(config, ctx, driver);
            await session.initiate(false);
            session.forget('user');
            await session.commit();
            ctx.response.send('');
        });
        const store = new Store_1.Store('');
        store.set('user.age', 22);
        Memory_1.MemoryDriver.sessions.set('1234', store.toString());
        const { headers } = await supertest(server)
            .get('/')
            .set('cookie', cookie_1.serialize(config.cookieName, '1234', SECRET));
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.equal(cookies.signedCookies[config.cookieName], '1234');
        assert.isUndefined(Memory_1.MemoryDriver.sessions.get('1234'));
    });
});

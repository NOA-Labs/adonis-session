"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("japa");
const supertest = require("supertest");
const http_1 = require("http");
const http_server_1 = require("@poppinss/http-server");
const cookie_1 = require("@poppinss/cookie");
const Cookie_1 = require("../src/Drivers/Cookie");
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
test.group('Cookie driver', () => {
    test('return empty string when cookie is missing', async (assert) => {
        const sessionId = '1234';
        const server = http_1.createServer(async (req, res) => {
            const session = new Cookie_1.CookieDriver(config, http_server_1.HttpContext.create('/', {}, req, res));
            const value = await session.read(sessionId);
            res.write(value);
            res.end();
        });
        const { text } = await supertest(server).get('/');
        assert.equal(text, '');
    });
    test('return empty string when cookie value is not signed', async (assert) => {
        const sessionId = '1234';
        const server = http_1.createServer(async (req, res) => {
            const session = new Cookie_1.CookieDriver(config, http_server_1.HttpContext.create('/', {}, req, res));
            const value = await session.read(sessionId);
            res.write(value);
            res.end();
        });
        const { text } = await supertest(server)
            .get('/')
            .set('cookie', '1234=hello-world');
        assert.equal(text, '');
    });
    test('return cookie value as string', async (assert) => {
        const sessionId = '1234';
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.request['_config'].secret = SECRET;
            const session = new Cookie_1.CookieDriver(config, ctx);
            const value = await session.read(sessionId);
            res.write(value);
            res.end();
        });
        const { text } = await supertest(server)
            .get('/')
            .set('cookie', cookie_1.serialize('1234', 'hello-world', SECRET));
        assert.equal(text, 'hello-world');
    });
    test('write cookie value', async (assert) => {
        const sessionId = '1234';
        const server = http_1.createServer(async (req, res) => {
            const ctx = http_server_1.HttpContext.create('/', {}, req, res);
            ctx.response['_config'].secret = SECRET;
            const session = new Cookie_1.CookieDriver(config, ctx);
            session.write(sessionId, 'hello-world');
            ctx.response.send('');
        });
        const { headers } = await supertest(server).get('/');
        const cookies = cookie_1.parse(headers['set-cookie'][0].split(';')[0], SECRET);
        assert.deepEqual(cookies, {
            signedCookies: { 1234: 'hello-world' },
            plainCookies: {},
        });
    });
});

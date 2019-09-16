"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = require("@ioc:Adonis/Core/Env");
const config = {
    driver: 'cookie',
    cookieName: 'adonis-session',
    clearWithBrowser: false,
    age: '2h',
    cookie: {
        path: '/',
        httpOnly: true,
        sameSite: false,
    },
    file: {
        location: '',
    },
    redis: {
        host: Env_1.default.get('REDIS_HOST', '127.0.0.1'),
        port: Number(Env_1.default.get('REDIS_PORT', 6379)),
    },
};
exports.default = config;

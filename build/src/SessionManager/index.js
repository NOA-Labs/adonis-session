"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@poppinss/utils");
const ms = require("ms");
const Session_1 = require("../Session");
const Cookie_1 = require("../Drivers/Cookie");
class SessionManager {
    constructor(_container, _config) {
        this._container = _container;
        this._config = _config;
        this._extendedDrivers = new Map();
        if (!this._config.clearWithBrowser) {
            const age = typeof (this._config.age) === 'string' ? ms(this._config.age) : this._config.age;
            this._config.cookie.expires = new Date(Date.now() + age);
        }
        else {
            delete this._config.cookie.expires;
        }
    }
    _createDriver(ctx) {
        if (this._config.driver === 'cookie') {
            return new Cookie_1.CookieDriver(this._config, ctx);
        }
        if (this._extendedDrivers.has(this._config.driver)) {
            return this._extendedDrivers.get(this._config.driver)(this._container, this._config, ctx);
        }
        throw new utils_1.Exception(`${this._config.driver} is not a valid session driver`, 500, 'E_INVALID_SESSION_DRIVER');
    }
    create(ctx) {
        return new Session_1.Session(this._config, ctx, this._createDriver(ctx));
    }
    extend(driver, callback) {
        this._extendedDrivers.set(driver, callback);
    }
}
exports.SessionManager = SessionManager;

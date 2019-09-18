"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const utils_1 = require("@poppinss/utils");
const Store_1 = require("../Store");
class Session {
    constructor(_config, _ctx, _driver) {
        this._config = _config;
        this._ctx = _ctx;
        this._driver = _driver;
        this.initiated = false;
        this.fresh = false;
        this.readonly = false;
        this.sessionId = this._getSessionId();
        this._regenerate = false;
    }
    _getSessionId() {
        const sessionId = this._ctx.request.get()[this._config.cookieName] &&
            this._ctx.request.cookie(this._config.cookieName);
        if (sessionId) {
            return sessionId;
        }
        this.fresh = true;
        return crypto_1.randomBytes(16).toString('hex');
    }
    _ensureIsReady() {
        if (!this.initiated) {
            throw new utils_1.Exception('Session store is not initiated yet. Make sure you are using session hook', 500, 'E_RUNTIME_EXCEPTION');
        }
        if (this.readonly) {
            throw new utils_1.Exception('Session store is in readonly mode and cannot be mutated', 500, 'E_RUNTIME_EXCEPTION');
        }
    }
    async initiate(readonly) {
        if (this.initiated) {
            return;
        }
        this.initiated = true;
        this.readonly = readonly;
        const contents = await this._driver.read(this.sessionId);
        this._store = new Store_1.Store(contents);
    }
    regenerate() {
        this._regenerate = true;
    }
    put(key, value) {
        this._ensureIsReady();
        this._store.set(key, value);
    }
    get(key, defaultValue) {
        this._ensureIsReady();
        return this._store.get(key, defaultValue);
    }
    all() {
        this._ensureIsReady();
        return this._store.all();
    }
    forget(key) {
        this._ensureIsReady();
        this._store.unset(key);
    }
    pull(key, defaultValue) {
        return (value => {
            this.forget(key);
            return value;
        })(this.get(key, defaultValue));
    }
    increment(key, steps = 1) {
        this._ensureIsReady();
        const value = this._store.get(key, 0);
        if (typeof value !== 'number') {
            throw new utils_1.Exception(`Cannot increment ${key}, since original value is not a number`);
        }
        this._store.set(key, value + steps);
    }
    decrement(key, steps = 1) {
        this._ensureIsReady();
        const value = this._store.get(key, 0);
        if (typeof value !== 'number') {
            throw new utils_1.Exception(`Cannot decrement ${key}, since original value is not a number`);
        }
        this._store.set(key, value - steps);
    }
    clear() {
        this._ensureIsReady();
        this._store.clear();
    }
    async commit() {
        if (this._regenerate) {
            await this._driver.destroy(this.sessionId);
            this.sessionId = crypto_1.randomBytes(16).toString('hex');
        }
        this._ctx.response.cookie(this._config.cookieName, this.sessionId, this._config.cookie);
        const sessionValue = this._store.toString();
        if (sessionValue === '{}') {
            await this._driver.destroy(this.sessionId);
            return;
        }
        await this._driver.write(this.sessionId, this._store.toString());
    }
}
exports.Session = Session;

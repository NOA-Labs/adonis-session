"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CookieDriver {
    constructor(_config, _ctx) {
        this._config = _config;
        this._ctx = _ctx;
    }
    async read(sessionId) {
        const cookieValue = this._ctx.request.cookie(sessionId);
        return cookieValue || '';
    }
    async write(sessionId, value) {
        this._ctx.response.cookie(sessionId, value, this._config.cookie);
    }
    async destroy(sessionId) {
        this._ctx.response.clearCookie(sessionId);
    }
}
exports.CookieDriver = CookieDriver;

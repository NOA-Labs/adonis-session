"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
class FileDriver {
    constructor(_config) {
        this._config = _config;
    }
    _getFilePath(sessionId) {
        return path_1.join(this._config.file.location, `${sessionId}.txt`);
    }
    async read(sessionId) {
        await fs_extra_1.ensureFile(this._getFilePath(sessionId));
        const contents = await fs_extra_1.readFile(this._getFilePath(sessionId), 'utf-8');
        return contents.trim();
    }
    async write(sessionId, value) {
        await fs_extra_1.outputFile(this._getFilePath(sessionId), value);
    }
    async destroy(sessionId) {
        await fs_extra_1.remove(this._getFilePath(sessionId));
    }
}
exports.FileDriver = FileDriver;

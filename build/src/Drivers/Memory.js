"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryDriver {
    async read(sessionId) {
        return MemoryDriver.sessions.get(sessionId) || '';
    }
    async write(sessionId, value) {
        MemoryDriver.sessions.set(sessionId, value);
    }
    async destroy(sessionId) {
        MemoryDriver.sessions.delete(sessionId);
    }
}
MemoryDriver.sessions = new Map();
exports.MemoryDriver = MemoryDriver;

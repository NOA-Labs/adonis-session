"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("japa");
const dev_utils_1 = require("@poppinss/dev-utils");
const path_1 = require("path");
const File_1 = require("../src/Drivers/File");
const fs = new dev_utils_1.Filesystem();
const config = {
    driver: 'cookie',
    cookieName: 'adonis-session',
    clearWithBrowser: false,
    age: 3000,
    cookie: {},
    file: {
        location: fs.basePath,
    },
};
test.group('File driver', (group) => {
    group.afterEach(async () => {
        await fs.cleanup();
    });
    test('return empty string when file is missing', async (assert) => {
        const sessionId = '1234';
        const session = new File_1.FileDriver(config);
        const value = await session.read(sessionId);
        assert.equal(value, '');
    });
    test('write session value to the file', async (assert) => {
        const sessionId = '1234';
        const session = new File_1.FileDriver(config);
        await session.write(sessionId, 'hello-world');
        const contents = await fs.get('1234.txt');
        assert.equal(contents.trim(), 'hello-world');
    });
    test('get session existing value', async (assert) => {
        const sessionId = '1234';
        const session = new File_1.FileDriver(config);
        await session.write(sessionId, 'hello-world');
        const value = await session.read(sessionId);
        assert.equal(value, 'hello-world');
    });
    test('remove session file', async (assert) => {
        const sessionId = '1234';
        const session = new File_1.FileDriver(config);
        await session.write(sessionId, 'hello-world');
        await session.destroy(sessionId);
        const exists = await fs.fsExtra.exists(path_1.join(fs.basePath, '1234.txt'));
        assert.isFalse(exists);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = require("japa");
const bson_1 = require("bson");
const Store_1 = require("../src/Store");
test.group('Store', () => {
    test('return empty JSON string for empty store', (assert) => {
        const store = new Store_1.Store('{}');
        assert.equal(store.toString(), '{}');
    });
    test('mutate values inside store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('username', 'virk');
        assert.equal(store.toString(), JSON.stringify({ username: { t: 'String', d: 'virk' } }));
    });
    test('mutate nested values inside store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('user.username', 'virk');
        assert.equal(store.toString(), JSON.stringify({ user: { t: 'Object', d: { username: 'virk' } } }));
    });
    test('remove value from store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('user.username', 'virk');
        store.unset('user.username');
        assert.equal(store.toString(), JSON.stringify({ user: { t: 'Object', d: {} } }));
    });
    test('add numbers to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('age', 22);
        assert.deepEqual(new Store_1.Store(store.toString()).all(), { age: 22 });
    });
    test('add boolean to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('admin', false);
        store.set('guest', true);
        assert.deepEqual(new Store_1.Store(store.toString()).all(), { admin: false, guest: true });
    });
    test('add object to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('user', { username: 'virk' });
        assert.deepEqual(new Store_1.Store(store.toString()).all(), { user: { username: 'virk' } });
    });
    test('add arrays to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('users', [{ username: 'virk' }]);
        assert.deepEqual(new Store_1.Store(store.toString()).all(), { users: [{ username: 'virk' }] });
    });
    test('add date to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('created_at', new Date());
        assert.instanceOf(new Store_1.Store(store.toString()).all().created_at, Date);
    });
    test('add object id to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('user_id', new bson_1.ObjectId('123456789012'));
        assert.instanceOf(new Store_1.Store(store.toString()).all().user_id, bson_1.ObjectId);
    });
    test('add legacy object id to session store', (assert) => {
        const store = new Store_1.Store('{}');
        store.set('user_id', new bson_1.ObjectID('123456789012'));
        assert.instanceOf(new Store_1.Store(store.toString()).all().user_id, bson_1.ObjectId);
    });
});

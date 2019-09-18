"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const Typeof = require("type-of-is");
const lodash_1 = require("lodash");
const utils_1 = require("@poppinss/utils");
const toString = {
    'Number'(value) {
        return value;
    },
    'Boolean'(value) {
        return value;
    },
    'Object'(value) {
        return value;
    },
    'Array'(value) {
        return value;
    },
    'Date'(value) {
        return String(value);
    },
    'String'(value) {
        return value;
    },
    'ObjectID'(value) {
        return String(value);
    },
    'ObjectId'(value) {
        return String(value);
    },
};
const toOriginalType = {
    'Number'(value) {
        return value;
    },
    'Object'(value) {
        return value;
    },
    'Array'(value) {
        return value;
    },
    'Boolean'(value) {
        return value;
    },
    'Date'(value) {
        return new Date(value);
    },
    'String'(value) {
        return value;
    },
    'ObjectID'(value) {
        return new bson_1.ObjectId(value);
    },
    'ObjectId'(value) {
        return new bson_1.ObjectId(value);
    },
};
class Store {
    constructor(value) {
        this._values = {};
        this._values = this._cast(value);
    }
    _castValue(value) {
        if (value && value.d !== undefined && value.t) {
            return toOriginalType[value.t](value.d);
        }
        return null;
    }
    _cast(value) {
        try {
            const parsed = JSON.parse(value);
            return Object.keys(parsed).reduce((result, key) => {
                const castedValue = this._castValue(parsed[key]);
                if (!lodash_1.isNil(castedValue)) {
                    result[key] = castedValue;
                }
                return result;
            }, {});
        }
        catch (error) {
            return {};
        }
    }
    _serializeValue(value) {
        const type = Typeof.string(value);
        if (!toString[type]) {
            throw new utils_1.Exception(`${type} data type cannot be saved into session`, 500, 'E_UNALLOWED_SESSION_DATA_TYPE');
        }
        return {
            t: type,
            d: toString[type](value),
        };
    }
    _serialize() {
        return Object.keys(this._values).reduce((result, key) => {
            const serializedValue = this._serializeValue(this._values[key]);
            if (!lodash_1.isNil(serializedValue)) {
                result[key] = serializedValue;
            }
            return result;
        }, {});
    }
    toJSON() {
        return this._serialize();
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    set(key, value) {
        lodash_1.set(this._values, key, value);
    }
    all() {
        return this._values;
    }
    get(key, defaultValue) {
        return lodash_1.get(this._values, key, defaultValue);
    }
    unset(key) {
        lodash_1.unset(this._values, key);
    }
    clear() {
        this._values = {};
    }
}
exports.Store = Store;

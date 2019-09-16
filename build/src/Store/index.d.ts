import { AllowedSessionValues } from '@ioc:Adonis/Addons/Session';
export declare class Store {
    private _values;
    constructor(value: string);
    private _castValue;
    private _cast;
    private _serializeValue;
    private _serialize;
    toJSON(): any;
    toString(): string;
    set(key: string, value: AllowedSessionValues): void;
    all(): any;
    get(key: string, defaultValue?: any): any;
    unset(key: string): void;
    clear(): void;
}

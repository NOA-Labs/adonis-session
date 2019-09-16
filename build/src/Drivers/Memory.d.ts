import { SessionDriverContract } from '@ioc:Adonis/Addons/Session';
export declare class MemoryDriver implements SessionDriverContract {
    static sessions: Map<string, string>;
    read(sessionId: string): Promise<string>;
    write(sessionId: string, value: string): Promise<void>;
    destroy(sessionId: string): Promise<void>;
}

export abstract class IStorage {
    public abstract init(): Promise<void>;
    public abstract destroy(key: string): Promise<any> ;
    public abstract clear(): Promise<any> ;
    public abstract set(key: string, value: any): Promise<any> ;
    public abstract get(key: string): Promise<any>;
}

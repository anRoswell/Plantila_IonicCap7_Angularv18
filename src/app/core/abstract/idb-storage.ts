import { IResponseApi } from "../interfaces/IResponseApi";

export abstract class IDbStorage {
    public abstract query(sql: string): Promise<IResponseApi>;
    public abstract run(query: string, sql: any): Promise<IResponseApi>;
    public abstract createTable(sql: string): Promise<IResponseApi>;
    public abstract initializePlugin(): Promise<boolean>;
    public abstract getPlatform(): string;
    public abstract initWebStore(): Promise<void>;
    public abstract initializeDatabase(version: number): Promise<void>;
}

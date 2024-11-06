import { IResponseApi } from "../interfaces/IResponseApi";

export abstract class IQueryDb {
    public abstract insert(tableName: string, data: any): Promise<IResponseApi>;
  public abstract update(tableName: string, data: any, filter: any): Promise<IResponseApi>;
  public abstract select(tableName: string, field: any, filter: any): Promise<IResponseApi>;
  public abstract delete(tableName: string, filter: any): Promise<IResponseApi>;
  public abstract deleteAll(tableName: string): Promise<IResponseApi>;
}

import { IResponseApi } from "../interfaces/IResponseApi";

export abstract class IDbGeneric {
    public abstract init(): Promise<IResponseApi>;
    public abstract getAll(field: any): Promise<IResponseApi>;
    protected abstract _get(filter: any, field: any): Promise<IResponseApi>;
    protected abstract _delete(object: any): Promise<IResponseApi>;
    protected abstract _insert(object: any): Promise<IResponseApi>;
    protected abstract _update(object: any, filter: any): Promise<IResponseApi>;
}

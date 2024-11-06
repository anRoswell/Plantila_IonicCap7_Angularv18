import { IResponseApi } from "../interfaces/IResponseApi";

export abstract class ILogger {
    public logs: any;
    public abstract info(message: string): void;
    public abstract warning(warning: string): void;
    public abstract error(error: string): IResponseApi;
}

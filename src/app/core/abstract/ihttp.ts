import { Observable } from "rxjs";
import { IResponseApi } from "../interfaces/IResponseApi";
import { HttpParams } from "@angular/common/http";

export abstract class IHttp {
    public abstract get(endPoint: string, showUserInteractions?: boolean): Observable<IResponseApi>;
    public abstract getParams(endPoint: string, params: HttpParams, showUserInteractions?: boolean): Observable<IResponseApi>;
    public abstract post(endPoint: string, body: Object, showUserInteractions?: boolean): Observable<IResponseApi>;
    public abstract put(endPoint: string,body: Object, showUserInteractions?: boolean): Observable<IResponseApi>;
    public abstract delete(endPoint: string, id: number, showUserInteractions?: boolean ): Observable<IResponseApi>;
}

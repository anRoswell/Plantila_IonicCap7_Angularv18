import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent,HttpHandler,HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IRequest } from '../interfaces/IRequest';
import { TypeResponse } from '../enums/TypeResponse';

@Injectable()
export class ThrottleInterceptor implements HttpInterceptor
{
    requests: { [key: string]: IRequest } = {};
    throttleDuration = 1000;
    message = 'Se detectó múltiples solicitudes, espere unos segundos antes de intentar de nuevo.'

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const checkRequest = this._checkRequest(req);

        if (!checkRequest) {
            return throwError(() => new HttpErrorResponse({ 
                error: new Error(this.message),
                status: TypeResponse.TOO_MANY_REQUEST
            }));
        }
        
        return next.handle(req);
    }

    private _checkRequest(req: HttpRequest<any>): boolean {
        const currentRequestTime = new Date().getTime();
        const currentRequest = this.requests[req.url];

        if (currentRequest) {
            if ((currentRequestTime - currentRequest.lastRequestTime) < this.throttleDuration) {
                return false
            }
        
            this.requests[req.url].lastRequestTime = currentRequestTime;
        } else {
            this.requests[req.url] = {
                url: req.url,
                lastRequestTime: currentRequestTime,
            }
        }

        return true;
    }
}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IStorage } from '../abstract/istorage';
import { TypeStore } from '../enums/TypeStore';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private storage: IStorage,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.storage.get(TypeStore.TOKEN)).pipe(
      switchMap((token) => {        
        if (token) {
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
        }

        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              token = event.headers.get('Authorization');

              if (token) {
                this.storage.set(TypeStore.TOKEN, token);
              }
            }

            return event;
          })
        );
      })
    );
  }
}

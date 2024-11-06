import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { IUserInteraction } from '../abstract/iuser-interaction';

export const SHOW_INTERACTION = new HttpContextToken<boolean>(() => true);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requests: { request: HttpRequest<any>, identifier: number }[] = [];

  constructor(private userInteractionService: IUserInteraction) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const identifier = Math.random(); // Genera un identificador único
    request = request.clone({ setHeaders: { 'X-Request-Identifier': identifier.toString() } });
    this.requests.push({ request, identifier });

    if (request.context.get(SHOW_INTERACTION)) {
      this.userInteractionService.showLoading();
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this._removeRequest(request);
        throw error;
      }),
      finalize(() => {
        this._removeRequest(request);
      })
    );
  }

  private _removeRequest(request: HttpRequest<any>) {
    const i = this.requests.findIndex(entry => entry.request === request);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    setTimeout(async () => {
      if (this.requests.length === 0) {
        await this.userInteractionService.dismissLoading();
      }
    }, 300);
  }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent,HttpHandler,HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticateService } from '../services/auth/authenticate.service';
import { UserInteractionService } from '../services/general/user-interaction-service.service';
import { TypeThemeColor } from '../enums/TypeThemeColor';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor
{
    constructor(
        private authenticateService: AuthenticateService,
        private userInteractionService: UserInteractionService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => {
                    const messageError = this._handleError(error);
                    this._showMessage(messageError);
                    this._actionError(error);

                    // devuelve a la vista
                    return new HttpResponse({
                        status: error.status,
                        body: error,
                    });
                });
            }));
    }

    private _handleError(error: HttpErrorResponse): string {
        let errorMessage = 'Error de conexión al servidor';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.message ?? 'Ocurrio un error en la solicitud'}`;
        } else {
            // Error del lado del servidor
            switch (error.status) {
                case 401:
                    errorMessage = `Error codigo: ${error.status} Mensaje: Sin autorización para acceder a este contenido`;
                    break;
                case 403:
                    errorMessage = `Error codigo: ${error.status} Mensaje: Sin autorización para acceder a este contenido`;
                    break;
                default: 
                    errorMessage = `Error codigo: ${error.status} Mensaje: ${error?.error?.mensaje ?? (error?.message ?? 'Ocurrio un error en la solicitud')}`;
                    break;
            }
        }

        return errorMessage;
    }

    private _actionError(error: HttpErrorResponse): void {
        switch (error.status) {
            case 401:
                this.authenticateService.logout$().subscribe((response)=>console.log(response));
                break;
            case 403:
                this.authenticateService.logout$().subscribe((response)=>console.log(response));
                break;
        }
    }

    private _showMessage(message: string) {
        this.userInteractionService.presentToast(
            message,
            TypeThemeColor.DANGER,
            10000
        );
    }
}


import { Observable, from, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';

// Interface
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { IHttp } from '../../abstract/ihttp';

// Environment
import { environment } from 'src/environments/environment';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { CheckConnectionService } from './check-connection.service';
import { TypeResponse } from '../../enums/TypeResponse';
import { SHOW_INTERACTION } from '../../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements IHttp {
  httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private checkConnectionService: CheckConnectionService
  ) {}

  get(
    endPoint: string,
    showUserInteractions = true
  ): Observable<IResponseApi> {
    const context = new HttpContext().set(
      SHOW_INTERACTION,
      showUserInteractions
    );

    return from(this.checkConnectionService.check()).pipe(
      switchMap((checkConnection) => {
        if (checkConnection.estado !== TypeResponse.OK) {
          return of(checkConnection);
        }
        const BASEURL = environment.urlServer;
        const APIREST = `${ BASEURL }${endPoint}`;
        return this.http
          .get<IResponseApi>(APIREST, { context })
          .pipe(tap((resp) => of(resp)));
      })
    );
  }

  getParams(
    endPoint: string,
    params: HttpParams,
    showUserInteractions = true
  ): Observable<IResponseApi> {
    const context = new HttpContext().set(
      SHOW_INTERACTION,
      showUserInteractions
    );

    return from(this.checkConnectionService.check()).pipe(
      switchMap((checkConnection) => {
        if (checkConnection.estado !== TypeResponse.OK) {
          return of(checkConnection);
        }
        const BASEURL = environment.urlServer;
        const APIREST = `${BASEURL}${endPoint}`;
        return this.http
          .get<IResponseApi>(APIREST, {
            params,
            headers: this.httpOptions.headers,
            context,
          })
          .pipe(tap((resp) => of(resp)));
      })
    );
  }

  post(
    endPoint: string,
    body: Object,
    showUserInteractions = true
  ): Observable<IResponseApi> {
    const context = new HttpContext().set(
      SHOW_INTERACTION,
      showUserInteractions
    );

    return from(this.checkConnectionService.check()).pipe(
      switchMap((checkConnection) => {
        if (checkConnection.estado !== TypeResponse.OK) {
          return of(checkConnection);
        }
        const BASEURL = environment.urlServer;
        const APIREST = `${BASEURL}${endPoint}`;
        return this.http
          .post<IResponseApi>(`${APIREST}`, JSON.stringify(body), {
            headers: this.httpOptions.headers,
            context,
          })
          .pipe(tap((resp) => of(resp)));
      })
    );
  }

  put(
    endPoint: string,
    body: Object,
    showUserInteractions = true
  ): Observable<IResponseApi> {
    const context = new HttpContext().set(
      SHOW_INTERACTION,
      showUserInteractions
    );

    return from(this.checkConnectionService.check()).pipe(
      switchMap((checkConnection) => {
        if (checkConnection.estado !== TypeResponse.OK) {
          return of(checkConnection);
        }
        const BASEURL = environment.urlServer;
        const APIREST = `${BASEURL}${endPoint}`;
        return this.http
          .put<IResponseApi>(`${APIREST}`, JSON.stringify(body), {
            headers: this.httpOptions.headers,
            context,
          })
          .pipe(tap((resp) => of(resp)));
      })
    );
  }

  delete(
    endPoint: string,
    id: number,
    showUserInteractions = true
  ): Observable<IResponseApi> {
    const context = new HttpContext().set(
      SHOW_INTERACTION,
      showUserInteractions
    );

    return from(this.checkConnectionService.check()).pipe(
      switchMap((checkConnection) => {
        if (checkConnection.estado !== TypeResponse.OK) {
          return of(checkConnection);
        }
        const BASEURL = environment.urlServer;
        const APIREST = `${BASEURL}${endPoint}${id}`;
        return this.http
          .put<IResponseApi>(`${APIREST}`, {
            headers: this.httpOptions.headers,
            context,
          })
          .pipe(tap((resp) => of(resp)));
      })
    );
  }
}

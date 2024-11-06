import { Inject, Injectable } from '@angular/core';
import { Observable, from, map, of, switchMap, zip } from 'rxjs';

// Service
import {  
  IChangePassword,
  ILogin,
  ILogout,
  IRestoretPassword,
  IUser,
  IDevice,
} from '../../interfaces/IUser';
import { IStorage } from '../../abstract/istorage';
import { IHttp } from '../../abstract/ihttp';
import { TypeStore } from '../../enums/TypeStore';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { ISessionGeolocation } from '../../interfaces/IGeolocation';
import { TaskSchedulerService } from '../general/task-scheduler.service';
import { GpsService } from '../device/gps.service';
import { TypeResponse } from '../../enums/TypeResponse';
import { LocationStrategy } from '@angular/common';
import { IAuthenticate } from '../../abstract/iauthenticate';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService implements IAuthenticate {
  urlLogin = '/seguridad/iniciarSesion';
  urlLogout = '/seguridad/cerrarSesion';
  urlChangePassword = '/seguridad/cambiarClave';
  urlForgotPassword = '/seguridad/olvidoClave';
  urlRestorePassword = '/seguridad/restablecerClave';
  urlTokenDevice = '/seguridad/actualizarDispositivo';
  urlGpsLog = '/seguridad/registrarGeorreferencia';

  constructor(
    private storageService: IStorage,
    private httpService: IHttp,
    private taskSchedulerService: TaskSchedulerService,
    private gpsService: GpsService,
    private locationStrategy: LocationStrategy,
  ) {}

  login$(credentials: ILogin): Observable<IResponseApi> {
    return this.httpService.post(this.urlLogin, credentials).pipe(
      switchMap((resp: IResponseApi) => {
        const currentUser: IUser = resp.datos;
        return from(
          this.storageService.set(TypeStore.CURRENT_USER, currentUser)
        ).pipe(map(() => resp));
      })
    );
  }

  forgotPassword$(user: string): Observable<IResponseApi> {
    return this.httpService.get(this.urlForgotPassword + '/' + user);
  }

  restorePassword$(
    restorePassword: IRestoretPassword
  ): Observable<IResponseApi> {
    return this.httpService.put(this.urlRestorePassword, restorePassword);
  }

  logout$(): Observable<IResponseApi> {
    return zip([
      from(this.taskSchedulerService.executeInmediatly(true)),
      from(this.getCurrentUser()),
      from(this.gpsService.getCurrentPosition()),
    ]).pipe(
      switchMap(([ process, currentUser, coordinates ]) => {
        const logout: ILogout = {
          id_usuario: currentUser.id_usuario,
          georreferencia: {
            longitud: coordinates?.coords.longitude,
            latitud: coordinates?.coords.latitude,
          },
        };

        return this.httpService.put(this.urlLogout, logout);
      }),
      switchMap((response: IResponseApi) => {
        // sino hay conexion no se borran los datos del storage
        if (response.estado === TypeResponse.CONNECTION_ERROR) {
          return of(response);
        } else {
          return from(this.storageService.clear()).pipe(map(() => { 
            this.taskSchedulerService.cleasFunctions();
            return response;
          }));
        }
      })
    );
  }

  changePassword$(changePassword: IChangePassword): Observable<IResponseApi> {
    return this.httpService.put(this.urlChangePassword, changePassword);
  }

  registerTokenDevice$(device: IDevice): Observable<IResponseApi> {
    return this.httpService.put(this.urlTokenDevice, device);
  }

  gpsLog$(gpsLog: ISessionGeolocation): Observable<IResponseApi> {
    return this.httpService.post(this.urlGpsLog, gpsLog, false);
  }

  async getCurrentUser(): Promise<IUser> {
    const currentUser: IUser = await this.storageService.get(
      TypeStore.CURRENT_USER
    );
    
    if (!currentUser) {
      this.goLogin();
    }

    return currentUser;
  }

  async getToken(): Promise<string> {
    return await this.storageService.get(TypeStore.TOKEN);
  }

  goLogin()
  {
    this._forceReload('/login');
  }

  private _forceReload(route: string): void {
    const baseHref = this.locationStrategy.getBaseHref();
    const newRoute = baseHref.length > 1 ? baseHref + route : route;
    window.open(newRoute, '_self');
  }
}

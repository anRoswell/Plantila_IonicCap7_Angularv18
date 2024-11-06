import { Injectable, OnDestroy } from '@angular/core';

import {
  Subject,
  catchError,
  concatMap,
  filter,
  from,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { GpsService } from '../device/gps.service';
import { TaskSchedulerService } from '../general/task-scheduler.service';
import { DbGpsLogService } from 'src/app/services/db-gps-log.service';
import { ISessionGeolocation } from '../../interfaces/IGeolocation';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { TypeResponse } from '../../enums/TypeResponse';
import { IGpsLog } from 'src/app/interfaces/IGpsLog';
import { IAuthenticate } from '../../abstract/iauthenticate';
import { format } from 'date-fns';
import { TypeFormatDate } from '../../enums/TypeFormatDate';

@Injectable({
  providedIn: 'root',
})
export class GpsLogService implements OnDestroy {
  private timeInterval: number = 2 * 60 * 1000; // 2 minutos
  
  // suscriptions
  gpsLogSubject$ = new Subject<void>();

  constructor(
    private gpsService: GpsService,
    private dbGpsLogService: DbGpsLogService,
    private authenticateService: IAuthenticate,
    private taskSchedulerService: TaskSchedulerService
  ) {
    this.taskSchedulerService.addFunction(
      async () => await this.syncPendings()
    );
  }

  ngOnDestroy(): void {
    if (this.gpsLogSubject$) {
      this.gpsLogSubject$.next();
      this.gpsLogSubject$.complete();
    }
  }

  async startLogGps() {
    await this.dbGpsLogService.init();
    await this.countPendings();

    setInterval(async () => {
      await this.saveCoordinates();
      await this.countPendings();
    }, this.timeInterval);
  }

  async testGenerate() {
    const currentUser = await this.authenticateService.getCurrentUser();

    // sino esta logueado sale
    if (!currentUser) {
      return;
    }

    const coordinates = await this.gpsService.getCurrentPosition();
    const token = await this.authenticateService.getToken();

    if (coordinates) {
      const sessionGps: ISessionGeolocation = {
        fecha: format(new Date(), TypeFormatDate.API_DATETIME) ?? new Date().toLocaleDateString(),
        token,
        georreferencia: {
          longitud: coordinates?.coords.longitude,
          latitud: coordinates?.coords.latitude,
        },
      };
  
      const resultInsert = await this.dbGpsLogService.insert(sessionGps);
    }
  }

  async saveCoordinates(): Promise<void> {
    const currentUser = await this.authenticateService.getCurrentUser();

    // sino esta logueado sale
    if (!currentUser) {
      return;
    }

    const coordinates = await this.gpsService.getCurrentPosition();
    const token = await this.authenticateService.getToken();

    if (coordinates) {
      const sessionGps: ISessionGeolocation = {
        fecha: format(new Date(), TypeFormatDate.API_DATETIME) ?? new Date().toLocaleDateString(),
        token,
        georreferencia: {
          longitud: coordinates?.coords.longitude,
          latitud: coordinates?.coords.latitude,
        },
      };
  
      this.authenticateService
        .gpsLog$(sessionGps)
        .pipe(takeUntil(this.gpsLogSubject$))
        .subscribe({
          next: async (response: IResponseApi) => {
            if (response.estado !== TypeResponse.OK) {
              const resultInsert = await this.dbGpsLogService.insert(
                sessionGps,
              );
            }
          },
        });
    }
  }

  async countPendings(): Promise<void> {
    const result = await this.dbGpsLogService.getPendings();
  }

  async syncPendings() {
    const result = await this.dbGpsLogService.getPendings();
    const listGpsLog: IGpsLog[] = result.datos;

    return this._updateAtApi(listGpsLog);
  }

  private _updateAtApi(listGpsLog: (IGpsLog | undefined)[]) {
    let index = 0;
    return new Promise<void>((resolve) =>
      from(listGpsLog)
        .pipe(
          concatMap((containerGps) =>
            from(this.dbGpsLogService.get(containerGps!.id)).pipe(
              switchMap((resultGet) => {
                if (resultGet.estado === TypeResponse.OK) {
                  containerGps = resultGet.datos[0];
                  return of(containerGps);
                }
                containerGps = undefined;
                return of(containerGps);
              }),
              map((resultGet) => ({ resultGet, containerGps }))
            )
          ),
          filter(({ containerGps }) => containerGps !== undefined),
          concatMap(({ containerGps }) =>
            this.authenticateService
              .gpsLog$(JSON.parse(containerGps?.datos))
              .pipe(
                map((respuestaApi) => ({ respuestaApi, containerGps })),
                catchError((error) => {
                  // manejo de errores
                  const response: IResponseApi = {
                    estado: error.body.estado,
                    mensaje: error.body.mensaje,
                  };
                  return of({
                    respuestaApi: response,
                    containerGps: containerGps,
                  });
                })
              )
          )
        )
        .pipe(takeUntil(this.gpsLogSubject$))
        .subscribe({
          next: async ({ respuestaApi, containerGps }) => {
            index++;

            if (
              respuestaApi?.estado === TypeResponse.OK ||
              respuestaApi?.estado === TypeResponse.UNAUTHORIZED
            ) {
              const resultDelete = await this.dbGpsLogService.delete(
                containerGps!.id
              );
            }
            if (index === listGpsLog.length) {
              resolve();
            }
          },
          complete: () => resolve(),
          error: async (e: any) => resolve(),
        })
    );
  }
}

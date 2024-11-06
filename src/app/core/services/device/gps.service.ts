import { Injectable } from '@angular/core';
import { ILogger } from '../../abstract/ilogger';
import {
  Geolocation,
  Position,
  WatchPositionCallback,
} from '@capacitor/geolocation';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { UserInteractionService } from '../general/user-interaction-service.service';
import { Capacitor } from '@capacitor/core';
import { App, AppState } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  private watchId: string | undefined;

  constructor(
    private locationAccuracy: LocationAccuracy,
    private loggerService: ILogger,
    private userInteractionService: UserInteractionService
  ) {}

  async getCurrentPosition(): Promise<Position> {
    let position: Position | undefined = undefined;

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    while (position === undefined || !position.coords.latitude) {
      // si la app esta inactiva no captura gps
      const state: AppState = await App.getState();

      // espera
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        if (state.isActive) {
          await this._checkEnabled();
          await this._ensurePermissions();
          position = await Geolocation.getCurrentPosition(options);
        } else {
          // espera de 10 segundo
          await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        }
      } catch (error: any) {
        this.loggerService.error(
          `[GpsService -> getCurrentPosition]: ${error.message}`
        );

        if (state.isActive) {
          // espera
          position = await new Promise<Position | undefined>(
            async (resolve, reject) =>
              await this.userInteractionService.presentAlertActions(
                'Debe dar permisos o activar el gps para poder continuar',
                [
                  {
                    text: 'ok',
                    handler: async () => {
                      try {
                        await this._checkEnabled();
                        await this._ensurePermissions();
                        position = await Geolocation.getCurrentPosition(
                          options
                        );
                        return resolve(position);
                      } catch (error: any) {
                        this.loggerService.error(
                          `[GpsService -> getCurrentPosition -> Promise -> Reject]: ${error.message}`
                        );
                        await this._checkEnabled();
                        await this._ensurePermissions();
                        position = await this.getCurrentPosition();
                        return reject(
                          new Error('Error obteniendo la posición')
                        );
                      }
                    },
                  },
                ],
                true
              )
          );
        } else {
          // espera de 10 segundo
          await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        }
      }
    }

    return position!;
  }

  async watchPosition(callback: WatchPositionCallback): Promise<void> {
    try {
      if (this.watchId == null) {
        const state: AppState = await App.getState();
        if (!state.isActive) {
          await this._checkEnabled();
          await this._ensurePermissions();
          this.watchId = await Geolocation.watchPosition({}, callback);
        }
      }
    } catch (e: any) {
      this.loggerService.error(`[GpsService -> watchPosition]: ${e.message}`);

      await this.userInteractionService.presentAlertActions(
        'Debe dar permisos o activar el gps para poder continuar',
        [
          {
            text: 'ok',
            handler: async () => {
              await this.getCurrentPosition();
            },
          },
        ]
      );
    }
  }

  async clearWatch(): Promise<void> {
    if (this.watchId !== undefined) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = undefined;
    }
  }

  private async _ensurePermissions(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const hasPermission = await Geolocation.checkPermissions();
      if (hasPermission.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
      }
    }
  }

  private async _checkEnabled(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const canRequest = await this.locationAccuracy.canRequest();
      if (canRequest) {
        await this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(
            () => true,
            () => false
          );
      }
    }
  }
}

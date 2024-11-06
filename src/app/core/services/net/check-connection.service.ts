import { Injectable } from '@angular/core';

import { ICheckConnection } from '../../interfaces/ICheckConnection';

import { Network, Connection } from '@awesome-cordova-plugins/network/ngx';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { TypeResponse } from '../../enums/TypeResponse';
import { Capacitor } from '@capacitor/core';
import { UserInteractionService } from '../general/user-interaction-service.service';
import { TypeThemeColor } from '../../enums/TypeThemeColor';

@Injectable({
  providedIn: 'root',
})
export class CheckConnectionService implements ICheckConnection {
  constructor(
    private network: Network,
    private userInteractionService: UserInteractionService
  ) {}

  async check(): Promise<IResponseApi> {
    let result: IResponseApi;

    if (!Capacitor.isNativePlatform()) {
      return {
        estado: TypeResponse.OK,
        mensaje: `Conexión ok (${Capacitor.getPlatform()})`,
      };
    }

    const type = await Promise.resolve(this.network.type);

    switch (type) {
      case Connection.CELL:
        result = { estado: TypeResponse.OK, mensaje: `Conexión ok (${type})` };
        break;
      case Connection.WIFI:
        result = { estado: TypeResponse.OK, mensaje: `Conexión ok (${type})` };
        break;
      case Connection.CELL_4G:
        result = { estado: TypeResponse.OK, mensaje: `Conexión ok (${type})` };
        break;
      case Connection.CELL_3G:
        result = { estado: TypeResponse.OK, mensaje: `Conexión ok (${type})` };
        break;
      default:
        const message = `No hay conexión o nivel de señal bajo (${type})`;
        this.userInteractionService.presentToast(message, TypeThemeColor.WARNING);
        result = { estado: TypeResponse.CONNECTION_ERROR, mensaje: message };
        break;
    }
    return Promise.resolve(result);
  }

  public getType(): Promise<string> {
    if (!Capacitor.isNativePlatform()) {
      return Promise.resolve(Capacitor.getPlatform());
    }

    return Promise.resolve(this.network.type);
  }
}

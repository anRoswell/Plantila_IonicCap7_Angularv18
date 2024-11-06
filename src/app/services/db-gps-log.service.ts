import { Injectable } from '@angular/core';
import { IDbStorage } from 'src/app/core/abstract/idb-storage';
import { ILogger } from 'src/app/core/abstract/ilogger';
import { IQueryDb } from 'src/app/core/abstract/iquery-db';
import { DbGenericClass } from 'src/app/core/class/DbGeneric';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';
import { TypeState } from 'src/app/core/enums/TypeState';
import { ISessionGeolocation } from 'src/app/core/interfaces/IGeolocation';
import { IResponseApi } from 'src/app/core/interfaces/IResponseApi';
import { IGpsLog } from '../interfaces/IGpsLog';

@Injectable({
  providedIn: 'root'
})
export class DbGpsLogService extends DbGenericClass {
  private _controlTotalTry = 3;

  constructor(
    queryDb: IQueryDb,
    dbStorage: IDbStorage,
    loggerService: ILogger, 
  ) {
    const nameTable = 'gpsLog';
    const statmentTable = `
      CREATE TABLE IF NOT EXISTS ${nameTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        estado TEXT,
        datos TEXT
      );`

    super(
      queryDb,
      dbStorage,
      loggerService,
      nameTable,
      statmentTable
    )
  }

  async get(id: number): Promise<IResponseApi> {
    try {
      const control: Partial<IGpsLog> = { id };
      return this._controlError(() => this._get(control));
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> get]: ${e.message}`);
    }
  }

  async getPendings(): Promise<IResponseApi> {
    try {
      const control: Partial<IGpsLog> = { estado: TypeState.PENDIENTE };
      return this._controlError(() => this._get(control, ['id']));
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> get]: ${e.message}`);
    }
  }

  async delete(id: number): Promise<IResponseApi> {
    try {
      const control: Partial<IGpsLog> = { id };
      return this._controlError(() => this._delete(control));
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> delete]: ${e.message}`);
    }
  }

  async insert(sessionGeolocation: ISessionGeolocation): Promise<IResponseApi> {
    try {
      const gpsLog: Partial<IGpsLog> = {
        estado: TypeState.PENDIENTE,
        datos: JSON.stringify(sessionGeolocation),
      };
      return this._controlError(() => this._insert(gpsLog));
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> insert]: ${e.message}`);
    }
  }

  // permitir solo actualizar el estado
  async update(gpsLog: IGpsLog, state: TypeState): Promise<IResponseApi> {
    try {
      const control: Partial<IGpsLog> = {
        estado: state,
      };
      const filter: Partial<IGpsLog> = {
        id: gpsLog.id,
      };
      return this._controlError(() => this._update(control, filter));
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> update]: ${e.message}`);
    }
  }

  private async _controlError(fun:() => Promise<IResponseApi>): Promise<IResponseApi> {
    let exitMethod = false;
    let countTry = 0;
    let result: IResponseApi;
  
    try {
      while (!exitMethod) {
        countTry++;
        result = await fun();
        if (result.estado === TypeResponse.OK) {
          exitMethod = true;
        }      
        if (countTry >= this._controlTotalTry) {
          exitMethod = true;
        }
      }
      
      return result!;
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> _controlError]: ${e.message}`);
    }
  }
}

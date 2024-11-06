import { Injectable } from '@angular/core';
import { IQueryDb } from 'src/app/core/abstract/iquery-db';
import { IDbStorage } from 'src/app/core/abstract/idb-storage';
import { DbGenericClass } from 'src/app/core/class/DbGeneric';
import { Order } from 'src/app/test/gestion-module/models/gestion';
import { IManagement } from '../models/gestion';
import { IResponseApi } from 'src/app/core/interfaces/IResponseApi';
import { TypeState } from 'src/app/core/enums/TypeState';
import { ILogger } from 'src/app/core/abstract/ilogger';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';

@Injectable({
  providedIn: 'root',
})
export class DbPruebaService extends DbGenericClass {
  private _controlTotalTry = 3;
  
  constructor(
    queryDb: IQueryDb,
    dbStorage: IDbStorage,
    loggerService: ILogger,    
  ) {
    const nameTable = 'orders';
    const statmentTable = `
      CREATE TABLE IF NOT EXISTS ${nameTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        id_record INTEGER,
        log TEXT,
        datos TEXT, 
        estado INTEGER,
        mensaje TEXT, 
        fecha TEXT
      );`

    super(
      queryDb,
      dbStorage,
      loggerService,
      nameTable,
      statmentTable
    )
  }

  async get(id_record: number): Promise<IResponseApi> {
    try {
      const control: Partial<IManagement> = { id_record };
      return this._controlError(() => this._get(control), id_record);
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> get]: ${e.message}`);
    }
  }

  async delete(id_record: number): Promise<IResponseApi> {
    try {
      const control: Partial<IManagement> = { id_record };
      return this._controlError(() => this._delete(control), id_record);
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> delete]: ${e.message}`);
    }
  }

  async insert(order: Order): Promise<IResponseApi> {
    try {
      const id_record = order.informacion.id;
      const control: Partial<IManagement> = {
        id_record,
        estado: TypeState.PENDIENTE,
        fecha: new Date().toISOString(),
        datos: JSON.stringify(order),
      };
      return this._controlError(() => this._insert(control), id_record);
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> insert]: ${e.message}`);
    }
  }

  // permitir solo actualizar el estado
  async update(order: Order, state: TypeState): Promise<IResponseApi> {
    try {
      const id_record = order.informacion.id;
      const control: Partial<IManagement> = {
        estado: state,
        datos: JSON.stringify(order),
      };
      const filter: Partial<IManagement> = {
        id_record,
      };
      return this._controlError(() => this._update(control, filter), id_record);
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> update]: ${e.message}`);
    }
  }

  private async _controlError(fun:() => Promise<IResponseApi>, id_record: number): Promise<IResponseApi> {
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

      if (countTry >= this._controlTotalTry) {
        // Actualiza el estado del registro
        const control: Partial<IManagement> = {
          estado: TypeState.ERROR,
          log: JSON.stringify(result!),
        };  
        const filter: Partial<IManagement> = {
          id_record,
        };
        
        await this._update(control, filter);
      }

      return result!;
    } catch (e: any) {
      return this.loggerService.error(`[DbpruebaService -> _controlError]: ${e.message}`);
    }
  }
}

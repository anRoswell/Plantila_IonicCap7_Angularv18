import { Injectable } from '@angular/core';
import { IDbStorage } from 'src/app/core/abstract/idb-storage';
import { ILogger } from 'src/app/core/abstract/ilogger';
import { IQueryDb } from 'src/app/core/abstract/iquery-db';
import { DbGenericClass } from 'src/app/core/class/DbGeneric';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';
import { TypeStore } from 'src/app/core/enums/TypeStore';
import { IResponseApi } from 'src/app/core/interfaces/IResponseApi';
import { IStorage } from 'src/app/core/interfaces/IStorage';

@Injectable({
  providedIn: 'root'
})
export class DbGeneralCargaIncialService extends DbGenericClass {

  private _controlTotalTry = 3;

  constructor(
    queryDb: IQueryDb,
    dbStorage: IDbStorage,
    loggerService: ILogger
  ) {
    const nameTable = 'carga_inicial';
    const statmentTable = `
      CREATE TABLE IF NOT EXISTS ${nameTable} (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );`;

    super(queryDb, dbStorage, loggerService, nameTable, statmentTable);
  }

  async get(key: TypeStore) {
    try {
      const object: Partial<IStorage> = { key };
      return this._controlError(() => this._get(object));
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGeneralCargaIncialService -> get]: ${e.message}`
      );
    }
  }

  async set(key: TypeStore, value: any): Promise<IResponseApi> {
    try {
      const resultGet = await this.get(key);

      if (resultGet.estado !== TypeResponse.OK) {
        this.loggerService.error(
          `[DbGeneralCargaIncialService -> set -> get]: ${resultGet.mensaje}`
        );
        return resultGet;
      }

      if (resultGet.datos.length > 0) {
         // si encuentra registro actualiza
        const control: Partial<any> = {
          value: JSON.stringify(value),
        };
        const filter: Partial<any> = {
          key,
        };
        return this._controlError(() => this._update(control, filter));
      } else  {
        // sino encuentra registro inserta
        const object: Partial<any> = {
          key,
          value: JSON.stringify(value),
        };
        return this._controlError(() => this._insert(object));
      }
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGeneralCargaIncialService -> set]: ${e.message}`
      );
    }
  }

  async delete(key: TypeStore): Promise<IResponseApi> {
    try {
      const object: Partial<IStorage> = { key };
      return this._controlError(() => this._delete(object));
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGeneralCargaIncialService -> delete]: ${e.message}`
      );
    }
  }

  private async _controlError(
    fun: () => Promise<IResponseApi>,
  ): Promise<IResponseApi> {
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
        // hace una pausa para evitar errores al abrir y cerrar la bd
        // await new Promise((resolve) => setTimeout(resolve, 10));
      }

      return result!;
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> _controlError]: ${e.message}`
      );
    }
  }
}

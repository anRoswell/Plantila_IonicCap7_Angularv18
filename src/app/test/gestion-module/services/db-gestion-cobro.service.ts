import { Injectable } from '@angular/core';
import { IDbStorage } from 'src/app/core/abstract/idb-storage';
import { ILogger } from 'src/app/core/abstract/ilogger';
import { IQueryDb } from 'src/app/core/abstract/iquery-db';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';
import { TypeState } from 'src/app/core/enums/TypeState';
import {
  IContainerDbGC,
  IGCGestion,
  IGestionCobro,
} from '../models/IGestionCobro';
import { IResponseApi } from 'src/app/core/interfaces/IResponseApi';
import { DbGenericClass } from 'src/app/core/class/DbGeneric';

@Injectable({
  providedIn: 'root',
})
export class DbGestionCobroService extends DbGenericClass {
  private _controlTotalTry = 3;

  constructor(
    queryDb: IQueryDb,
    dbStorage: IDbStorage,
    loggerService: ILogger
  ) {
    const nameTable = 'gestion_cobro';
    const statmentTable = `
      CREATE TABLE IF NOT EXISTS ${nameTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        id_record INTEGER,
        id_contratista_persona INTEGER,
        log TEXT,
        informacion TEXT,
        gestion TEXT,
        estado INTEGER,
        mensaje TEXT, 
        fecha TEXT
      );`;

    super(queryDb, dbStorage, loggerService, nameTable, statmentTable);
  }

  async getByIdRecord(id_record: number): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = { id_record };
      return this._controlError(() => this._get(control), id_record);
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> getById]: ${e.message}`
      );
    }
  }

  async getByState(state: TypeState, fields: string[]): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = { estado: state };
      return this._controlError(() => this._get(control, fields));
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> getByState]: ${e.message}`
      );
    }
  }

  async getByIdUser(id_contratista_persona: number, fields: string[]): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = { id_contratista_persona };
      return this._controlError(() => this._get(control, fields));
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> getById]: ${e.message}`
      );
    }
  }

  async delete(id_record: number): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = { id_record };
      return this._controlError(() => this._delete(control), id_record);
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> delete]: ${e.message}`
      );
    }
  }

  async insert(
    idRecord: number,
    id_contratista_persona: number,
    gestionCobro: IGestionCobro,
    estado: TypeState = TypeState.PENDIENTE,
  ): Promise<IResponseApi> {
    try {
      const container: Partial<IContainerDbGC> = {
        id_record: idRecord,
        estado,
        id_contratista_persona,
        fecha: new Date().toLocaleDateString(),
        informacion: JSON.stringify(gestionCobro.informacion),
        gestion: JSON.stringify(gestionCobro.gestion),
      };
      return this._controlError(() => this._insert(container), idRecord);
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> insert]: ${e.message}`
      );
    }
  }

  async updateState(idRecord: number, state: TypeState): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = {
        estado: state,
      };
      const filter: Partial<IContainerDbGC> = {
        id_record: idRecord,
      };
      return this._controlError(() => this._update(control, filter), idRecord);
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> update]: ${e.message}`
      );
    }
  }

  async update(
    idRecord: number,
    state: TypeState,
    gestion: IGCGestion,
  ): Promise<IResponseApi> {
    try {
      const control: Partial<IContainerDbGC> = {
        estado: state,
        gestion: JSON.stringify(gestion),
      };
      const filter: Partial<IContainerDbGC> = {
        id_record: idRecord,
      };
      return this._controlError(() => this._update(control, filter), idRecord);
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> update]: ${e.message}`
      );
    }
  }

  private async _controlError(
    fun: () => Promise<IResponseApi>,
    id_record?: number
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

      if (countTry >= this._controlTotalTry && id_record) {
        // Actualiza el estado del registro en caso de error
        const control: Partial<IContainerDbGC> = {
          estado: TypeState.ERROR,
          log: JSON.stringify(result!),
        };
        const filter: Partial<IContainerDbGC> = {
          id_record,
        };

        await this._update(control, filter);
      }
      return result!;
    } catch (e: any) {
      return this.loggerService.error(
        `[DbGestionCobroService -> _controlError]: ${e.message}`
      );
    }
  }
}

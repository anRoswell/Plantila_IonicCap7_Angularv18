import { IDbStorage } from '../abstract/idb-storage';
import { ILogger } from '../abstract/ilogger';
import { IQueryDb } from '../abstract/iquery-db';
import { TypeResponse } from '../enums/TypeResponse';
import { IResponseApi } from '../interfaces/IResponseApi';

export class DbGenericClass {
  constructor(
    public queryDb: IQueryDb,
    public dbStorage: IDbStorage,
    public loggerService: ILogger,
    public _nameTable: string,
    public _statmentTable: string
  ) {}

  async init(): Promise<IResponseApi> {
    try {
      return await this.dbStorage.createTable(this._statmentTable);
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> init]: ${e.message}`);
    }
  }

  async getAll(field = ['*']): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.select(this._nameTable, field, []);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.query(query.datos);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> getAll]: ${e.message}`);
    }
  }

  protected async _get(filter: any, field = ['*']): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.select(this._nameTable, field, filter);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.query(query.datos);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> _get]: ${e.message}`);
    }
  }

  protected async _delete(object: any): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.delete(this._nameTable, object);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.run(query.datos, []);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> _delete]: ${e.message}`);
    }
  }

  protected async _deleteAll(): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.deleteAll(this._nameTable);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.run(query.datos, []);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> _deleteAll]: ${e.message}`);
    }
  }

  protected async _insert(object: any): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.insert(this._nameTable, object);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.run(query.datos, object);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> _insert]: ${e.message}`);
    }
  }

  protected async _update(object: any, filter: any): Promise<IResponseApi> {
    try {
      const query = await this.queryDb.update(this._nameTable, object, filter);
      if (query.estado === TypeResponse.OK) {
        return this.dbStorage.run(query.datos, object);
      }
      return query;
    } catch (e: any) {
      return this.loggerService.error(`[DbGeneric -> _update]: ${e.message}`);
    }
  }
}

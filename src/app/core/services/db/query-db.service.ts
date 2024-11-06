import { Injectable } from '@angular/core';
import { IQueryDb } from '../../abstract/iquery-db';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { TypeResponse } from '../../enums/TypeResponse';


@Injectable({
  providedIn: 'root',
})
export class QueryDbService implements IQueryDb {
  constructor() { }

  insert(tableName: string, data: any): Promise<IResponseApi> {
    try {

      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${columns.join(
        ', '
      )})  VALUES (${placeholders})`;
      return Promise.resolve({
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: sql,
      });
    } catch (e) {
      return Promise.reject({
        estado: TypeResponse.ERROR,
        mensaje: e,
      });
    }
  }

  update(tableName: string, data: any, filter: any): Promise<IResponseApi> {
    try {
      const columns = Object.keys(data);
      const sets = columns.map((col) => `${col} = ?`).join(', ');
      const keys = Object.keys(filter);
      const clauses = keys
        .map((key) => {
          let value = filter[key];
          if (typeof value === 'string') {
            // Si es un string, añade las comillas
            value = "'" + value + "'";
          }
          return `${key} = ${value}`
        })
        .join(' AND ');
      let sql = `UPDATE ${tableName} SET ${sets} `;
      if (keys.length > 0) {
        sql += ` WHERE ${clauses}`;
      }
      return Promise.resolve({
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: sql,
      });
    } catch (e) {
      return Promise.reject({
        estado: TypeResponse.ERROR,
        mensaje: e,
      });
    }
  }

  select(tableName: string, field = ['*'], filter = []): Promise<IResponseApi> {
    try {
      const keys = Object.keys(filter);
      const clauses = keys
      .map((key: any) => {
        let value: any = filter[key];
        if (typeof value === 'string') {
          // Si es un string, añade las comillas
          value = "'" + value + "'";
        }
        return `${key} = ${value}`
      })
      .join(' AND ');
      let sql = `SELECT ${field.join(', ')} FROM ${tableName} `;
      if (keys.length > 0) {
        sql += ` WHERE ${clauses}`;
      }

      return Promise.resolve({
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: sql,
      });
    } catch (e) {
      return Promise.reject({
        estado: TypeResponse.ERROR,
        mensaje: e,
      });
    }
  }

  delete(tableName: string, filter: any): Promise<IResponseApi> {
    try {
      const keys = Object.keys(filter);
      const clauses = keys
      .map((key) => {
        let value = filter[key];
        if (typeof value === 'string') {
          // Si es un string, añade las comillas
          value = "'" + value + "'";
        }
        return `${key} = ${value}`
      })
      .join(' AND ');
      let sql = `DELETE FROM ${tableName} `;
      if (keys) {
        sql += ` WHERE (${clauses})`;
        return Promise.resolve({
          estado: TypeResponse.OK,
          mensaje: 'Correcto',
          datos: sql,
        });
      }
      return Promise.reject({
        estado: TypeResponse.ERROR,
        mensaje: 'Faltan parametros en la Consulta',
      });
    } catch (e) {
      return Promise.reject({
        estado: TypeResponse.ERROR,
        mensaje: e,
      });
    }
  }

  deleteAll(tableName: string): Promise<IResponseApi> {
    try {
      let sql = `DELETE FROM ${tableName} `;
      return Promise.resolve(
        {
          estado: TypeResponse.OK,
          mensaje: "Correcto",
          datos: sql
        }
      );
    }
    catch (e) {
      return Promise.reject(
        {
          estado: TypeResponse.ERROR,
          mensaje: e
        }
      );
    }
  }
}

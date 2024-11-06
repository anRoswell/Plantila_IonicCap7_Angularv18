import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  CapacitorSQLitePlugin,
  SQLiteConnection,
  SQLiteDBConnection,
  capSQLiteResult,
  capSQLiteUpgradeOptions,
  capSQLiteValues,
} from '@capacitor-community/sqlite';

import { Capacitor } from '@capacitor/core';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { TypeResponse } from '../../enums/TypeResponse';
import { IDbStorage } from '../../abstract/idb-storage';
import { ILogger } from '../../abstract/ilogger';
import { DbNameVersionService } from './db-name-version.service';

@Injectable({
  providedIn: 'root',
})
export class SqlLiteService implements IDbStorage {
  private _sqliteConnection!: SQLiteConnection;
  private _platform!: string;
  private _sqlitePlugin!: CapacitorSQLitePlugin;
  private _native: boolean = false;
  private _db!: SQLiteDBConnection;
  private _databaseName = 'dbSyspotec';

  constructor(
    private dbNameVersionService: DbNameVersionService,
    private loggerService: ILogger
  ) {}

  async initializePlugin(): Promise<boolean> {
    this._platform = Capacitor.getPlatform();
    if (this._platform === 'ios' || this._platform === 'android') {
      this._native = true;
    }
    this._sqlitePlugin = CapacitorSQLite;
    this._sqliteConnection = new SQLiteConnection(this._sqlitePlugin);

    return true;
  }

  async addUpgradeStatement(version: number, stamentTable?: string[]): Promise<void> {
    const options: capSQLiteUpgradeOptions = {
      database: this._databaseName,
      upgrade: [
        {
          toVersion: version,
          statements: stamentTable ?? []
        }
      ],
    };
    await this._sqlitePlugin.addUpgradeStatement(options);
    return;
  }

  getPlatform(): string {
    return this._platform;
  }

  async initializeDatabase(version: number): Promise<void> {
    if (
      (this._native || this._platform === 'electron') &&
      (await this._isInConfigEncryption()).result &&
      (await this._isDatabaseEncrypted(this._databaseName)).result
    ) {
      this._db = await this._openDatabase(
        this._databaseName,
        true,
        'secret',
        version,
        false
      );
    } else {
      this._db = await this._openDatabase(
        this._databaseName,
        false,
        'no-encryption',
        version,
        false
      );
    }

    this.dbNameVersionService.set(this._databaseName, version);

    if (this._platform === 'web') {
      await this._sqliteConnection.saveToStore(this._databaseName);
    }
  }

  async initWebStore(): Promise<void> {
    try {
      await this._sqliteConnection.initWebStore();
    } catch (e: any) {
      this.loggerService.error(
        `[SqlLiteService -> initWebStore]: ${e.message}`
      );
    }
  }

  private async _openDatabase(
    dbName: string,
    encrypted: boolean,
    mode: string,
    version: number,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    let db: SQLiteDBConnection;

    try {      
      const retCC = (await this._sqliteConnection.checkConnectionsConsistency()).result;
      const isConn = (await this._sqliteConnection.isConnection(dbName, readonly)).result;
      if (retCC && isConn) {
        db = await this._sqliteConnection.retrieveConnection(dbName, readonly);
      } else {
        db = await this._sqliteConnection.createConnection(
          dbName,
          encrypted,
          mode,
          version,
          readonly
        );
      }
      await db.open();
      return db;
    } catch (e: any) {
      this.loggerService.error(`[SqlLiteService -> _openDatabase -> error:]: ${e}`);
      return Promise.reject();
    }
  }

  async query(query: string): Promise<IResponseApi> {
    try {
      const retValues = (await this._db.query(query)).values;
      return {
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: retValues,
      };
    } catch (e: any) {
      return this.loggerService.error(
        `[SqlLiteService -> query]: ${e.message}`
      );
    }
  }

  async run(query: string, data: any = {}): Promise<IResponseApi> {
    try {
      let values: any = [];
      Object.entries(data).forEach(([key, value]) => {
        values.push(value);
      });
      const retValues = await this._db.run(query, values);
      return {
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: retValues,
      };
    } catch (e: any) {
      return this.loggerService.error(`[SqlLiteService -> run]: ${e.message}`);
    }
  }

  async createTable(query: string): Promise<IResponseApi> {
    try {
      const retValues = await this._db.run(query, []);
      await this._db.close();
      await this._db.open();
      return {
        estado: TypeResponse.OK,
        mensaje: 'Correcto',
        datos: retValues,
      };
    } catch (e: any) {
      return this.loggerService.error(
        `[SqlLiteService -> createTable]: ${e.message}`
      );
    }
  }

  private async _retrieveConnection(
    dbName: string,
    readonly: boolean
  ): Promise<SQLiteDBConnection> {
    return await this._sqliteConnection.retrieveConnection(dbName, readonly);
  }

  private async _closeConnection(
    database: string,
    readonly?: boolean
  ): Promise<void> {
    const readOnly = readonly ? readonly : false;
    return await this._sqliteConnection.closeConnection(database, readOnly);
  }

  private async _isInConfigEncryption(): Promise<capSQLiteResult> {
    return await this._sqliteConnection.isInConfigEncryption();
  }

  private async _isInConfigBiometricAuth(): Promise<capSQLiteResult> {
    return await this._sqliteConnection.isInConfigBiometricAuth();
  }

  private async _isDatabaseEncrypted(
    database: string
  ): Promise<capSQLiteResult> {
    let res: capSQLiteResult = { result: false };
    const isDB = (await this._sqliteConnection.isDatabase(database)).result;
    if (!isDB) {
      return { result: false };
    }
    return await this._sqliteConnection.isDatabaseEncrypted(database);
  }

  private async _isSecretStored(): Promise<capSQLiteResult> {
    return await this._sqliteConnection.isSecretStored();
  }

  private async _setEncryptionSecret(passphrase: string): Promise<void> {
    return await this._sqliteConnection.setEncryptionSecret(passphrase);
  }

  private async _clearEncryptionSecret(): Promise<void> {
    return await this._sqliteConnection.clearEncryptionSecret();
  }

  private async _changeEncryptionSecret(
    passphrase: string,
    oldpassphrase: string
  ): Promise<void> {
    return await this._sqliteConnection.changeEncryptionSecret(
      passphrase,
      oldpassphrase
    );
  }

  private async _checkEncryptionSecret(
    passphrase: string
  ): Promise<capSQLiteResult> {
    return await this._sqliteConnection.checkEncryptionSecret(passphrase);
  }

  private async _getDatabaseList(): Promise<capSQLiteValues> {
    return await this._sqliteConnection.getDatabaseList();
  }

  private async _unencryptCryptedDatabases(): Promise<void> {
    const dbList: string[] = (await this._getDatabaseList()).values!;
    for (let idx: number = 0; idx < dbList.length; idx++) {
      const dbName = dbList[idx].split('SQLite.db')[0];
      const isEncrypt = (await this._isDatabaseEncrypted(dbName)).result!;
      if (isEncrypt) {
        const version = this.dbNameVersionService.getVersion(dbName)!;
        const db = await this._openDatabase(
          dbName,
          true,
          'secret',
          version,
          false
        );
        const jsonDB = (await db.exportToJson('full')).export!;
        jsonDB.overwrite = true;
        jsonDB.encrypted = false;
        const res = await this._sqliteConnection.importFromJson(
          JSON.stringify(jsonDB)
        );
      }
    }
  }
}

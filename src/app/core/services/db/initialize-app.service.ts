import { Injectable } from '@angular/core';
import { IDbStorage } from '../../abstract/idb-storage';
import { DbPruebaService } from 'src/app/test/gestion-module/services/dbprueba.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;
  version = 1;

  constructor(
    private sqliteService: IDbStorage,
    private dbPruebaService: DbPruebaService
  ) {}

  async initializeApp(): Promise<void> {
    await this.sqliteService.initializePlugin().then(async (response) => {
      try {
        this.platform = this.sqliteService.getPlatform();

        if (this.platform === 'web') {
          await this.sqliteService.initWebStore();
        }

        await this.sqliteService.initializeDatabase(this.version);
        
        await this.dbPruebaService.init();

        this.isAppInit = true;
      } catch (error: any) {
        console.error('initializeApp -> error: ' , error)
      }
    });
  }
}

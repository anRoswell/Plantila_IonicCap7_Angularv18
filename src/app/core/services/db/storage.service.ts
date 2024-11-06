import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IStorage } from '../../abstract/istorage';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements IStorage {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init(): Promise<void> {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    if(!this._storage) {
      const storage = await this.storage.create();
      this._storage = storage;
    }
  }

  public async destroy(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  public async clear(): Promise<void> {
    await this._storage?.clear();
  }

  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    return JSON.parse(await this._storage?.get(key));
  }
}

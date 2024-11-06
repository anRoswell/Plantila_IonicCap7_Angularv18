import { Injectable, signal } from '@angular/core';
import { ILogger } from '../../abstract/ilogger';
import { IResponseApi } from '../../interfaces/IResponseApi';
import { TypeResponse } from '../../enums/TypeResponse';

@Injectable({
  providedIn: 'root',
})
export class LoggerService implements ILogger {
  logs = signal<string>('Esto es una prueba');

  constructor() {}

  info(message: string): void {
    this.logs.set(message);
    console.info(message);
  }

  warning(warning: string): void {
    this.logs.set(warning);
    console.warn(warning);
  }

  error(error: string): IResponseApi {
    // registro local storage array de errores push para sincronizar mas adelante
    // registro en api endpoint errores
    this.logs.set(error);
    console.error(error);

    return {
      estado: TypeResponse.ERROR,
      mensaje: error,
    };
  }
}

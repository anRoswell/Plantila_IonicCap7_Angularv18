import { Injectable } from '@angular/core';
import { UserInteractionService } from './user-interaction-service.service';
import { LoggerService } from '../log/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TaskSchedulerService {
  private functions: (() => Promise<void>)[] = [];
  private readonly TIME_EXECUTION = 60 * 60 * 1000; // 60 min
  // private readonly TIME_EXECUTION = 10 * 1000; // 30 segundos
  private isLoaded = false;
  private isInExecution = false;

  constructor(
    private userInteractionService: UserInteractionService,
    private loggerService: LoggerService
  ) {}

  /**
   * Permite adicionar funciones al programador de tareas, seguir las siguientes recomendaciones:
   * Las funciones deben devolver siempre una promesa del tipo: return new Promise<void>((resolve) => resolve()) para que haga la espera entre funciones
   * @param theFunction: Recibe una función que retorna una promesa
   */
  addFunction(theFunction: () => Promise<any>) {
    this.functions.push(theFunction);
  }

  /**
   * Quita todas las funciones programadas
   */
  cleasFunctions() {
    this.loggerService.info('executeTaskScheduler call clearFunctions');
    this.functions = [];
  }

  /**
   * Función que llama al programador de tareas, este queda cargado y se ejecuta cada x tiempo
   */
  async executeTaskScheduler() {
    return new Promise<void>(async (resolve) => {
      if (this.isLoaded) {
        this.loggerService.info('executeTaskScheduler ya esta cargado');
        return;
      }

      this.isLoaded = true;
      this.loggerService.info('executeTaskScheduler inicializado');

      setInterval(
        async () => { 
          await this.executeInmediatly();
          resolve();
        },
        this.TIME_EXECUTION
      );
    });
  }

  /**
   * Función que ejecuta de manera inmediata las funciones cargadas
   */
  async executeInmediatly(showLoading = false) {
    return new Promise<void>(async (resolve) => {
      if (this.isInExecution) {
        this.loggerService.info('executeTaskScheduler está en ejecución');
        return;
      }
  
      this.isInExecution = true;
      let countTask = 1;

      if (showLoading) {
        await this.userInteractionService.showLoading(`Enviando información... Procesando (${countTask})`);
      }
      
      for (const theFunction of this.functions) {
        countTask++;
        this.loggerService.info('Ejecutando tarea: ' + countTask);
        await theFunction();
      }
  
      this.isInExecution = false;
      this.loggerService.info('Tareas programadas ejecutadas: ' + countTask);
  
      if (showLoading) {
        await this.userInteractionService.dismissLoading();
      }

      resolve();
    });
  }
}

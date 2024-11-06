import { Injectable } from '@angular/core';
import { Order } from '../models/gestion';
import { IResponseApi } from 'src/app/core/interfaces/IResponseApi';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';

@Injectable({
  providedIn: 'root'
})
export class ServiceGestionService {

  constructor() { }

  orders: Order[] = [
    {
      informacion: {
        id: 1,
        nic: 'NIC 1',
        cliente: 'Nombre y apelldos 1',
        direccion: 'Carrera 3 21 - 44',
        municipio: 'Barranquilla'
      }
    },
    {
      informacion: {
        id: 2,
        nic: 'NIC 2',
        cliente: 'Nombre y apelldos 2',
        direccion: 'Carrera 3 22 - 45',
        municipio: 'Barranquilla'
      }
    },
    {
      informacion: {
        id: 3,
        nic: 'NIC 3',
        cliente: 'Nombre y apelldos 3',
        direccion: 'Carrera 3 23 - 46',
        municipio: 'Barranquilla'
      }
    }
  ]

  get$(): Promise<IResponseApi> {
    return new Promise((resolve) =>
      setTimeout(() => 
        resolve(
          Promise.resolve(
            {
              estado: TypeResponse.OK,
              mensaje: 'Actualizado correctamente',
              datos: this.orders
            }
          )
        )
      , 1000)
    );
  }

  getId$(id_record: number): Promise<IResponseApi> {
    const order = this.orders.find((order) => order.informacion.id === id_record);
    
    return new Promise((resolve) =>
      setTimeout(() => 
        resolve(
          Promise.resolve(
            {
              estado: TypeResponse.OK,
              mensaje: 'Actualizado correctamente',
              datos: order
            }
          )
        )
      , 1000)
    );
  }

  set$(order: Order): Promise<IResponseApi> {
    const index = this.orders.findIndex((item) => item.informacion.id === order.informacion.id);

    this.orders[index] = order;

    return Promise.resolve(
      {
        estado: TypeResponse.ERROR,
        mensaje: 'Actualizado correctamente',
      }
    );
  }
}

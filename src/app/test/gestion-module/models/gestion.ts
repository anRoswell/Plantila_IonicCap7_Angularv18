import { TypeState } from "src/app/core/enums/TypeState";

export interface Order {
    informacion: OrderInfo;
    gestion?: OrderManagement;
}
  
export interface OrderInfo {
    id: number
    nic: string;
    cliente: string;
    direccion: string;
    municipio: string;
}
  
export interface OrderManagement {
    gestion: string;
    resultado: string;
    lectura_medidor: string;
    valor_recaudo: number;
    fecha_pago: string;
}

export interface List {
    id: number;
    nombre: string;
}

export interface IManagement {
    id: number;
    id_record: number;
    estado: number;
    mensaje?: string;
    log?: string;
    fecha: string;
    datos: any;
}

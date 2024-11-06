import { Observable } from 'rxjs';
import { IGeolocation, ISessionGeolocation } from './IGeolocation';
import { IResponseApi } from './IResponseApi';
import { IMenu } from './IMenu';
import { IZone } from '../../interfaces/IParameters';

export interface ILogin {
  usuario: string;
  clave: string;
  georreferencia: IGeolocation;
}

export interface ILogout {
  id_usuario: number;
  georreferencia: IGeolocation;
}

export interface IChangePassword {
  clave_actual: string;
  clave_nueva: string;
  confirmacion_clave_nueva: string;
}

export interface IRestoretPassword {
  codigo: string;
  usuario: string;
  clave: string;
  clave_nueva: string;
}

export interface IUser {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  identificacion: string;
  tipo_identificacion: string;
  ind_cambio_clave: string;
  id_contratista_persona?: number;
  id_contratista?: number;
  ind_cambio_placa: string;
  zonas: IZone[];
  menu: IMenu[];
}

export interface IDevice {
  id_usuario: number;
  id_dispositivo: string;
}

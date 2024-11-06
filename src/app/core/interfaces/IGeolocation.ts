import { IToken } from "./IToken";

export interface IGeolocation {
    latitud: number | undefined; 
    longitud: number | undefined; 
}

export interface ISessionGeolocation extends IToken {
    fecha: string; 
    georreferencia: IGeolocation; 
}
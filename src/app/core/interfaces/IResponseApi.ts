import { TypeResponse } from "../enums/TypeResponse";

export interface IResponseApi {
  estado: TypeResponse;
  mensaje: string;
  datos?: any;
}

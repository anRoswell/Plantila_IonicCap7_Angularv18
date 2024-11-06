import { TypeState } from "../core/enums/TypeState";

export interface IGpsLog {
    id: number;
    estado: TypeState;
    datos: any;
}

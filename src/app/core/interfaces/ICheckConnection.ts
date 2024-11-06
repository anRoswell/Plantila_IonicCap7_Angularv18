import { IResponseApi } from "./IResponseApi";

export interface ICheckConnection {
  check(): Promise<IResponseApi>;
  getType(): Promise<string>
}

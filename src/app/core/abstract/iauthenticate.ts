import { Observable } from "rxjs";
import { IResponseApi } from "../interfaces/IResponseApi";
import { IChangePassword, IDevice, ILogin, IRestoretPassword, IUser } from "../interfaces/IUser";
import { ISessionGeolocation } from "../interfaces/IGeolocation";

export abstract class IAuthenticate {
  public abstract login$(credentials: ILogin): Observable<IResponseApi>;
  public abstract logout$(): Observable<IResponseApi>;
  public abstract changePassword$(changePassword: IChangePassword): Observable<IResponseApi>;
  public abstract restorePassword$(restorePassword: IRestoretPassword): Observable<IResponseApi>;
  public abstract forgotPassword$(user: string): Observable<IResponseApi>;
  public abstract registerTokenDevice$(device: IDevice): Observable<IResponseApi>;
  public abstract gpsLog$(gpsLog: ISessionGeolocation): Observable<IResponseApi>;
  public abstract getCurrentUser(): Promise<IUser>;
  public abstract getToken(): Promise<string>;
  public abstract goLogin(): void;
}

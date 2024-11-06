import { IAlertAction, IAlertRole } from "../interfaces/IAlertOptions";

export abstract class IUserInteraction {
    public abstract presentAlertActions(message: string, actions: IAlertAction[], checkIsShowAlert: boolean, header: string): Promise<HTMLIonAlertElement | void>;
    public abstract presentAlertRoles(message: string, actions: IAlertRole[], checkIsShowAlert: boolean, header: string): Promise<string | void>;
    public abstract presentToast(message: string, color: string, duration: number): Promise<void>;
    public abstract showLoading(): Promise<void>;
    public abstract dismissLoading(): Promise<void>
}

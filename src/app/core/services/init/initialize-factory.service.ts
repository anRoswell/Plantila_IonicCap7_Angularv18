import { DbGeneralCargaIncialService } from "src/app/services/db-general-carga-incial.service";
import { InitializeAppService } from "../db/initialize-app.service";
import { GpsLogService } from "../log/gps-log.service";

export function InitializeFactory(
  init: InitializeAppService, 
  gpsLog: GpsLogService,
  initialLoad: DbGeneralCargaIncialService,
) {
  return async () => {
    await init.initializeApp();
    await gpsLog.startLogGps();
    await initialLoad.init();
  };
}


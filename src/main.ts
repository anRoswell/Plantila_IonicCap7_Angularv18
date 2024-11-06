import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { SqlLiteService } from './app/core/services/db/sqllite.service';
import { InitializeAppService } from './app/core/services/db/initialize-app.service';
import { DbNameVersionService } from './app/core/services/db/db-name-version.service';
import { provideServiceWorker } from '@angular/service-worker';
import { LoggerService } from './app/core/services/log/logger.service';
import { HttpService } from './app/core/services/net/http.service';
import { AuthenticateService } from './app/core/services/auth/authenticate.service';
import { ILogger } from './app/core/abstract/ilogger';
import { IHttp } from './app/core/abstract/ihttp';
import { IAuthenticate } from './app/core/abstract/iauthenticate';
import { IDbStorage } from './app/core/abstract/idb-storage';
import { IQueryDb } from './app/core/abstract/iquery-db';
import { QueryDbService } from './app/core/services/db/query-db.service';
import { IUserInteraction } from './app/core/abstract/iuser-interaction';
import { UserInteractionService } from './app/core/services/general/user-interaction-service.service';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './app/core/interceptors/token.interceptor';
import { ThrottleInterceptor } from './app/core/interceptors/throttle.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptor';
import { InitializeFactory } from './app/core/services/init/initialize-factory.service';
import { GpsLogService } from './app/core/services/log/gps-log.service';
import { DbGeneralCargaIncialService } from './app/services/db-general-carga-incial.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { IStorage } from './app/core/abstract/istorage';
import { StorageService } from './app/core/services/db/storage.service';
import { IonicStorageModule } from '@ionic/storage-angular';

if (environment.production) {
  enableProdMode();
}

// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if(platform === "web") {
    // Web platform
    // required for toast component in Browser
    pwaElements(window);

    // required for jeep-sqlite Stencil component
    // to use a SQLite database in Browser
    jeepSqlite(window);

    window.addEventListener('DOMContentLoaded', async () => {
        const jeepEl = document.createElement("jeep-sqlite");
        document.body.appendChild(jeepEl);
        await customElements.whenDefined('jeep-sqlite');
        jeepEl.autoSave = true;
    });
}
// Above only required if you want to use a web platform <--

bootstrapApplication(AppComponent, {
  providers: [
    SqlLiteService,
    InitializeAppService,
    DbNameVersionService,
    LocationAccuracy,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ILogger, useClass: LoggerService },
    { provide: IHttp, useClass: HttpService },
    { provide: IStorage , useClass: StorageService },
    { provide: IAuthenticate, useClass: AuthenticateService },
    { provide: IDbStorage, useClass: SqlLiteService },
    { provide: IQueryDb, useClass: QueryDbService },
    { provide: IUserInteraction, useClass: UserInteractionService },    
    importProvidersFrom(IonicModule.forRoot(), IonicStorageModule.forRoot()),
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ThrottleInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { 
      provide: APP_INITIALIZER, 
      useFactory: InitializeFactory, 
      deps: [InitializeAppService, GpsLogService, DbGeneralCargaIncialService], 
      multi: true 
    }, 
  ],
});

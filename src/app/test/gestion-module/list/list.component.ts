import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ServiceGestionService } from '../services/service-gestion.service';
import { IManagement, Order } from '../models/gestion';
import { TypeState } from 'src/app/core/enums/TypeState';
import { TypeThemeColor } from 'src/app/core/enums/TypeThemeColor';
import { Router } from '@angular/router';
import { DbPruebaService } from '../services/dbprueba.service';
import { UserInteractionService } from 'src/app/core/services/general/user-interaction-service.service';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';
import { AuthenticateService } from 'src/app/core/services/auth/authenticate.service';
import { DbGestionCobroService } from '../services/db-gestion-cobro.service';
import { IContainerDbGC } from '../models/IGestionCobro';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { LoadingComponent } from 'src/app/common/loading/loading';
import { ErrorComponent } from 'src/app/common/error/error';
import { EmptyComponent } from 'src/app/common/empty/empty';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, LoadingComponent, ErrorComponent, EmptyComponent],
})
export class ListComponent implements OnInit {
  managements$ = signal<IManagement[]>([]);
  loading$ = signal<boolean>(false);

  errorManagements: IManagement[] = [];
  typeStates = TypeState;
  
  constructor(
    private apiServiceGestion: ServiceGestionService,
    private dbServiceGestion: DbPruebaService,
    private userInteractionService: UserInteractionService,
    private router: Router,
    private authenticateService: AuthenticateService,
    private dbGestionCobroService: DbGestionCobroService
  ) {
    this.addIcons();
  }

  async ngOnInit() {
    // trae datos de la api
    await this.sincronizeOrdersAtLocalDb(await this.getOrdersApi());
    this.loading$.update(() => true);
  }

  addIcons() {
    addIcons({ informationCircleOutline });
  }

  async ionViewWillEnter() {
    if (this.loading$()) {
      await this.sincronizeOrdersAtLocalDb([], this.errorManagements);
    }
  }

  async getOrdersApi(): Promise<Order[]> {
    const result = await this.apiServiceGestion.get$();
    return result.datos;
  }

  async sincronizeOrdersAtLocalDb(
    orders: Order[] = [],
    errorManagements: IManagement[] = []
  ): Promise<void> {
    let listManagements: IManagement[] = [];
    let listErrorsManagements = errorManagements;

    for (const order of orders) {
      // verifica si existe
      const resultGet = await this.dbServiceGestion.get(order.informacion.id);
      if (resultGet.estado !== TypeResponse.OK) {
        await this.userInteractionService.presentToast(resultGet.mensaje);
      } else {
        // sino existe registra
        if (resultGet.datos.length === 0) {
          const checkInsert = await this.dbServiceGestion.insert(order);
          if (checkInsert.estado !== TypeResponse.OK) {
            listErrorsManagements.push({
              id: 0,
              id_record: order.informacion.id,
              estado: TypeState.ERROR,
              mensaje: 'ERROR AL CARGAR DATOS',
              fecha: new Date().toLocaleDateString(),
              datos: order,
            });
          }
        } else {
          // si existe verifica si esta sincronizado
          const checkManagement: IManagement = resultGet.datos[0];
          if (checkManagement.estado === TypeState.SINCRONIZADO) {
            // elimina de la bd
            await this.dbServiceGestion.delete(order.informacion.id);
            // elimina de la lista
            const findIndexDelete = this.managements$().findIndex(
              (management) => management.id_record === checkManagement.id_record
            );
            this.managements$().splice(findIndexDelete, 1);
          }
          // TODO: caso error
        }
      }
    }
    const resultGetAll = await this.dbServiceGestion.getAll();
    if (resultGetAll.estado !== TypeResponse.OK) {
      await this.userInteractionService.presentAlertActions(
        resultGetAll.mensaje
      );
    }

    for (const management of resultGetAll.datos as IManagement[]) {
      listManagements.push({
        id: management.id,
        id_record: management.id_record,
        estado: management.estado,
        fecha: management.fecha,
        datos: JSON.parse(management.datos) as Order,
      });
    }
    this.managements$.update(() => ([...listErrorsManagements, ...listManagements]));
  }

  getStateColor(state: TypeState): TypeThemeColor {
    let color: TypeThemeColor = TypeThemeColor.PRIMARY;
    switch (state) {
      case TypeState.PENDIENTE:
        color = TypeThemeColor.WARNING;
        break;
      case TypeState.SINCRONIZADO:
        color = TypeThemeColor.SUCCESS;
        break;
      case TypeState.RECHAZADA:
        color = TypeThemeColor.TERTIARY;
        break;
      case TypeState.EN_EDICION:
        color = TypeThemeColor.MEDIUM;
        break;
      case TypeState.EN_SINCRONIZACION:
        color = TypeThemeColor.MEDIUM;
        break;
      case TypeState.GUARDADO:
        color = TypeThemeColor.SECONDARY;
        break;
      case TypeState.ERROR:
        color = TypeThemeColor.DANGER;
        break;
    }

    return color;
  }

  getStatMessage(state: TypeState): string {
    let message = 'PENDIENTE';
    switch (state) {
      case TypeState.PENDIENTE:
        message = 'PENDIENTE';
        break;
      case TypeState.SINCRONIZADO:
        message = 'SINCRONIZADO';
        break;
      case TypeState.RECHAZADA:
        message = 'RECHAZADA';
        break;
      case TypeState.EN_EDICION:
        message = 'EN EDICION';
        break;
      case TypeState.EN_SINCRONIZACION:
        message = 'EN SINCRONIZACION';
        break;
      case TypeState.GUARDADO:
        message = 'GUARDADO';
        break;
      case TypeState.ERROR:
        message = 'ERROR';
        break;
    }
    return message;
  }

  goForm(id_record: number) {
    this.router.navigate(['test/gestion/form/', id_record]);
  }

  async goDownload(id_record: number) {
    return await this.apiServiceGestion.getId$(id_record);
  }

  async ConvertRecordsToPendigns() {
    const currentUser = await this.authenticateService.getCurrentUser();

    const resultGetSaved = await this.dbGestionCobroService.getByState(
      TypeState.SINCRONIZADO,
      ['id_record']
    );

    const containersGC: IContainerDbGC[] = [...resultGetSaved.datos];

    for (const container of containersGC) {
      const resultUpdate = await this.dbGestionCobroService.updateState(
        container.id_record,
        TypeState.GUARDADO
      );
    }
  }
}

import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderInfo, OrderManagement } from '../models/gestion';
import { AlertController } from '@ionic/angular';
import { TypeState } from 'src/app/core/enums/TypeState';
import { ServiceGestionService } from '../services/service-gestion.service';
import { DbPruebaService } from '../services/dbprueba.service';
import { TypeResponse } from 'src/app/core/enums/TypeResponse';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserInteractionService } from 'src/app/core/services/general/user-interaction-service.service';
import { FormInfoComponent } from '../form-info/form-info.component';
import { FormManagementComponent } from '../form-management/form-management.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormInfoComponent, FormManagementComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent  implements OnInit {
  id: number = 0;
  selectTab: string = 'information';

  information$ = signal<OrderInfo | undefined>(undefined);
  management$ =  signal<OrderManagement | undefined>(undefined);  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dbServiceGestion: DbPruebaService,
    private apiServiceGestion: ServiceGestionService,
    private userInteractionService: UserInteractionService
  ) { 
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    await this.getOrder();
  }

  async getOrder() { 
    const resultGet = await this.dbServiceGestion.get(this.id);

    if (resultGet.estado !== TypeResponse.OK) {
      return await this.presentNotification(resultGet.mensaje);
    }

    const order = JSON.parse(resultGet.datos[0].datos) as Order

    this.information$.update(() => order.informacion);
    this.management$.update(() => order?.gestion);
  }

  onSelectTab(event: any) {
    this.selectTab = event?.detail?.value;
  }

  goList() {
    this.router.navigate(['test/gestion'])
  }

  async onSave(management: OrderManagement) {
    const order: Order = {
      informacion: this.information$()!,
      gestion: management
    };

    const resultUpdate = await this.dbServiceGestion.update(order, TypeState.GUARDADO);      
    if (resultUpdate.estado !== TypeResponse.OK) {
      return await this.presentNotification(resultUpdate.mensaje);
    }

    const resultApi = await this.apiServiceGestion.set$(order);      
    if (resultApi.estado !== TypeResponse.OK) {
      return await this.presentNotification(resultUpdate.mensaje);
    }
    
    const resultSincronized = await this.dbServiceGestion.update(order, TypeState.SINCRONIZADO);
    if (resultSincronized.estado !== TypeResponse.OK) {
      return await this.presentNotification(resultUpdate.mensaje);
    }

    await this.presentNotification('Gurdado con éxito', () => this.goList());
  }

  async presentNotification(msg: string, fun = () => {}) {
    await this.userInteractionService.presentAlertActions(
      msg,
      [ { text: 'ok', handler: () =>  fun() }]
    );
  }
}

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonicModule } from '@ionic/angular';

/**
 * Componente que presenta muestra un spinner de carga indicando que se esta realizando un proceso
 */
@Component({
  selector: 'app-loading',
  template: `
        <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-center" style="height: 70vh;">
                <ion-col class="ion-text-center">
                    <ion-spinner color="tertiary"></ion-spinner>
                    <ion-title class="ion-padding" color="tertiary">{{ message() }}</ion-title>
                </ion-col>
            </ion-row>
        </ion-grid>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule]
})
export class LoadingComponent  {
    message = input<string>('Cargando...');
    constructor() { }
}
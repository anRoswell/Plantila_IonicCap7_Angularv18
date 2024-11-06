import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { addIcons } from "ionicons";
import { closeCircleOutline } from 'ionicons/icons';

/**
 * Componente que presenta info cuando ocurre un error y no se pudo mostrar un contenido
 */
@Component({
  selector: 'app-error',
  template: `
        <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-center" style="height: 70vh;">
                <ion-col class="ion-text-center">
                    <ion-icon name="close-circle-outline" color="danger" size="big"></ion-icon>
                    <ion-title color="danger">Ocurrio un error</ion-title>
                    <ion-note class="ion-padding" color="danger">{{ message() }}</ion-note>
                </ion-col>
            </ion-row>
        </ion-grid>
    `,
    standalone: true,
    imports: [IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent  {
    message = input<string>();
    constructor() {
        this.addIcons();
    }

    addIcons() {
        addIcons({ closeCircleOutline });
    }
}
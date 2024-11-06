import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { addIcons } from "ionicons";
import { warningOutline } from 'ionicons/icons';

/**
 * Componente que presenta info cuando el contenido a mostrar se encuentra vacio
 */
@Component({
  selector: 'app-empty',
  template: `
        <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-center" style="height: 70vh;">
                <ion-col class="ion-text-center">
                    <ion-icon name="warning-outline" color="tertiary" size="big"></ion-icon>
                    <ion-title color="tertiary">{{ message() }}</ion-title>
                </ion-col>
            </ion-row>
        </ion-grid>
    `,
    standalone: true,
    imports: [IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent  {
    message = input<string>('No se encontraron registros');
    
    constructor() {
        this.addIcons();
    }

    addIcons() {
        addIcons({ warningOutline });
    }
}
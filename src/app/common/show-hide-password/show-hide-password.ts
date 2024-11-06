import { ChangeDetectionStrategy, Component, contentChild, ContentChild } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonInput } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

/**
 * Componente que crea un custom component para mostrar u ocultar un password de un ion-input
 */
@Component({
  selector: 'app-show-hide-password',
  template: `
    <ng-content></ng-content>
    <a class="type-toggle" (click)="toggleShow()">
      <ion-icon *ngIf="!showPassword && isNativePlatform" name="eye-off-outline"></ion-icon>
      <ion-icon *ngIf="showPassword && isNativePlatform" name="eye-outline"></ion-icon>
    </a>
  `,
  styles: [
    `
        :host {
            display: flex;
            width: 100%;
            align-items: center;

            .type-toggle {
                padding-inline-start: 0.5rem;
                font-size: 2rem;
                &:not(ion-icon) {
                    text-transform: uppercase;
                    font-size: 1.4rem;
                }
            }
        }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule]
})
export class ShowHidePasswordComponent {
  showPassword = false;
  isNativePlatform = Capacitor.isNativePlatform();
  input = contentChild.required<IonInput>(IonInput);
  constructor() {}
  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input().type = this.showPassword ? 'text' : 'password';
  }
}

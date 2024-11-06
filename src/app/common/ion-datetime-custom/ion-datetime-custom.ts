import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  input,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TypeFormatDate } from 'src/app/core/enums/TypeFormatDate';
import { format, parseISO } from 'date-fns';
import { IonicModule } from '@ionic/angular';

/**
 * Componente que crea un custom component a partir de un input type text y ion-datetime, la función transforma la salida
 * de la fecha internamente, el control maneja la fecha standard de html5 -> 'yyyy-MM-dd' y permite usar
 * un formato de fecha personalizada de salida que se recibe como parametro de entrada establecida por el usuario.
 * Recibe como parametro 'stateControlForm', que viene de los casos de formulario y determina el estado de componente,
 * con este parametro se controla la deshabilitación de los dias que puede seleccionar el usuario (TypeStatesFormGC).
 */
@Component({
  selector: 'app-ion-datetime-custom',
  template: `
    <ion-input
      readonly="true"
      [disabled]="!isEnabled"
      [value]="value"
      [label]="label()"
      labelPlacement="stacked"
      type="text"
      [id]="label()"
    >
    </ion-input>
    @if (isEnabled) {
      <ion-modal
      id="modaldate"
      [trigger]="label()"
      class="ion-padding"
    >
      <ng-template>
        <ion-datetime
          presentation="date"
          showDefaultTitle="true"
          showDefaultButtons="true"
          doneText="Ok"
          cancelText="Cancelar"
          size="cover"
          [max]="maxDate"
          [min]="minDate"
          (ionChange)="datetimeChange($event)"
        >
        </ion-datetime>
      </ng-template>
    </ion-modal>
    }
  `,
  styles: [
    `
      :host.ng-invalid ion-label,
      :host.ng-invalid ion-label.has-focus,
      :host.ng-invalid ion-input,
      :host.ng-invalid ion-input.has-focus {
        --color: var(--highlight-color-invalid);
        color: var(--highlight-color-invalid);
        caret-color: var(---highlight-color-invalid);
      }

      ion-modal#modaldate {
        --height: fit-content;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => IonDatetimeCustomComponent),
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IonDatetimeCustomComponent),
      multi: true,
    },
  ],
})
export class IonDatetimeCustomComponent {
  format = input<string>(TypeFormatDate.DEFAULT);
  label = input<string>();

  value: string | undefined;
  formatDefault = TypeFormatDate.DEFAULT;
  isDetectChangeActivate = false;
  minDate: string | undefined;
  maxDate: string | undefined;
  isEnabled = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  onChange: ((value: string) => void) | undefined;
  onTouched: (() => void) | undefined;

  writeValue(value: string): void {
    this.value = value;

    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl) {
    return control.valid ? null : { valid: false };
  }

  setDisabledState(isDisabled: boolean): void {
    // this.controlInput.disabled = isDisabled;
  }

  datetimeChange(event: any) {
    if (event?.detail?.value) {
      const transformDate = parseISO(event.detail.value);
      this.value = format(transformDate, this.format());
    } else {
      this.value = '';
    }

    if (this.onChange) {
      this.onChange(this.value!);
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  input,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { TypeFormatDate } from 'src/app/core/enums/TypeFormatDate';
import { format, parse } from 'date-fns';
import { IonicModule } from '@ionic/angular';

/**
 * Componente que crea un custom component a partir de un input type date, la función transforma la salida
 * de la fecha internamente, el control maneja la fecha standard de html5 -> 'yyyy-MM-dd' y permite usar
 * un formato de fecha personalizada de salida que se recibe como parametro de entrada establecida por el usuario
 */
@Component({
  selector: 'app-datetime-input',
  template: `
    <ion-input
      #datetime
      [value]="convertDate()"
      [label]="label"
      labelPlacement="stacked"
      type="date"
      (ionChange)="datetimeChange($event)"
    >
    </ion-input>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DateTimeInputComponent),
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [IonicModule]
})
export class DateTimeInputComponent {
  format = input<string>(TypeFormatDate.DEFAULT);
  label = input<string>();
  datetime = viewChild.required<IonInput>('datetime');

  value: string | undefined;
  formatDefault = TypeFormatDate.DEFAULT;

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

  public validate(control: AbstractControl) {
    return control.valid ? null : { valid: false };
  }

  setDisabledState(isDisabled: boolean): void {
    this.datetime().disabled = isDisabled;
  }

  datetimeChange(event: any) {
    const transformDate = parse(
      event.detail.value,
      this.formatDefault,
      new Date()
    );
    this.value = format(transformDate, this.format());

    if (this.onChange) {
      this.onChange(this.value!);
    }
  }

  convertDate(): string | null {
    if (this.value) {
      const transformValue = parse(this.value, this.format(), new Date());
      const transformedValue = format(transformValue, this.formatDefault);

      return transformedValue;
    }

    return '';
  }
}

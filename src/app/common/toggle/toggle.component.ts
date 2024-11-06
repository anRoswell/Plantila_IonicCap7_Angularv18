import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, forwardRef, viewChild } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonToggle, IonicModule } from '@ionic/angular';

/**
 * Componente que crea un custom toggle a partir de un ion-toggle, la función tranforma la salida del ion-toggle true/false a S/N
 */
@Component({
  selector: 'app-toggle',
  template: `
    <ion-toggle #toggle [checked]="value === 'S' ? true : false" (ionChange)="toggleChange($event)" (ionBlur)="onTouched!()">
      <ng-content></ng-content>
    </ion-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ToggleComponent)
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent  {
  toggle = viewChild.required<IonToggle>('toggle');
  
  value: string | undefined;

  constructor(private changeDetectorRef:  ChangeDetectorRef,) { }

  onChange: ((value: string) => void) | undefined;
  onTouched: (() => void) | undefined;

  writeValue(value: string): void {
    this.value = (!value || value.length === 0) ? 'N' : value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public validate(control: AbstractControl) {
    return (control.valid) ? null : { valid: false };
  }

  setDisabledState(isDisabled: boolean): void {
    this.toggle().disabled = isDisabled;
  }

  toggleChange(event: any) {
    this.value = event.detail.checked ?? 'N' ? 'S' : 'N';
    this.onChange!(this.value);
  }
}
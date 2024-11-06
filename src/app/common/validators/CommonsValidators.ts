import { parse } from 'date-fns';
import {
  AbstractControl,
  FormArray,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';
import { StepsService } from '../stepper/services/steps.service';

export class CommonsValidators {
  constructor(private stepService: StepsService) {}

  static compare(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl?.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        controls.get(checkControlName)?.setErrors({ error: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  /**
   *    Activa o desactiva un control de grupo de acuerdo al valor recibido en el control principal
   *    @param checkValue: Valor a chequear
   *    @param disabledTo: Array de nombres de controles a habilitar o deshabilitar de acuerdo a la evaluación
   *    @param mandatory: Si es true indica que el valor es obligatorio, no se puede inactivar.
   */
  static activeByValue(
    checkValue: any,
    disabledTo: string[],
    mandatory = false
  ): ValidatorFn {
    return (control: AbstractControl) => {
      this._activateByValue(control, checkValue, disabledTo, mandatory);

      return null;
    };
  }

  /**
   *    Funcion async para controles de tipo async que debe retornar una promise o un observable, y emit/resolve.
   *    Activa o desactiva un control de grupo de acuerdo al valor recibido en el control principal
   *    @param checkValue: Valor a chequear
   *    @param disabledTo: Array de nombres de controles a habilitar o deshabilitar de acuerdo a la evaluación
   *    @param mandatory: Si es true indica que el valor es obligatorio, no se puede inactivar.
   */
  static activeByValueAsync(
    checkValue: any,
    disabledTo: string[],
    mandatory = false
  ): ValidatorFn {
    return (control: AbstractControl) => {
      this._activateByValue(control, checkValue, disabledTo, mandatory);

      return of(null);
    };
  }

  /**
    Activa o desactiva un control de un grupo de acuerdo al valor recibido en el control principal
    @param checkValue: Valor a chequear
    @param controlIfTrue: Control a habilitar si es true
    @param controlIfFalse: Control a deshabilitar si es false
*/
  static ifValue(
    checkValue: any,
    controlIfTrue: string[],
    controlIfFalse: string[]
  ): ValidatorFn {
    return (
      control: AbstractControl,
    ) => {
      const controlValue = control.value;

      if (controlValue === checkValue) {
        for (let controlTo of controlIfTrue) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.enable();
            getControl?.addValidators(Validators.required); // si lo activa lo vuelve obligatorio
            getControl?.updateValueAndValidity();
          }
        }
        for (let controlTo of controlIfFalse) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.setValue(null);
            getControl?.disable();
          }
        }
      } else {
        for (let controlTo of controlIfTrue) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.setValue(null);
            getControl?.disable();
          }
        }
        for (let controlTo of controlIfFalse) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.enable();
          }
        }
      }

      return null;
    };
  }

  static minDate(validationDate: Date, formatDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlDate = parse(control.value, formatDate, new Date());

      if (!control.value) {
        return null;
      }

      return controlDate >= validationDate
        ? null
        : { minDate: { value: control.value } };
    };
  }

  static maxDate(validationDate: Date, formatDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlDate = parse(control.value, formatDate, new Date());

      if (!control.value) {
        return null;
      }

      return controlDate <= validationDate
        ? null
        : { maxDate: { value: control.value } };
    };
  }

  static equalDate(validationDate: Date, formatDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlDate = parse(control.value, formatDate, new Date());

      if (!control.value) {
        return null;
      }

      return controlDate !== validationDate
        ? null
        : { equalDate: { value: control.value } };
    };
  }

  /**
    Evlua el valor de un componente y hace un salto entre pasos
    @param checkValue: Valor a chequear
    @param controlSubForms: Control a habilitar/ deshabilitar de subforms se cumple o no la comparación
    @param stepService: Instancia del servicio de stepper
*/
  static ifValueJumpStep(
    checkValue: any,
    numStep: number,
    controlSubForms: string[],
    stepService: StepsService
  ): ValidatorFn {
    return (control: AbstractControl) => {
      const controlValue = control.value;

      if (controlValue === checkValue) {
        for (let controlTo of controlSubForms) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.disable();
          }
        }

        stepService.setJumpStep(numStep);
      } else {
        for (let controlTo of controlSubForms) {
          const getControl = control.root?.get(controlTo);
          if (getControl) {
            getControl?.enable();
          }
        }
      }

      return null;
    };
  }

  private static _activateByValue(
    control: AbstractControl,
    checkValue: any,
    disabledTo: string[],
    mandatory: boolean,
  ): void {
    const listControlTo: AbstractControl[] = [];
    const controlValue = control.value;

    for (let controlTo of disabledTo) {
      const getControl = control.root?.get(controlTo);
      if (getControl) {
        listControlTo.push(getControl);
      }
    }

    if (controlValue === checkValue) {
      for (let controlTo of listControlTo) {
        if (mandatory) {
          controlTo?.enable();
          controlTo?.setValue(true);
          controlTo?.disable();
        } else {
          controlTo?.enable();

          // si lo activa lo vuelve obligatorio
          controlTo?.addValidators(Validators.required);
        }

        controlTo?.updateValueAndValidity();
      }
    } else {
      for (let controlTo of listControlTo) {
        if (controlTo instanceof FormArray) {
          controlTo?.disable();
        } else {
          controlTo?.setValue(null);
          controlTo?.disable();
        }
      }
    }
  }
}

import { ChangeDetectionStrategy, Component, effect, input, OnChanges, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderManagement } from '../models/gestion';
import { TypeFormatDate } from 'src/app/core/enums/TypeFormatDate';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonDatetimeCustomComponent } from 'src/app/common/ion-datetime-custom/ion-datetime-custom';

@Component({
  selector: 'app-form-management',
  templateUrl: './form-management.component.html',
  styleUrls: ['./form-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, IonDatetimeCustomComponent],
})
export class FormManagementComponent {
  management = input<OrderManagement | undefined>();
  save = output<OrderManagement>();
  
  form: FormGroup = this.fb.group({});
  formatDate = TypeFormatDate.API;

  constructor(
    private fb: FormBuilder
  ) { 
    this.buildForm();
    this.loadInfoAtForm();
  }

  buildForm() {
    this.form = this.fb.group({
      gestion: ['', [Validators.required,]],
      resultado: ['', [Validators.required]],
      lectura_medidor: ['', [Validators.required]],
      valor_recaudo: ['', [Validators.required]],
      fecha_pago: ['', [Validators.required]],
    });
  }

  loadInfoAtForm() {
    effect(() => {
      if (this.management()) {
        this.form.setValue(this.management()!);
      }
    });
  }

  onSave(management: OrderManagement) {
    this.save.emit(management);
  }
}

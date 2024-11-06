import { ChangeDetectionStrategy, Component, input, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderInfo } from '../models/gestion';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-info',
  templateUrl: './form-info.component.html',
  styleUrls: ['./form-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class FormInfoComponent  implements OnChanges { 
  information = input<OrderInfo>();

  form: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    this.loadInfoAtForm();
  }

  buildForm() {
    this.form = this.fb.group({
      id: ['', [Validators.required,]],
      nic: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
    });
  }

  loadInfoAtForm() {
    if (this.information()!) {
      this.form.setValue(this.information()!);
    }
  }
}

import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnChanges, SimpleChanges, input } from '@angular/core';
import { StepModel } from '../../models/step.model';
import { StepsService } from '../../services/steps.service';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-step-template',
  templateUrl: './step-template.component.html',
  styleUrls: ['./step-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class StepTemplateComponent implements OnInit, OnChanges {
  label = input<string>();
  resume = input<string>();
  valid = input<boolean>(true);

  step!: StepModel;

  constructor(
    private stepService: StepsService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateStep(this.valid());
  }

  ngOnInit(): void {
    this.registerStep();
  }

  registerStep() {
    this.step = this.stepService.register(this.label(), this.resume(), this.valid());
  }

  updateStep(valid: boolean) {
    if (this.step?.stepIndex) {
      const index = this.step!.stepIndex - 1;
      this.stepService.updateValid(index, valid);
    }
  }

  getCurrentStep$(): Observable<StepModel> {
    return this.stepService.getCurrentStep$();
  }
}

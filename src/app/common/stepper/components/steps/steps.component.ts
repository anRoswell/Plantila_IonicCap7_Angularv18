import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { StepsService } from '../../services/steps.service';
import { StepModel } from '../../models/step.model';
import { Observable, of } from 'rxjs';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UserInteractionService } from 'src/app/core/services/general/user-interaction-service.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

const ANIMATION_TIMING = '600ms ease-out';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [IonicModule, CommonModule],
  animations: [
    trigger('animStep', [
      transition(':increment', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translate(100%, 0)' }),
              animate(
                ANIMATION_TIMING,
                style({ transform: 'translate(0, 0)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              animate(
                ANIMATION_TIMING,
                style({ transform: 'translate(-100%, 0)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition(':decrement', [
        group([
          query(
            ':enter',
            [
              style({ transform: 'translate(-100%, 0)' }),
              animate(
                ANIMATION_TIMING,
                style({ transform: 'translate(0, 0)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              animate(
                ANIMATION_TIMING,
                style({ transform: 'translate(100%, 0)' })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class StepsComponent implements OnInit {
  labelButtonFinish = input<string>();
  disabledButtonFinishOnClick = input<boolean>(false);
  eventFinish = output<void>();
  eventStep = output<void>();

  steps$: Observable<StepModel[]> = of([]);
  currentStep$: Observable<StepModel> = of();
  currentIndex = 0;
  isDisabledButtonFinish = false;

  constructor(
    public stepService: StepsService,
    public userInteractionService: UserInteractionService
  ) {}

  ngOnInit(): void {
    this.stepService.reset();
    this.steps$ = this.stepService.getSteps$();
    this.currentStep$ = this.stepService.getCurrentStep$();
    this.isDisabledButtonFinish = false;
  }

  async ionViewWillEnter() {
    this.isDisabledButtonFinish = false;
  }

  async onStepClick(step: StepModel) {
    const checkStep = await this.checkCurrenStep();

    if (!checkStep) {
      return;
    }

    this.stepService.setCurrentStep(step);
    this.currentIndex = step.stepIndex - 1;
  }

  async onNextStep() {
    const checkStep = await this.checkCurrenStep();

    if (!checkStep) {
      return;
    }

    this.stepService.moveToNextStep();
    this.currentIndex++;
    this.eventStep.emit();
  }

  async onPreviousStep() {
    const checkStep = await this.checkCurrenStep();

    if (!checkStep) {
      return;
    }

    this.stepService.moveToPreviousStep();
    this.currentIndex--;
    this.eventStep.emit();
  }

  async onFinish() {
    const checkStep = await this.checkCurrenStep();

    if (!checkStep) {
      return;
    }

    if (this.disabledButtonFinishOnClick()) {
      this.isDisabledButtonFinish = true;
    }

    this.eventFinish.emit();
  }

  async checkCurrenStep(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const currentStep = this.stepService.getCurrentStepByIndex(
        this.currentIndex
      );

      // informa de pendientes
      if (!currentStep.valid) {
        await this.userInteractionService.presentAlertActions(
          `Es necesario completar todos los campos requeridos en el formulario. Estos campos están marcados 
          con etiquetas en color rojo. Asegúrese de haberlos llenado correctamente antes de continuar.`
        );
      }
      
      return resolve(currentStep.valid);
    });    
  }
}

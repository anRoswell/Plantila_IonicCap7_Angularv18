import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StepModel } from '../models/step.model';

@Injectable({
  providedIn: 'root'
})
export class StepsService {
  steps$: BehaviorSubject<StepModel[]> = new BehaviorSubject<StepModel[]>([]);
  currentStep$: BehaviorSubject<StepModel> = new BehaviorSubject<StepModel>({} as StepModel);
  
  constructor() {}

  reset() {
    this.steps$.next([]);
  }

  register(label: string | null = null, resume: string | null = null, valid: boolean = true): StepModel {
    const step = {
      stepIndex: this.steps$.value.length + 1,
      label,
      resume,
      valid,
      isVisited: false
    }
    
    this.steps$.value.push(step);

    if (this.steps$.value.length === 1) {
      const currentStep: StepModel = this.steps$.value[0];
      currentStep.isVisited = true;
      this.currentStep$.next(this.steps$.value[0]);
    }
    
    return step;
  }

  updateValid(index: number, valid: boolean) {
    this.steps$.value[index].valid = valid;
  }

  setCurrentStep(step: StepModel): void {
    this.currentStep$.next(step);
  }

  setJumpStep(jumpIndex: number): void {
    let nextStep: StepModel | undefined;
    const currentIndex = this.currentStep$.value.stepIndex;

    for (let i = currentIndex; i < jumpIndex; i++) {
      nextStep = this.steps$.value[i];
      nextStep.isVisited = true;
    }

    // hace el salto
    if (nextStep !== undefined) {
      this.currentStep$.next(nextStep);
    }
  }

  getCurrentStep$(): Observable<StepModel> {
    return this.currentStep$.asObservable();
  }

  getSteps$(): Observable<StepModel[]> {
    return this.steps$.asObservable();
  }

  getCurrentStepByIndex(index: number): StepModel {
    return this.steps$.value[index];
  }

  moveToNextStep(): void {
    const index = this.currentStep$.value.stepIndex;

    if (index < this.steps$.value.length) {
      const nextStep: StepModel = this.steps$.value[index];
      nextStep.isVisited = true;
      this.currentStep$.next(nextStep);
    }
  }

  moveToPreviousStep(): void {
    const index = this.currentStep$.value.stepIndex - 2;

    if (index >= 0) {
      this.currentStep$.next(this.steps$.value[index]);
    }
  }

  isFirstStep(): Observable<boolean> {
    return of(this.currentStep$.value.stepIndex === 1);
  }

  isLastStep(): Observable<boolean> {
    return of(this.currentStep$.value.stepIndex === this.steps$.value.length);
  }
}

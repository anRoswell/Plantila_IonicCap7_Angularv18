export interface StepModel {
    stepIndex: number;
    label?: string | null;
    resume?: string | null;
    valid: boolean;
    isVisited: boolean;
}
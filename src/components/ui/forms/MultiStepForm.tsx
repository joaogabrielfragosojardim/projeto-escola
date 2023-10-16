import { type ReactNode } from 'react';

interface IMultiStepForm {
  forms: ReactNode[];
  step: number;
}
export const MultiStepForm = ({ forms, step }: IMultiStepForm) => {
  return forms[step];
};

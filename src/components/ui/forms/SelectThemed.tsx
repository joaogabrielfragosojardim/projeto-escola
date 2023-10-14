import type { InputHTMLAttributes } from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type RegisterOptions,
} from 'react-hook-form';

import { Select } from './Select';

interface SelectThemedProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  control: Control<any, any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
  options: { value: string; label: string }[];
}

const colourStyles: any = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    borderColor: '#4D4D4D',
  }),
};

export const SelectThemed = (props: SelectThemedProps) => {
  const { label, control, name, validations, error, options } = props;

  return (
    <div className="flex flex-col gap-[16px]">
      {label && (
        <label
          htmlFor={name}
          className="text-[14px] text-complement-200 lg:text-[20px]"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validations}
        render={({ field: { onChange, onBlur } }) => (
          <Select
            options={options}
            onChange={onChange}
            onBlur={onBlur}
            styles={colourStyles}
            placeholder="Selecione um Projeto"
          />
        )}
      />

      {error && (
        <span className="mt-[-6px] text-[12px] text-[red]">
          {error.message}
        </span>
      )}
    </div>
  );
};

import type { InputHTMLAttributes } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

interface InputThemedProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
}

export const InputCheckBoxThemed = (props: InputThemedProps) => {
  const { label, register, name, validations, error } = props;

  return (
    <div>
      <div className="flex items-center gap-[16px]">
        <input
          {...props}
          type="checkbox"
          className="h-[26px] w-[26px] rounded-[5px] text-[14px]"
          id={name}
          {...register(name, validations)}
        />
        <label
          htmlFor={name}
          className="text-[12px] text-complement-200 lg:text-[14px]"
        >
          {label}
        </label>
      </div>
      {error && (
        <span className="mt-[-6px] text-[12px] text-[red]">
          {error.message}
        </span>
      )}
    </div>
  );
};

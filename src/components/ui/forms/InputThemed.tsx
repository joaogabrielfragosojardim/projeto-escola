import type { InputHTMLAttributes } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

interface InputThemedProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
}

export const InputThemed = (props: InputThemedProps) => {
  const { label, register, name, validations, error } = props;

  return (
    <div className="flex flex-col gap-[16px]">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        {...props}
        className="w-full rounded-[5px] border-[1px] border-solid border-complement p-[8px] text-[16px]"
        id={name}
        {...register(name, validations)}
      />
      {error && (
        <span className="mt-[-6px] text-[12px] text-[red]">
          {error.message}
        </span>
      )}
    </div>
  );
};

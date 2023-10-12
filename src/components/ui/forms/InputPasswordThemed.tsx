import { type InputHTMLAttributes, useState } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputThemedProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
}

export const InputPasswordThemed = (props: InputThemedProps) => {
  const [hidde, setHidde] = useState(false);
  const { label, register, name, validations, error } = props;

  return (
    <div className="flex flex-col gap-[16px]">
      {label && (
        <label htmlFor={name} className="text-[20px] text-complement-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={!hidde ? 'password' : 'text'}
          className="w-full rounded-[5px] border-[1px] border-solid border-complement-200 p-[8px] text-[16px]"
          id={name}
          {...register(name, validations)}
          maxLength={32}
        />
        <button
          type="button"
          className="absolute right-[15px] top-[50%] translate-y-[-50%]"
          onClick={() => {
            setHidde((prev) => !prev);
          }}
        >
          {!hidde ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && (
        <span className="mt-[-6px] text-[12px] text-[red]">
          {error.message}
        </span>
      )}
    </div>
  );
};

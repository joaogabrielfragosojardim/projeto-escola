import type { InputHTMLAttributes } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

interface InputCheckBoxThemedProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
}

export const InputCheckBoxThemed = (props: InputCheckBoxThemedProps) => {
  const { label, register, name, validations, error } = props;

  return (
    <div>
      <div className="flex items-center gap-[16px]">
        <input
          {...props}
          type="checkbox"
          className="h-[18px] w-[18px] rounded-[5px] text-[14px] 2xl:h-[26px] 2xl:w-[26px]"
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
        <span className="mt-[-6px] text-[12px] text-wrong">
          {error.message}
        </span>
      )}
    </div>
  );
};

import type { InputHTMLAttributes } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import InputMask from 'react-input-mask';

interface InputThemedProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
  mask?: string;
}

export const InputThemed = (props: InputThemedProps) => {
  const { label, register, name, validations, error } = props;

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
      {props.mask ? (
        // @ts-ignore
        <InputMask
          className="w-full rounded-[5px] border-[1px] border-solid border-complement-200 p-[8px] text-[12px] disabled:bg-complement-100 disabled:placeholder:text-complement-200 lg:text-[16px]"
          id={name}
          {...register(name, validations)}
          {...props}
        />
      ) : (
        <input
          className="w-full rounded-[5px] border-[1px] border-solid border-complement-200 p-[8px] text-[12px] disabled:bg-complement-100 disabled:placeholder:text-complement-200 lg:text-[16px]"
          id={name}
          {...register(name, validations)}
          {...props}
        />
      )}
      {error && (
        <span className="mt-[-6px] text-[12px] text-wrong">
          {error.message}
        </span>
      )}
    </div>
  );
};

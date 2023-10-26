import Image from 'next/image';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { useState } from 'react';
import type {
  FieldError,
  RegisterOptions,
  UseFormRegister,
  UseFormReset,
} from 'react-hook-form';
import { GoPaperclip } from 'react-icons/go';
import { RxImage } from 'react-icons/rx';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'react-toastify';

import { getImageInSupabase } from '@/utils/supabase/getImageInSupabase';
import { storeImageInSupabase } from '@/utils/supabase/storeImageInSupabase';

interface InputImageThemedProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegister<any>;
  name: string;
  validations?: RegisterOptions<any, string>;
  error?: FieldError | undefined;
  reset: UseFormReset<any>;
}

export const InputImageThemed = (props: InputImageThemedProps) => {
  const [image, setImage] = useState('' || (props.defaultValue as string));
  const [loading, setLoading] = useState(false);
  const { label, register, name, validations, error, reset } = props;

  const handleChangeImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const data = await storeImageInSupabase(file);
      const imagePath = getImageInSupabase(data?.path || '').publicUrl || '';
      setImage(imagePath);
      reset({ [name]: imagePath });
      setLoading(false);
    } catch {
      toast.error('Algo de errado aconteceu ao fazer o upload da imagem!');
      setLoading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="text-[14px] text-complement-200 lg:text-[20px]"
      >
        {label}
      </label>
      <div
        className={`relative mt-[24px] flex items-center gap-[16px] ${
          loading ? 'opacity-60' : ''
        }`}
      >
        <div className="relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[100%] bg-complement-100 text-main">
          {loading ? (
            <div className="animate-spin">
              <TbLoader size={32} />
            </div>
          ) : image ? (
            <Image
              src={image}
              alt="project visual identity"
              fill
              className="object-cover"
            />
          ) : (
            <RxImage size={32} />
          )}
        </div>
        <div className="flex items-center gap-[6px] rounded-[5px] bg-main p-[6px] text-[14px] text-complement-100 lg:text-[16px]">
          <GoPaperclip />
          <p>Escolher Imagem</p>
        </div>
        <div className="absolute h-full w-full cursor-pointer">
          <input
            type="file"
            className="h-full w-full cursor-pointer text-[14px] opacity-0"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleChangeImage}
            disabled={loading}
          />
          <input
            {...props}
            className="hidden w-full rounded-[5px] border-[1px] border-solid border-complement-200 p-[8px] text-[16px]"
            id={name}
            {...register(name, validations)}
          />
        </div>
      </div>
      {error && (
        <span className="mt-[-6px] text-[12px] text-wrong">
          {error.message}
        </span>
      )}
    </div>
  );
};

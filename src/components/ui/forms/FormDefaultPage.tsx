import Image from 'next/image';
import type { ReactNode } from 'react';
import React from 'react';

export const FormDefaultPage = ({
  image,
  form,
}: {
  image: string;
  form: ReactNode;
}) => {
  return (
    <div className="flex justify-between">
      <div className="w-full px-[122px] py-[32px]">{form}</div>
      <div className="relative min-h-[100vh] w-full">
        <Image
          src={image}
          alt="image-form-create"
          className="object-cover"
          fill
        />
      </div>
    </div>
  );
};

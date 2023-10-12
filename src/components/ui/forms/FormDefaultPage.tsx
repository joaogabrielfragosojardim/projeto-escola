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
      <div className="w-full px-[26px] py-[32px] lg:px-[122px]">{form}</div>
      <div className="relative hidden min-h-[100vh] w-full lg:inline">
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

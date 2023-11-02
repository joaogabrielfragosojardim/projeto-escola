import Image from 'next/image';
import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosArrowDown } from 'react-icons/io';
import { LuBell } from 'react-icons/lu';
import { RxPerson } from 'react-icons/rx';

import { useUser } from '@/store/user/context';

export const Header = ({ title }: { title: string }) => {
  const user = useUser();
  return (
    <>
      <div className="hidden w-full items-center justify-between border-b-[1px] border-solid border-complement-100 px-[40px] pb-[16px] pt-[32px] text-complement-200 2xl:flex">
        <div>
          <span className="text-[34px]">{title}</span>
        </div>
        <div className="flex items-center gap-[16px]">
          <div className="cursor-pointer">
            <LuBell size={22} />
          </div>
          <div className="flex items-center gap-[16px] rounded-[8px] bg-main p-[16px] text-[20px] text-complement-100">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-complement-100 text-complement-200">
              <RxPerson />
            </div>
            <span>{user.name}</span>
            <div>
              <IoIosArrowDown size={16} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-main px-[20px] py-[8px] text-complement-100 2xl:hidden">
        <div>
          <GiHamburgerMenu size={30} />
        </div>
        <div className="relative h-[32px] w-[92px]">
          <Image
            src="/assets/images/logo-reduced-white.png"
            alt="logo branca"
            fill
            quality={100}
          />
        </div>
        <div className="flex items-center gap-[16px] rounded-[8px] bg-main p-[16px] text-[20px] text-complement-100">
          <div className="cursor-pointer">
            <LuBell size={22} />
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[50%] bg-complement-100 text-complement-200">
            <RxPerson />
          </div>
        </div>
      </div>
    </>
  );
};

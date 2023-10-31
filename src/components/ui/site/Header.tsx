import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
  AiFillYoutube,
  AiOutlineInstagram,
  AiOutlineWhatsApp,
} from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';

import { phoneSite } from '@/constants/contacts';

export const Header = () => {
  return (
    <header>
      <div className="mx-auto hidden max-w-[1194px] items-center justify-between xl:flex">
        <div className="relative h-[50px] w-[165px]">
          <Image src="/assets/images/logo.png" alt="Escola Prime Logo" fill />
        </div>
        <ul className="flex gap-[40px] py-[24px] text-[16px] text-complement-200">
          <li>
            <Link href="#hoWeAre">Quem somos</Link>
          </li>
          <li>
            <Link href="#hoWeAre">Projetos</Link>
          </li>
          <li>
            <Link href="#hoWeAre">Depoimentos</Link>
          </li>
        </ul>
        <div className="flex items-center gap-[40px]">
          <ul className="flex gap-[16px]">
            <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
              <Link href="https://www.youtube.com/@escolaprime" target="_blank">
                <AiFillYoutube size={15} />
              </Link>
            </li>
            <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
              <Link
                href="https://www.instagram.com/escola.prime"
                target="_blank"
              >
                <AiOutlineInstagram size={15} />
              </Link>
            </li>
            <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
              <Link href={phoneSite} target="_blank">
                <AiOutlineWhatsApp size={15} />
              </Link>
            </li>
          </ul>
          <Link
            href="/login"
            className="rounded bg-main px-[32px] py-[8px] text-complement-100"
          >
            Entrar
          </Link>
        </div>
      </div>
      <div className="bg-main p-[8px] xl:hidden">
        <div className="mx-auto flex max-w-[1194px] items-center justify-between ">
          <div />
          <div className="relative h-[49px] w-[136px]">
            <Image
              src="/assets/images/logo.png"
              alt="Escola Prime Logo"
              fill
              className="brightness-0 invert"
              quality={100}
            />
          </div>

          <div className="flex items-center gap-[40px]">
            <button
              type="button"
              className="rounded bg-main px-[32px] py-[8px] text-complement-100"
            >
              <GiHamburgerMenu size={30} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

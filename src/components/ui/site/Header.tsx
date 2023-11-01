import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  AiFillYoutube,
  AiOutlineInstagram,
  AiOutlineWhatsApp,
} from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { Link as SmoothLink } from 'react-scroll';

import { phoneSite } from '@/constants/contacts';

export const Header = () => {
  const [modal, setModal] = useState(false);
  return (
    <header>
      <div className="mx-auto hidden max-w-[1194px] items-center justify-between xl:flex">
        <div className="relative h-[50px] w-[165px]">
          <Image src="/assets/images/logo.png" alt="Escola Prime Logo" fill />
        </div>
        <ul className="flex gap-[40px] py-[24px] text-[16px] text-complement-200">
          <li className="cursor-pointer">
            <SmoothLink smooth to="hoWeAre" offset={-40}>
              Quem somos
            </SmoothLink>
          </li>
          <li className="cursor-pointer">
            <SmoothLink smooth to="projects" offset={-40}>
              Projetos
            </SmoothLink>
          </li>
          <li className="cursor-pointer">
            <SmoothLink smooth to="feedbacks" offset={-40}>
              Depoimentos
            </SmoothLink>
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
      <div className="fixed left-0 top-0 z-[100] w-full bg-main p-[8px] xl:hidden">
        <div className="mx-auto flex max-w-[1194px] items-center justify-between ">
          <div />
          <div className="relative mt-[-6px] h-[49px] w-[146px]">
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
              className="rounded bg-main px-[32px] py-[8px] text-[white]"
              onClick={() => {
                setModal((prev) => !prev);
              }}
            >
              {modal ? <IoClose size={30} /> : <GiHamburgerMenu size={30} />}
            </button>
          </div>
        </div>
        <div
          className={`p-[28px] text-complement-100 ${
            modal ? 'inline' : 'hidden'
          }`}
        >
          <div className="ml-[28px]">
            <ul className="flex flex-col gap-[16px]">
              <li className="cursor-pointer">
                <SmoothLink smooth to="hoWeAre" offset={-40}>
                  Quem somos
                </SmoothLink>
              </li>
              <li className="cursor-pointer">
                <SmoothLink smooth to="projects" offset={-40}>
                  Projetos
                </SmoothLink>
              </li>
              <li className="cursor-pointer">
                <SmoothLink smooth to="feedbacks" offset={-40}>
                  Depoimentos
                </SmoothLink>
              </li>
              <li>
                <Link
                  href="/login"
                  className="rounded bg-complement-100 px-[32px] py-[8px] text-main"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>
          <div className="ml-[28px] mt-[48px] flex items-center gap-[40px]">
            <ul className="flex gap-[16px]">
              <li className="rounded-[50%] bg-complement-100 p-[10px] text-main">
                <Link
                  href="https://www.youtube.com/@escolaprime"
                  target="_blank"
                >
                  <AiFillYoutube size={15} />
                </Link>
              </li>
              <li className="rounded-[50%] bg-complement-100 p-[10px] text-main">
                <Link
                  href="https://www.instagram.com/escola.prime"
                  target="_blank"
                >
                  <AiOutlineInstagram size={15} />
                </Link>
              </li>
              <li className="rounded-[50%] bg-complement-100 p-[10px] text-main">
                <Link href={phoneSite} target="_blank">
                  <AiOutlineWhatsApp size={15} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';

import { sideNavMenuRoutes } from '@/routes/sideNavMenuRoutes';
import { sideNavMenuRoutesBottom } from '@/routes/sideNavMenuRoutesBottom';
import { useUser } from '@/store/user/context';
import type { RoleEnum } from '@/types/roles';

import { renderMenuWithChildren } from './SideNavMenu';

export const Header = ({ title }: { title: string }) => {
  const [menu, setMenu] = useState(false);
  const {
    role: { name },
    ...user
  } = useUser();
  const menuRoutes = sideNavMenuRoutes(name as RoleEnum);

  useEffect(() => {
    if (menu) {
      document.body.classList.add('disable-scroll');
    } else {
      document.body.classList.remove('disable-scroll');
    }
  }, [menu]);

  return (
    <>
      <div className="hidden w-full items-center justify-between border-b-[1px] border-solid border-complement-100 px-[40px] pb-[16px] pt-[32px] text-complement-200 2xl:flex">
        <div>
          <span className="text-[34px]">{title}</span>
        </div>
        <div className="flex items-center gap-[16px]">
          <Link
            href="/profile"
            className="flex items-center gap-[16px] rounded-[8px] bg-main p-[16px] text-[20px] text-complement-100"
          >
            <div className="relative flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-[50%] bg-complement-100 text-complement-200">
              <Image
                alt="imagem de usuario"
                fill
                objectFit="cover"
                src={
                  user?.visualIdentity || '/assets/images/default-profile.png'
                }
              />
            </div>
            <span>{user.name}</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between bg-main px-[20px] py-[8px] text-complement-100 2xl:hidden">
        <div className="flex-1">
          <button
            type="button"
            className="text-complement-100"
            onClick={() => {
              setMenu(true);
            }}
          >
            <GiHamburgerMenu size={30} />
          </button>
        </div>
        <Link
          href="/dashboard"
          className="relative mt-[-8px] h-[32px] w-[92px] max-w-[92px] flex-1"
        >
          <Image
            src="/assets/images/logo-reduced-white.png"
            alt="logo branca"
            fill
            quality={100}
          />
        </Link>
        <div className="flex flex-1 items-center justify-end gap-[16px] rounded-[8px] bg-main p-[16px] text-[20px] text-complement-100">
          <Link
            href="/profile"
            className="relative flex h-[26px] w-[26px] items-center justify-center overflow-hidden rounded-[50%] bg-complement-100 text-complement-200"
          >
            <Image
              alt="imagem de usuario"
              fill
              src={user?.visualIdentity || '/assets/images/default-profile.png'}
            />
          </Link>
        </div>
      </div>
      {menu && (
        <div className="absolute left-0 top-0 z-50 flex min-h-screen w-full flex-col bg-main p-[20px]">
          <div className="flex w-full justify-end">
            <button
              type="button"
              className="text-complement-100"
              onClick={() => {
                setMenu(false);
              }}
            >
              <IoClose size={30} />
            </button>
          </div>
          <Link href="/dashboard" className="relative h-[60px] w-[172px]">
            <Image
              alt="escola prime logo"
              src="/assets/images/logo-reduced-white.png"
              fill
            />
          </Link>
          <div className="mt-[32px]">
            <ul className="flex flex-col gap-[8px]">
              {menuRoutes.map((route) =>
                renderMenuWithChildren(route, router, setMenu),
              )}
            </ul>
          </div>
          <div className="mt-auto">
            <ul className="flex flex-col gap-[16px]">
              {sideNavMenuRoutesBottom.map((route) => (
                <li
                  key={route.name}
                  className={`rounded-l-[8px] p-[6px] ${
                    router.pathname === route.route
                      ? 'bg-complement-100 text-main'
                      : 'bg-[transparent] text-complement-100'
                  }`}
                >
                  <Link href={route.route}>
                    <div className="flex items-center gap-[16px]">
                      {route.icon}
                      <span className="text-[20px]">{route.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

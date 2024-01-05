import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ReactNode, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { sideNavMenuRoutes } from '@/routes/sideNavMenuRoutes';
import { sideNavMenuRoutesBottom } from '@/routes/sideNavMenuRoutesBottom';
import { useUser } from '@/store/user/context';
import type { RoleEnum } from '@/types/roles';

interface RouteInterface {
  name: string;
  route: string;
  userCanView: boolean;
  icon: ReactNode;
  children?: RouteInterface[];
}

export const GenerateDropdown = ({
  childrenRoute,
  routerDrop,
  setMenu,
}: {
  childrenRoute: RouteInterface;
  routerDrop: { pathname: string };
  setMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [closed, setClosed] = useState(false);

  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => {
        setClosed((prev) => !prev);
      }}
    >
      <div className="flex items-center gap-[16px]">
        {childrenRoute.icon}
        <span className="text-[20px]">{childrenRoute.name}</span>
        <div className={`transition-all ${!closed ? '' : 'rotate-180'}`}>
          <IoIosArrowDown />
        </div>
      </div>
      <ul
        className={`flex flex-col gap-[8px] pl-[16px] transition-all ${
          !closed ? 'h-[0px] overflow-hidden' : 'mt-[16px] h-[auto] '
        }`}
      >
        {childrenRoute?.children?.map((children) =>
          renderMenuWithChildren(children, routerDrop, setMenu),
        )}
      </ul>
    </button>
  );
};

export const renderMenuWithChildren = (
  route: RouteInterface,
  router: { pathname: string },
  setMenu?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return (
    <li
      key={route.name}
      className={`rounded-l-[8px] p-[6px] ${
        router.pathname === route.route
          ? 'bg-complement-100 text-main'
          : 'bg-[transparent] text-complement-100'
      } ${route.userCanView ? '' : 'hidden'}`}
    >
      {route.children ? (
        <GenerateDropdown
          childrenRoute={route}
          routerDrop={router}
          setMenu={setMenu}
        />
      ) : (
        <Link
          href={route.route}
          onClick={() => (setMenu ? setMenu(false) : null)}
        >
          <div className="flex items-center gap-[16px] ">
            {route.icon}
            <span className="text-[20px]">{route.name}</span>
          </div>
        </Link>
      )}
    </li>
  );
};

export const SideNavMenu = () => {
  const router = useRouter();
  const {
    role: { name },
  } = useUser();

  const menuRoutes = sideNavMenuRoutes(name as RoleEnum);

  return (
    <div className="sticky left-0 top-0 hidden h-full min-h-[100vh] min-w-[296px] max-w-[296px] flex-col bg-main py-[32px] pl-[32px] 2xl:flex">
      <Link href="/dashboard" className="relative h-[60px] w-[172px]">
        <Image
          alt="escola prime logo"
          src="/assets/images/logo-reduced-white.png"
          fill
        />
      </Link>
      <div className="mt-[32px]">
        <ul className="flex flex-col gap-[8px]">
          {menuRoutes.map((route) => renderMenuWithChildren(route, router))}
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
  );
};

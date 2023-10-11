import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import { useUserIsTeacher } from '@/hooks/useUserIsTeacher';
import { sideNavMenuRoutes } from '@/routes/sideNavMenuRoutes';
import { sideNavMenuRoutesBottom } from '@/routes/sideNavMenuRoutesBottom';

interface RouteInterface {
  name: string;
  route: string;
  userCanView: boolean;
  icon: ReactNode;
  children?: RouteInterface[];
}

const renderMenuWithChildren = (
  route: RouteInterface,
  router: { pathname: string },
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
        <div>
          <div className="flex items-center gap-[16px]">
            {route.icon}
            <span className="text-[20px]">{route.name}</span>
          </div>
          <ul className="mt-[16px] flex flex-col gap-[8px] pl-[16px]">
            {route.children.map((children) =>
              renderMenuWithChildren(children, router),
            )}
          </ul>
        </div>
      ) : (
        <Link href={route.route}>
          <div className="flex items-center gap-[16px]">
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
  const isAdmMaster = useUserIsAdmMaster();
  const isAdm = useUserIsAdm();
  const isCoordinator = useUserIsCoordinator();
  const isTeacher = useUserIsTeacher();
  const menuRoutes = sideNavMenuRoutes({
    isAdmMaster,
    isAdm,
    isCoordinator,
    isTeacher,
  });

  return (
    <div className="flex h-[100vh] min-w-[296px] max-w-[296px] flex-col bg-main py-[32px] pl-[32px]">
      <div className="relative h-[60px] w-[172px]">
        <Image
          alt="escola prime logo"
          src="/assets/images/logo-reduced-white.png"
          fill
        />
      </div>
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

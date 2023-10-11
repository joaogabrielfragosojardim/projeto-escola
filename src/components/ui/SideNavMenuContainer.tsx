import type { ReactNode } from 'react';
import React from 'react';

import { Header } from './Header';
import { SideNavMenu } from './SideNavMenu';

export const SideNavMenuContainer = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div className="flex">
      <SideNavMenu />
      <div className="w-full">
        <Header title={title} />
        {children}
      </div>
    </div>
  );
};

import type { ReactNode } from 'react';
import React from 'react';

import { CoordinatorFormProvider } from './coordinatorForm/context';
import { InitialConfigs } from './InitialConfigs';
import { SchoolFormProvider } from './schoolForm/context';
import { SocialEducatorFormProvider } from './socialEducatorForm/context';
import { UserProvider } from './user/context';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <SchoolFormProvider>
        <CoordinatorFormProvider>
          <SocialEducatorFormProvider>
            <InitialConfigs>{children}</InitialConfigs>
          </SocialEducatorFormProvider>
        </CoordinatorFormProvider>
      </SchoolFormProvider>
    </UserProvider>
  );
};

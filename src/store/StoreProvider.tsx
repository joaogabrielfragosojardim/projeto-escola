import type { ReactNode } from 'react';
import React from 'react';

import { InitialConfigs } from './InitialConfigs';
import { SchoolFormProvider } from './schoolForm/context';
import { UserProvider } from './user/context';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <SchoolFormProvider>
        <InitialConfigs>{children}</InitialConfigs>
      </SchoolFormProvider>
    </UserProvider>
  );
};

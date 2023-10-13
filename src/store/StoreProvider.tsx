import type { ReactNode } from 'react';
import React from 'react';

import { InitialConfigs } from './InitialConfigs';
import { UserProvider } from './user/context';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <InitialConfigs>{children}</InitialConfigs>
    </UserProvider>
  );
};

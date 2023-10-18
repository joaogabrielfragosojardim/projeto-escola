import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { User } from '@/types/user';

import { initialState } from './initialState';
import { userReducer } from './reducer';
import type { UserAction } from './types';

type UseUserDispatchType = () => (action: UserAction) => any;

const UserContext = createContext<User>(initialState);

const UserDispatchContext = createContext<UseUserDispatchType>(
  {} as UseUserDispatchType,
);

export const useUser = () => {
  return useContext(UserContext) as unknown as User;
};

export const useUserDispatch = () => {
  return useContext(UserDispatchContext);
};

// apenas para context dev tools
const displayName = { displayName: 'user' };

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(
    userReducer as unknown as any,
    initialState,
  );

  return (
    <UserContext.Provider value={user as unknown as any} {...displayName}>
      <UserDispatchContext.Provider value={dispatch as unknown as any}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

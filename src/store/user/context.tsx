import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import { initialState } from './initialState';
import { userReducer } from './reducer';

const UserContext = createContext(null);

const UserDispatchContext = createContext(null);

export const useUser: () => any = () => {
  return useContext(UserContext);
};

export const useUserDispatch: () => any = () => {
  return useContext(UserDispatchContext);
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={user as unknown as any}>
      <UserDispatchContext.Provider value={dispatch as unknown as any}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

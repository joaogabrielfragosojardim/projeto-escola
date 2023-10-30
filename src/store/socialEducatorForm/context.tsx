import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { SocialEducator } from '@/types/socialEducator';

import { initialState } from './initialState';
import { socialEducatorFormReducer } from './reducer';
import type { SocialEducatorFormAction } from './types';

type UseSocialEducatorDispatchType = (action: SocialEducatorFormAction) => any;

const SocialEducatorFormContext = createContext<SocialEducator>(initialState);

const SocialEducatorDispatchContext =
  createContext<UseSocialEducatorDispatchType>(
    {} as UseSocialEducatorDispatchType,
  );

export const useSocialEducatorForm = () => {
  return useContext(SocialEducatorFormContext) as unknown as SocialEducator;
};

export const useSocialEducatorFormDispatch = () => {
  return useContext(SocialEducatorDispatchContext);
};

// apenas para context dev tools
const displayName = { displayName: 'socialEducatorForm' };

export function SocialEducatorFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [socialEducatorForm, dispatch] = useReducer(
    socialEducatorFormReducer as unknown as any,
    initialState,
  );

  return (
    <SocialEducatorFormContext.Provider
      value={socialEducatorForm as unknown as any}
      {...displayName}
    >
      <SocialEducatorDispatchContext.Provider
        value={dispatch as unknown as any}
      >
        {children}
      </SocialEducatorDispatchContext.Provider>
    </SocialEducatorFormContext.Provider>
  );
}

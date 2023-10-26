import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { Coordinator } from '@/types/coordinator';

import { initialState } from './initialState';
import { coordinatorFormReducer } from './reducer';
import type { CoordinatorAction } from './types';

type UseCoordinatorDispatchType = (action: CoordinatorAction) => any;

const CoordinatorFormContext = createContext<Coordinator>(initialState);

const CoordinatorFormDispatchContext = createContext(
  {} as UseCoordinatorDispatchType,
);

export const useCoordinatorForm = () => {
  return useContext(CoordinatorFormContext);
};

export const useCoordinatorFormDispatch = () => {
  return useContext(CoordinatorFormDispatchContext);
};

// apenas para context dev tools
const displayName = { displayName: 'coordinatorForm' };

export function CoordinatorFormProvider({ children }: { children: ReactNode }) {
  const [coordinatorForm, dispatch] = useReducer(
    coordinatorFormReducer as unknown as any,
    initialState,
  );

  return (
    <CoordinatorFormContext.Provider
      value={coordinatorForm as unknown as any}
      {...displayName}
    >
      <CoordinatorFormDispatchContext.Provider
        value={dispatch as unknown as any}
      >
        {children}
      </CoordinatorFormDispatchContext.Provider>
    </CoordinatorFormContext.Provider>
  );
}

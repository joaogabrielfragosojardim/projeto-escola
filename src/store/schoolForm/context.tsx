import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { School } from '@/types/school';

import { initialState } from './initialState';
import { schoolFormReducer } from './reducer';
import type { SchoolAction } from './types';

type UseSchoolDispatchType = () => (action: SchoolAction) => any;

const SchoolFormContext = createContext<School>(initialState);

const SchoolFormDispatchContext = createContext({} as UseSchoolDispatchType);

export const useSchoolForm = () => {
  return useContext(SchoolFormContext);
};

export const useSchoolFormDispatch = () => {
  return useContext(SchoolFormDispatchContext);
};

// apenas para context dev tools
const displayName = { displayName: 'schoolForm' };

export function SchoolFormProvider({ children }: { children: ReactNode }) {
  const [schoolForm, dispatch] = useReducer(
    schoolFormReducer as unknown as any,
    initialState,
  );

  return (
    <SchoolFormContext.Provider
      value={schoolForm as unknown as any}
      {...displayName}
    >
      <SchoolFormDispatchContext.Provider value={dispatch as unknown as any}>
        {children}
      </SchoolFormDispatchContext.Provider>
    </SchoolFormContext.Provider>
  );
}

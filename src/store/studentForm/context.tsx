import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';

import type { StudentId } from '@/types/student';

import { initialState } from './initialState';
import { studentFormReducer } from './reducer';
import type { StudentFormAction } from './types';

type UseStudentFormDispatchType = (action: StudentFormAction) => any;

const StudentFormDispatch = createContext<StudentId>(initialState);

const StudentFormDispatchContext = createContext<UseStudentFormDispatchType>(
  {} as UseStudentFormDispatchType,
);

export const useStudentForm = () => {
  return useContext(StudentFormDispatch) as unknown as StudentId;
};

export const useStudentFormDispatch = () => {
  return useContext(StudentFormDispatchContext);
};

// apenas para context dev tools
const displayName = { displayName: 'studentForm' };

export function StudentFormProvider({ children }: { children: ReactNode }) {
  const [studentForm, dispatch] = useReducer(
    studentFormReducer as unknown as any,
    initialState,
  );

  return (
    <StudentFormDispatch.Provider
      value={studentForm as unknown as any}
      {...displayName}
    >
      <StudentFormDispatchContext.Provider value={dispatch as unknown as any}>
        {children}
      </StudentFormDispatchContext.Provider>
    </StudentFormDispatch.Provider>
  );
}

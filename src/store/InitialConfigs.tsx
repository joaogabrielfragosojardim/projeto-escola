import { parseCookies } from 'nookies';
import type { ReactNode } from 'react';

import { useUser, useUserDispatch } from './user/context';
import { UserTypesEnum } from './user/types';

export const InitialConfigs = ({ children }: { children: ReactNode }) => {
  const {
    id,
    name,
    email,
    role: { name: roleName },
  } = useUser();
  const userDispatch = useUserDispatch();

  const { user: userCookies, token } = parseCookies();

  if ((!id || !name || !email || !roleName) && token) {
    const {
      id: idCookies,
      name: nameCookies,
      email: emailCookies,
      role: { name: roleNameCookies },
    } = JSON.parse(userCookies || '');
    userDispatch({
      type: UserTypesEnum.ADD_USER,
      payload: {
        id: idCookies,
        name: nameCookies,
        email: emailCookies,
        role: { name: roleNameCookies },
      },
    });
  }

  return <div>{children}</div>;
};
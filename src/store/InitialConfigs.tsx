import { parseCookies } from 'nookies';
import { type ReactNode, useEffect } from 'react';

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

  useEffect(() => {
    if ((!id || !name || !email || !roleName) && token) {
      const {
        id: idCookies,
        name: nameCookies,
        email: emailCookies,
        role: { name: roleNameCookies },
        visualIdentity: { visualIdentityCookies },
      } = JSON.parse(userCookies || '');
      userDispatch({
        type: UserTypesEnum.ADD_USER,
        payload: {
          id: idCookies,
          name: nameCookies,
          email: emailCookies,
          role: { name: roleNameCookies },
          visualIdentity: visualIdentityCookies,
        },
      });
    }
  }, [email, id, name, roleName, token, userCookies, userDispatch]);

  return <div>{children}</div>;
};

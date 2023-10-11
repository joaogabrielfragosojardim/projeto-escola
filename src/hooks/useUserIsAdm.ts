import { useUser } from '@/store/user/context';
import { RoleEnum } from '@/types/roles';

export const useUserIsAdm = () => {
  const user = useUser();

  if (user.role.name === RoleEnum.ADM) {
    return true;
  }
  return false;
};

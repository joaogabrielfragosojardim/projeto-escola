import { useUser } from '@/store/user/context';
import { RoleEnum } from '@/types/roles';

export const useUserIsAdmMaster = () => {
  const user = useUser();

  if (user.role.name === RoleEnum.ADM_MASTER) {
    return true;
  }
  return false;
};

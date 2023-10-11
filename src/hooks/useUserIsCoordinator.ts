import { useUser } from '@/store/user/context';
import { RoleEnum } from '@/types/roles';

export const useUserIsCoordinator = () => {
  const user = useUser();

  if (user.role.name === RoleEnum.COORDINATOR) {
    return true;
  }
  return false;
};

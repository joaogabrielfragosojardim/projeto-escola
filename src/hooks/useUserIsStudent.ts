import { useUser } from '@/store/user/context';
import { RoleEnum } from '@/types/roles';

export const useUserIsStudent = () => {
  const user = useUser();

  if (user.role.name === RoleEnum.STUDENT) {
    return true;
  }
  return false;
};

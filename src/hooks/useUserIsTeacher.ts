import { useUser } from '@/store/user/context';
import { RoleEnum } from '@/types/roles';

export const useUserIsTeacher = () => {
  const user = useUser();

  if (user.role.name === RoleEnum.TEACHER) {
    return true;
  }
  return false;
};

import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { axiosApi } from '@/components/api/axiosApi';
import { ViewCoordinator } from '@/components/ui/view/ViewCoordinator';
import type { Coordinator as CoordinatorType } from '@/types/coordinator';
import { RoleEnum } from '@/types/roles';

const Coordinator = ({
  coordinator,
  schoolOptions,
}: {
  coordinator: CoordinatorType;
  schoolOptions: { label: string; value: string }[];
}) => {
  return (
    <ViewCoordinator coordinator={coordinator} schoolOptions={schoolOptions} />
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token, user } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';
  const userObject = JSON.parse(user || '');

  try {
    verify(token || '', secret);

    const canView = [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(
      userObject?.role.name,
    );

    if (canView) {
      const { data } = await axiosApi.get(`/coordinator/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data: dataSchoolOptions } = await axiosApi.get(
        `/school/options`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return {
        props: {
          coordinator: data?.coordinator,
          schoolOptions: dataSchoolOptions?.options,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Coordinator;

import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { axiosApi } from '@/components/api/axiosApi';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { RoleEnum } from '@/types/roles';

const Project = () => {
  return (
    <SideNavMenuContainer title="Projeto">
      <div className="p-[32px]">asdad</div>
    </SideNavMenuContainer>
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
      const data = await axiosApi.get(`/project/${ctx?.params?.id}`);
      console.log(data);
      return { props: {} };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Project;

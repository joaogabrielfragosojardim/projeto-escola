import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

import { axiosApi } from '@/components/api/axiosApi';
import { ViewAdm } from '@/components/ui/view/ViewAdm';
import type { ADM } from '@/types/adm';
import { RoleEnum } from '@/types/roles';

const Adm = ({ adm }: { adm: ADM }) => {
  return <ViewAdm adm={adm} />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token, user } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';
  const userObject = JSON.parse(user || '');

  try {
    verify(token || '', secret);

    const canView = [RoleEnum.ADM_MASTER].includes(userObject?.role.name);
    if (canView) {
      const { data } = await axiosApi.get(`/adm/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        props: {
          adm: data?.adm,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Adm;

import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { PiStackSimpleLight } from 'react-icons/pi';

import { DashBoardTable } from '@/components/ui/DashboardTable';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';

const Dashboard = () => {
  const isAdmMaster = useUserIsAdmMaster();
  const isAdm = useUserIsAdm();

  const tables = [
    {
      filters: [{ name: 'Nome', type: 'string', formValue: 'name' }],
      columns: [''],
      actions: ['view', 'delete'],
      userCanView: isAdmMaster || isAdm,
      name: 'Projetos',
      icon: <PiStackSimpleLight size={25} />,
      noDataImage: '',
    },
  ];

  return (
    <SideNavMenuContainer title="Início">
      <div className="p-[32px]">
        <p className="mb-[32px] text-[24px] font-semibold text-complement-200">
          Gráficos
        </p>
        <DashBoardTable active="" tables={tables} />
      </div>
    </SideNavMenuContainer>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { token } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';
  try {
    verify(token || '', secret);

    return {
      props: {},
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};

export default Dashboard;

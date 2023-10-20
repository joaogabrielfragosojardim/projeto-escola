import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useState } from 'react';
import { GoPeople } from 'react-icons/go';
import { IoSchoolOutline } from 'react-icons/io5';
import {
  PiBookBookmarkLight,
  PiRulerLight,
  PiStackSimpleLight,
} from 'react-icons/pi';

import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { DashBoardTable } from '@/components/ui/tables/DashboardTable';
import { ProjectTable } from '@/components/ui/tables/ProjectTable';
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';

const Dashboard = () => {
  const [selectedTable, setSelectedTable] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const isAdmMaster = useUserIsAdmMaster();
  const isAdm = useUserIsAdm();

  const tables = [
    {
      table: <ProjectTable page={page} perPage={perPage} />,
      userCanView: isAdmMaster || isAdm,
      name: 'Projetos',
      icon: <PiStackSimpleLight size={25} />,
    },
    {
      table: <ProjectTable page={page} perPage={perPage} />,
      userCanView: isAdmMaster || isAdm,
      name: 'Escolas',
      icon: <PiBookBookmarkLight size={25} />,
    },
    {
      table: <ProjectTable page={page} perPage={perPage} />,
      userCanView: isAdmMaster || isAdm,
      name: 'Coordenadores',
      icon: <GoPeople size={25} />,
    },
    {
      table: <ProjectTable page={page} perPage={perPage} />,
      userCanView: isAdmMaster || isAdm,
      name: 'Educadores Sociais',
      icon: <PiRulerLight size={25} />,
    },
    {
      table: <ProjectTable page={page} perPage={perPage} />,

      userCanView: isAdmMaster || isAdm,
      name: 'Alunos',
      icon: <IoSchoolOutline size={25} />,
    },
  ];

  return (
    <SideNavMenuContainer title="Início">
      <div className="p-[32px]">
        <p className="mb-[32px] text-[24px] font-semibold text-complement-200">
          Gráficos
        </p>
        <DashBoardTable
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          tables={tables}
        />
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

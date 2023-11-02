import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useEffect, useState } from 'react';
import { GoPeople } from 'react-icons/go';
import { IoSchoolOutline } from 'react-icons/io5';
import {
  PiBookBookmarkLight,
  PiFolderMinusLight,
  PiRulerLight,
  PiStackSimpleLight,
} from 'react-icons/pi';

import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { AdmTable } from '@/components/ui/tables/AdmTable';
import { CoordinatorTable } from '@/components/ui/tables/CoordinatorTable';
import { DashBoardTable } from '@/components/ui/tables/DashboardTable';
import { ProjectTable } from '@/components/ui/tables/ProjectTable';
import { SchoolTable } from '@/components/ui/tables/SchoolTable';
import { SocialEducatorTable } from '@/components/ui/tables/SocialEducatorTable';
import { StudentTable } from '@/components/ui/tables/StudentTable';
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';

const Dashboard = () => {
  const [selectedTable, setSelectedTable] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const isAdmMaster = useUserIsAdmMaster();
  const isAdm = useUserIsAdm();
  const isCoordinator = useUserIsCoordinator();

  useEffect(() => {
    if (totalPages) {
      setTotalPages(0);
    }
  }, [selectedTable]);

  const tables = [
    {
      table: (
        <AdmTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster,
      name: 'Adms',
      icon: <PiFolderMinusLight size={25} />,
    },
    {
      table: (
        <ProjectTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster || isAdm,
      name: 'Projetos',
      icon: <PiStackSimpleLight size={25} />,
    },
    {
      table: (
        <SchoolTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster || isAdm,
      name: 'Escolas',
      icon: <PiBookBookmarkLight size={25} />,
    },
    {
      table: (
        <CoordinatorTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster || isAdm,
      name: 'Coordenadores',
      icon: <GoPeople size={25} />,
    },
    {
      table: (
        <SocialEducatorTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster || isAdm || isCoordinator,
      name: 'Educadores Sociais',
      icon: <PiRulerLight size={25} />,
    },
    {
      table: (
        <StudentTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),

      userCanView: true,
      name: 'Alunos',
      icon: <IoSchoolOutline size={25} />,
    },
  ];

  return (
    <SideNavMenuContainer title="Início">
      <div className="p-[22px] 2xl:p-[32px]">
        <p className="mb-[32px] text-[20px] font-semibold text-complement-200 2xl:text-[24px]">
          Informações
        </p>
        <DashBoardTable
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          tables={tables}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          setPerPage={setPerPage}
          perPage={perPage}
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

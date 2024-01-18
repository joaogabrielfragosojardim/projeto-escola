import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useEffect, useState } from 'react';
import { LiaChalkboardTeacherSolid, LiaSchoolSolid } from 'react-icons/lia';
import { PiStudentLight } from 'react-icons/pi';

import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { DashBoardTable } from '@/components/ui/tables/DashboardTable';
import { FrequencyTable } from '@/components/ui/tables/FrequencyTable';
import { LearnMonitoringTable } from '@/components/ui/tables/LearningMonitoringTable';
import { PedagogicalVisitTable } from '@/components/ui/tables/PedagogicalVisitTable';
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
        <PedagogicalVisitTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: isAdmMaster || isAdm || isCoordinator,
      name: 'Visita Pedagógica',
      icon: <LiaChalkboardTeacherSolid size={25} />,
    },
    {
      table: (
        <LearnMonitoringTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: true,
      name: 'Acompanhamento de Aprendizagem',
      icon: <LiaSchoolSolid size={25} />,
    },
    {
      table: (
        <FrequencyTable
          page={page}
          setTotalPages={setTotalPages}
          setPage={setPage}
          perPage={perPage}
        />
      ),
      userCanView: true,
      name: 'Frequência',
      icon: <PiStudentLight size={25} />,
    },
  ];

  return (
    <SideNavMenuContainer title="Relatórios">
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

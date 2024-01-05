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

import { GraphContainer } from '@/components/ui/GraphContainer';
import { CoordinatorGraph } from '@/components/ui/graphs/CoordinatorGraph';
import { EducatorGraph } from '@/components/ui/graphs/EducatorGraph';
import { ProjectGraph } from '@/components/ui/graphs/ProjectGraph';
import { SchoolGraph } from '@/components/ui/graphs/SchoolGraph';
import { StudentGraph } from '@/components/ui/graphs/StudentGraph.tsx';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';

const Geral = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const isAdmMaster = useUserIsAdmMaster();
  const isAdm = useUserIsAdm();

  const tabs = [
    {
      tab: <ProjectGraph />,
      userCanView: isAdmMaster || isAdm,
      name: 'Projetos',
      icon: <PiStackSimpleLight size={25} />,
    },
    {
      tab: <SchoolGraph />,
      userCanView: isAdmMaster || isAdm,
      name: 'Escolas',
      icon: <PiBookBookmarkLight size={25} />,
    },
    {
      tab: <CoordinatorGraph />,
      userCanView: isAdmMaster || isAdm,
      name: 'Coordenadores',
      icon: <GoPeople size={25} />,
    },
    {
      tab: <EducatorGraph />,
      userCanView: isAdmMaster || isAdm,
      name: 'Educadores Sociais',
      icon: <PiRulerLight size={25} />,
    },
    {
      tab: <StudentGraph />,
      userCanView: isAdmMaster || isAdm,
      name: 'Alunos',
      icon: <IoSchoolOutline size={25} />,
    },
  ];

  return (
    <SideNavMenuContainer title="Gráficos">
      <div className="p-[22px] 2xl:p-[32px]">
        <p className="mb-[32px] text-[20px] font-semibold text-complement-200 2xl:text-[24px]">
          Informações Gráficas
        </p>
        <GraphContainer
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={tabs}
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

export default Geral;

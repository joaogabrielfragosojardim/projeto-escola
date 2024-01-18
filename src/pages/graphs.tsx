import html2canvas from 'html2canvas';
import { verify } from 'jsonwebtoken';
import JSPDF from 'jspdf';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { BiDownload } from 'react-icons/bi';
import { GoPeople } from 'react-icons/go';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSchoolOutline } from 'react-icons/io5';
import {
  PiBookBookmarkLight,
  PiRulerLight,
  PiStackSimpleLight,
} from 'react-icons/pi';
import { SlNotebook } from 'react-icons/sl';

import { CoordinatorGraph } from '@/components/ui/graphs/CoordinatorGraph';
import { EducatorGraph } from '@/components/ui/graphs/EducatorGraph';
import { ProjectGraph } from '@/components/ui/graphs/ProjectGraph';
import { SchoolGraph } from '@/components/ui/graphs/SchoolGraph';
import { SeaGraph } from '@/components/ui/graphs/SeaGraph';
import { StudentGraph } from '@/components/ui/graphs/StudentGraph.tsx';
import { Popover } from '@/components/ui/Popover';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';

const pizzaGraphs = [
  {
    name: 'Projetos',
    icon: <PiStackSimpleLight size={25} />,
    item: <ProjectGraph />,
    key: 0,
  },
  {
    name: 'Escolas',
    icon: <PiBookBookmarkLight size={25} />,
    item: <SchoolGraph />,
    key: 1,
  },
  {
    name: 'Coordenadores',
    icon: <GoPeople size={25} />,
    item: <CoordinatorGraph />,
    key: 2,
  },
  {
    name: 'Educadores',
    icon: <PiRulerLight size={25} />,
    item: <EducatorGraph />,
    key: 3,
  },
  {
    name: 'Estudantes',
    icon: <IoSchoolOutline size={25} />,
    item: <StudentGraph />,
    key: 4,
  },
];

const downloadPDF = (elementID: string) => {
  const element = document.getElementById(elementID);
  const pdfButton01 = document.getElementById('pdfButton01');
  const modal = document.getElementById('modal');
  if (element && pdfButton01 && modal) {
    pdfButton01.style.display = 'none';
    modal.style.display = 'none';
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const doc = new JSPDF('p', 'mm', [
        element.offsetWidth,
        element.offsetHeight,
      ]);
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, width, height);
      doc.save('dashboard.pdf');
    });
    pdfButton01.style.display = 'flex';
    modal.style.display = 'inline';
  }
};

const Dashboard = () => {
  return (
    <SideNavMenuContainer title="Gráficos">
      <div className="p-[22px] 2xl:p-[32px]" id="pageContent">
        <div className="mb-[32px] flex w-full justify-between ">
          <p className="text-[20px] font-semibold text-complement-200 2xl:text-[24px]">
            Informações Gráficas
          </p>
          <Popover
            triggerElement={
              <button
                type="button"
                className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
                id="pdfButton01"
              >
                Baixar PDF <IoIosArrowDown size={20} />
              </button>
            }
          >
            <div className="flex flex-col gap-3" id="modal">
              <button
                type="button"
                className="flex items-center gap-[8px]"
                onClick={() => downloadPDF('pageContent')}
              >
                Total <BiDownload size={16} />
              </button>
              <button
                type="button"
                className="flex items-center gap-[8px]"
                onClick={() => downloadPDF('pizzaGraphs')}
              >
                Pizzas <BiDownload size={16} />
              </button>
              <button
                type="button"
                className="flex items-center gap-[8px]"
                onClick={() => downloadPDF('seasnd')}
              >
                SEA/SND
                <BiDownload size={16} />
              </button>
            </div>
          </Popover>
        </div>
        <div
          className="grid grid-cols-1 gap-x-4 gap-y-16 2xl:grid-cols-3"
          id="pizzaGraphs"
        >
          {pizzaGraphs.map((graph) => (
            <div
              className="border-b-[1px] border-solid border-complement-200 text-complement-200 2xl:rounded-[16px] 2xl:border-[3px] 2xl:border-main"
              key={graph.key}
            >
              <div className="mb-4 flex gap-4 pt-8 font-bold 2xl:px-8">
                {graph.icon}
                <span>{graph.name}</span>
              </div>
              {graph.item}
            </div>
          ))}
        </div>
        <div className="mt-16 gap-x-4 gap-y-16" id="seasnd">
          <div className="border-b-[1px] border-solid border-complement-200 py-[16px] text-complement-200 2xl:rounded-[16px] 2xl:border-[3px] 2xl:border-main 2xl:p-[22px]">
            <div className="mb-4 mt-2 flex items-center gap-4 pl-8 font-bold">
              <SlNotebook size={25} />
              <span className="text-[28px]">
                Monitoramento da Aprendizagem SEA/SND
              </span>
            </div>
            <SeaGraph />
          </div>
        </div>
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

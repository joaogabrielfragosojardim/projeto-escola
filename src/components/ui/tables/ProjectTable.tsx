import { CompactTable } from '@table-library/react-table-library/compact';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';
import { useTableTheme } from '@/hooks/useTableTheme';
import type { Project } from '@/types/project';

import { Popover } from '../Popover';

const columns = [
  {
    label: 'Imagem',
    renderCell: (item: Project) => (
      <div className="flex items-center gap-[16px]">
        <div className="relative h-[62px] w-[62px] overflow-hidden rounded-full">
          <Image src={item.visualIdentity} alt="logo do projeto" fill />
        </div>
        {item.name}
      </div>
    ),
  },
  {
    label: 'Sobre',
    renderCell: (item: Project) => <div>{item.about}</div>,
  },
];

export const ProjectTable = () => {
  const theme = useTableTheme();
  const fetchProjects = async () => {
    return (await axiosApi.get('/project')).data;
  };

  const { isLoading, data } = useQuery('fetchAllProjectsQuery', fetchProjects);
  const nodes = { nodes: data?.data };

  return (
    <div>
      <div className="p-[32px]">
        <div className="flex items-center justify-between">
          <Popover
            triggerElement={
              <button
                disabled={isLoading}
                type="button"
                className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100 disabled:opacity-60"
              >
                <VscFilter size={20} /> Filtros <IoIosArrowDown size={20} />
              </button>
            }
          >
            <form />
          </Popover>
          <button
            type="button"
            disabled={isLoading}
            className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100 disabled:opacity-60"
          >
            Gerar Relatório <IoIosArrowDown size={20} />
          </button>
        </div>
        <div className="mt-[32px] grid grid-cols-2" />
      </div>
      <div>
        {isLoading && (
          <div className="flex h-[320px] w-full items-center justify-center text-main">
            <div>
              <div className="animate-spin">
                <TbLoader size={62} />
              </div>
            </div>
          </div>
        )}
        {nodes?.nodes && nodes?.nodes.length ? (
          <CompactTable columns={columns} data={nodes} theme={theme} />
        ) : null}
        {nodes?.nodes && !nodes?.nodes.length ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-projects.png"
                alt="imagem dizendo que até agora estamos sem projetos"
                fill
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Você não cadastrou nenhum projeto ainda!</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

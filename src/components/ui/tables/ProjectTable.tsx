import {
  Body,
  Cell,
  Header,
  HeaderCell,
  HeaderRow,
  Row,
  Table,
} from '@table-library/react-table-library';
import Image from 'next/image';
import { BiTrash } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';
import { useTableTheme } from '@/hooks/useTableTheme';
import type { Project } from '@/types/project';

import { Popover } from '../Popover';

export const ProjectTable = ({
  page,
  quantity,
}: {
  page: number;
  quantity: number;
}) => {
  const theme = useTableTheme();
  const fetchProjects = async () => {
    return (
      await axiosApi.get('/project', { params: { perPage: quantity, page } })
    ).data;
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
          <Table
            data={nodes}
            theme={theme}
            style={{ gridTemplateColumns: '1fr 2fr 0.4fr' }}
          >
            {(tableList: Project[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Nome</HeaderCell>
                    <HeaderCell>Sobre</HeaderCell>
                    <HeaderCell>Ações</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((project) => (
                    <Row key={project.id} item={project}>
                      <Cell className="text-main hover:text-main">
                        <div className="flex items-center gap-[16px] text-[20px]">
                          <div className="relative h-[62px] w-[62px] overflow-hidden rounded-full">
                            <Image
                              src={project.visualIdentity}
                              alt="logo do projeto"
                              fill
                            />
                          </div>
                          {project.name}
                        </div>
                      </Cell>
                      <Cell className="text-main hover:text-main">
                        {project.about}
                      </Cell>
                      <Cell className="text-center text-main hover:text-main">
                        <div className="flex gap-[8px]">
                          <button type="button">
                            <FiEye size={20} />
                          </button>
                          <button type="button">
                            <BiTrash size={20} />
                          </button>
                        </div>
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
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

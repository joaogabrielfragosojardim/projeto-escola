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
import Link from 'next/link';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiBlock, BiDownload, BiTrash } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { IoIosArrowDown, IoMdMore } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

import { axiosApi } from '@/components/api/axiosApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useTableTheme } from '@/hooks/useTableTheme';
import type { Project } from '@/types/project';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { StatusSelect } from './Selects/StatusSelect';

export const ProjectTable = ({
  page,
  setTotalPages,
  setPage,
  perPage,
}: {
  page: number;
  setTotalPages: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  perPage: number;
}) => {
  const { register } = useForm();
  const theme = useTableTheme();
  const [filtersValues, setFiltersValues] = useState({
    name: '',
    status: undefined,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [inativateModal, setInativateModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState('');
  const [projectInativate, setProjectInativate] = useState<{
    status: boolean;
    projectId: string;
  }>({ status: true, projectId: '' });

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
    namePopover: {
      element: (
        <InputThemed
          register={register}
          name="name"
          label="Nome do projeto"
          onChange={(event) => {
            nameDebounce(event.target.value);
          }}
        />
      ),
      view: false,
    },
    statusPopover: {
      element: (
        <StatusSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, status: event?.value }));
          }}
        />
      ),
      view: false,
    },
  });

  const deleteProject = async (id: string) => {
    return (await axiosApi.delete(`/project/${id}`)).data;
  };

  const inativateProject = async (projectData: {
    projectId: string;
    status: boolean;
  }) => {
    const { projectId: id, status } = projectData;
    return axiosApi.put('/project/status', { projectId: id, status });
  };

  const { mutate } = useMutation('fdeleteProjectMutation', deleteProject, {
    onSuccess: () => {
      toast.success('projeto deletado!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar o projeto!');
    },
  });

  const { mutate: mutateInativate } = useMutation(
    'inativateProject',
    inativateProject,
    {
      onSuccess: () => {
        toast.success('Status do Projeto alterado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao inativar o Projeto!');
      },
    },
  );

  const fetchProjects = async () => {
    return (
      await axiosApi.get('/project', {
        params: {
          page,
          name: filtersValues.name || null,
          perPage,
          status: filtersValues.status,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllProjectsQuery',
    fetchProjects,
    { refetchOnWindowFocus: false },
  );
  const nodes = { nodes: data?.data };

  const nameDebounce = useDebounce((value: string) => {
    setPage(1);
    setFiltersValues((prev) => ({ ...prev, name: value }));
  }, 600);

  useEffect(() => {
    refetch();
  }, [filtersValues, page, perPage, refetch]);

  useEffect(() => {
    setTotalPages(data?.meta.totalPage);
  }, [data, setTotalPages]);

  const handleChangeFilters = (name: string, valueName: string, event: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: {
        element: prev[name]?.element,
        view: event.target?.checked,
        value: '',
      },
    }));

    if (!event.target?.checked) {
      setFiltersValues((prev) => ({ ...prev, [valueName]: '' }));
    }
  };

  return (
    <div>
      <div className="py-[22px] 2xl:p-[32px]">
        <div className="flex items-center justify-between">
          <Popover
            triggerElement={
              <button
                disabled={isLoading || isRefetching || !data?.data.length}
                type="button"
                className="flex items-center gap-[8px] rounded bg-main px-[16px] py-[8px] text-[14px] text-complement-100 disabled:opacity-60 2xl:gap-[16px] 2xl:text-[20px]"
              >
                <VscFilter /> Filtros <IoIosArrowDown />
              </button>
            }
          >
            <form className="flex flex-col gap-[16px]">
              <InputCheckBoxThemed
                label="Nome"
                register={register}
                name="namePopover"
                onClick={(event) => {
                  handleChangeFilters('namePopover', 'name', event);
                }}
              />
              <InputCheckBoxThemed
                label="Status"
                register={register}
                name="statusPopover"
                onClick={(event) => {
                  handleChangeFilters('statusPopover', 'status', event);
                }}
              />
            </form>
          </Popover>
          <Popover
            triggerElement={
              <button
                type="button"
                disabled={isLoading || isRefetching || !data?.data.length}
                className="flex items-center gap-[8px] rounded bg-main px-[16px] py-[8px] text-[14px] text-complement-100 disabled:opacity-60 2xl:gap-[16px] 2xl:text-[20px]"
              >
                Gerar Relatório <IoIosArrowDown size={20} />
              </button>
            }
          >
            <button
              type="button"
              className="flex items-center gap-[8px] text-[14px] 2xl:text-[16px]"
              onClick={() =>
                createCSV(
                  data?.data.map((item: Project) => ({
                    name: item.name,
                    about: item.about,
                    status: item.status ? 'Ativo' : 'Inativo',
                  })),
                  ['Nome', 'Sobre', 'Status'],
                  'relatorioProjetos',
                )
              }
            >
              <BiDownload size={16} />
              CSV
            </button>
          </Popover>
        </div>
        <div className="mt-[32px] flex flex-col gap-[16px] 2xl:grid 2xl:grid-cols-2 2xl:items-end">
          {Object.keys(filters)
            .filter((item) => filters[item]?.view === true)
            .map((item) => (
              <div key={item}>{filters[item]?.element}</div>
            ))}
        </div>
      </div>
      <div>
        {(isLoading || isRefetching) && (
          <div className="flex h-[420px] w-full items-center justify-center text-main">
            <div>
              <div className="animate-spin">
                <TbLoader size={62} />
              </div>
            </div>
          </div>
        )}
        {nodes?.nodes && nodes?.nodes.length && !(isLoading || isRefetching) ? (
          <>
            <div className="hidden 2xl:inline">
              <Table
                data={nodes}
                theme={theme}
                style={{ gridTemplateColumns: '1.3fr 1fr  2fr 0.4fr' }}
              >
                {(tableList: Project[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Nome</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                        <HeaderCell>Sobre</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((project) => (
                        <Row key={project.id} item={project}>
                          <Cell className="text-main hover:text-main">
                            <div className="flex items-center gap-[16px] text-[20px]">
                              <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                                <Image
                                  src={
                                    project?.visualIdentity ||
                                    '/assets/images/default-profile.png'
                                  }
                                  alt="logo do projeto"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {project.name}
                            </div>
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {project.status ? (
                              <div className="flex items-center gap-[8px]">
                                <p>Ativo</p>
                                <div className="h-[8px] w-[8px] rounded-full bg-correct" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-[8px]">
                                <p>Inativo</p>
                                <div className="h-[8px] w-[8px] rounded-full bg-wrong" />
                              </div>
                            )}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {project.about}
                          </Cell>
                          <Cell className="text-center text-main hover:text-main">
                            <div className="flex gap-[8px]">
                              <Link
                                href={`/view/${project.id}/project`}
                                data-tooltip-id="eye"
                                data-tooltip-content="visualizar"
                                data-tooltip-place="top"
                              >
                                <FiEye size={20} />
                              </Link>
                              <Tooltip id="eye" />
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectToDelete(project.id);
                                  setDeleteModal(true);
                                }}
                                data-tooltip-id="trash"
                                data-tooltip-content="remover"
                                data-tooltip-place="top"
                              >
                                <BiTrash size={20} />
                              </button>
                              <Tooltip id="trash" />
                              <button
                                type="button"
                                onClick={() => {
                                  setProjectInativate({
                                    status: !project.status,
                                    projectId: project.id,
                                  });
                                  setInativateModal(true);
                                }}
                                data-tooltip-id="inactivate"
                                data-tooltip-content="inativar"
                                data-tooltip-place="top"
                              >
                                <BiBlock size={20} />
                              </button>
                              <Tooltip id="inactivate" />
                            </div>
                          </Cell>
                        </Row>
                      ))}
                    </Body>
                  </>
                )}
              </Table>
            </div>
            <div className="2xl:hidden">
              <div className="rounded-[6px_6px_0px_0px] bg-main px-[16px] py-[18px] text-complement-100">
                Escolas
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((project: Project) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={project.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="relative h-[36px] w-[36px] overflow-hidden rounded-full">
                            <Image
                              src={
                                project?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="logo do projeto"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[16px]">{project.name}</p>
                        </div>
                        <Popover
                          triggerElement={
                            <button type="button" className="text-main">
                              <IoMdMore size={20} />
                            </button>
                          }
                          eye
                        >
                          <div className="mt-[-30px] flex flex-col gap-[8px] text-main">
                            <Link
                              href={`/view/${project.id}/project`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              className="flex items-center gap-[8px]"
                              onClick={() => {
                                setProjectToDelete(project.id);
                                setDeleteModal(true);
                              }}
                            >
                              <BiTrash size={20} />
                              <p>Deletar</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setProjectInativate({
                                  status: !project.status,
                                  projectId: project.id,
                                });
                                setInativateModal(true);
                              }}
                              className="flex items-center gap-[8px]"
                            >
                              <BiBlock size={20} />
                              <p>Inativar</p>
                            </button>
                          </div>
                        </Popover>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px] ">
                        <p className="text-[14px] text-main">Status:</p>
                        {project.status ? (
                          <div className="flex items-center gap-[8px]">
                            <p className="text-[14px] text-main">Ativo</p>
                            <div className="h-[8px] w-[8px] rounded-full bg-correct" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-[8px]">
                            <p className="text-[14px] text-main">Inativo</p>
                            <div className="h-[8px] w-[8px] rounded-full bg-wrong" />
                          </div>
                        )}
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Sobre:</p>
                        <p className="text-[14px] text-complement-200">
                          {project.about}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {nodes?.nodes && !nodes?.nodes.length ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-projects.png"
                alt="imagem dizendo que até agora estamos sem projetos"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum projeto encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir esse projeto?"
        onConfirm={() => {
          mutate(projectToDelete);
          setDeleteModal(false);
        }}
      />
      <ConfirmModal
        isOpen={inativateModal}
        setOpen={setInativateModal}
        text={
          projectInativate.status
            ? 'Deseja realmente ativar esse Projeto?'
            : 'Deseja realmente inativar esse Projeto?'
        }
        onConfirm={() => {
          mutateInativate(projectInativate);
          setInativateModal(false);
        }}
      />
    </div>
  );
};

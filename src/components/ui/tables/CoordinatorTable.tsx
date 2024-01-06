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
import type { Coordinator } from '@/types/coordinator';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { ProjectSelect } from './Selects/ProjectSelect';
import { SchoolSelect } from './Selects/SchoolSelect';
import { StatusSelect } from './Selects/StatusSelect';

export const CoordinatorTable = ({
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [inativateModal, setInativateModal] = useState(false);
  const [coordinatorInativate, setCoordinatorInativate] = useState<{
    status: boolean;
    coordinatorId: string;
  }>({ status: true, coordinatorId: '' });
  const [coordinatorToDelete, setCoordinatorToDelete] = useState('');

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    projectId: '',
    schoolId: '',
    status: undefined,
  });

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
    namePopover: {
      element: (
        <InputThemed
          register={register}
          name="name"
          label="Nome do coordenador"
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
            setFiltersValues((prev) => ({ ...prev, status: event.value }));
          }}
        />
      ),
      view: false,
    },
    projectPopover: {
      element: (
        <ProjectSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, projectId: event.value }));
          }}
        />
      ),
      view: false,
    },
    schoolPopover: {
      element: (
        <SchoolSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, schoolId: event.value }));
          }}
        />
      ),
      view: false,
    },
  });

  useEffect(() => {
    if (filtersValues.projectId) {
      setFilters((prev) => ({
        ...prev,
        schoolPopover: {
          view: prev.schoolPopover?.view || false,
          element: (
            <SchoolSelect
              onChange={(event) => {
                setPage(1);
                setFiltersValues((prevFIlters) => ({
                  ...prevFIlters,
                  schoolId: event.value,
                }));
              }}
              projectId={filtersValues.projectId}
            />
          ),
        },
      }));
    }
  }, [filtersValues, setPage]);

  const fetchCoordinators = async () => {
    return (
      await axiosApi.get('/coordinator', {
        params: {
          page,
          perPage,
          name: filtersValues.name || null,
          projectId: filtersValues.projectId || null,
          schoolId: filtersValues.schoolId || null,
          status: filtersValues.status,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllCoordinatorsQuery',
    fetchCoordinators,
    { refetchOnWindowFocus: false },
  );
  const nodes = { nodes: data?.data };

  const deleteCoordinator = async (id: string) => {
    return (await axiosApi.delete(`/coordinator/${id}`)).data;
  };

  const inativateCoordinator = async (projectData: {
    coordinatorId: string;
    status: boolean;
  }) => {
    const { coordinatorId: id, status } = projectData;
    return axiosApi.put('/coordinator/status', { coordinatorId: id, status });
  };

  const { mutate } = useMutation(
    'deleteCoordinatorMutation',
    deleteCoordinator,
    {
      onSuccess: () => {
        toast.success('Coordenador deletado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao deletar o coordenador!');
      },
    },
  );

  const { mutate: mutateInativate } = useMutation(
    'inativateCoordinator',
    inativateCoordinator,
    {
      onSuccess: () => {
        toast.success('Status do Coordenador alterado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao inativar o Coordenador!');
      },
    },
  );

  const nameDebounce = useDebounce((value: string) => {
    setPage(1);
    setFiltersValues((prev) => ({ ...prev, name: value }));
  }, 600);

  useEffect(() => {
    refetch();
  }, [filtersValues, page, refetch]);

  useEffect(() => {
    setTotalPages(data?.meta.totalPage);
  }, [data, setTotalPages]);

  const handleChangeFilters = (name: string, valueName: string, event: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: {
        element: prev[name]?.element,
        view: event.target?.checked,
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
                <VscFilter size={20} /> Filtros <IoIosArrowDown size={20} />
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
              <InputCheckBoxThemed
                label="Projeto"
                register={register}
                name="projectPopover"
                onClick={(event) => {
                  handleChangeFilters('projectPopover', 'projectId', event);
                }}
              />
              <InputCheckBoxThemed
                label="Escola"
                register={register}
                name="schoolPopover"
                onClick={(event) => {
                  handleChangeFilters('schoolPopover', 'schoolId', event);
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
              className="flex items-center gap-[8px]"
              onClick={() =>
                createCSV(
                  data?.data.map((item: Coordinator) => ({
                    name: item.name,
                    status: item.status,
                    email: item.email,
                    telephone: item.telephone,
                    project: item.project.name,
                    school: item.school.name,
                  })),
                  ['Nome', 'Status', 'Email', 'Telefone', 'Projeto', 'Escola'],
                  'relatorioCoordenadores',
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
                style={{ gridTemplateColumns: '1fr 0.5fr 1fr 1fr 1fr 0.4fr' }}
              >
                {(tableList: Coordinator[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Nome</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                        <HeaderCell>Email</HeaderCell>
                        <HeaderCell>Projeto</HeaderCell>
                        <HeaderCell>Escola</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((coordinator) => (
                        <Row key={coordinator.id} item={coordinator}>
                          <Cell className="text-main hover:text-main">
                            <div className="flex items-center gap-[16px] text-[20px]">
                              <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                                <Image
                                  src={
                                    coordinator?.visualIdentity ||
                                    '/assets/images/default-profile.png'
                                  }
                                  alt="foto do coordenador"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {coordinator.name}
                            </div>
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {coordinator.status ? (
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
                            {coordinator.email}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {coordinator.project.name}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {coordinator.school.name}
                          </Cell>
                          <Cell className="text-center text-main hover:text-main">
                            <div className="flex gap-[8px]">
                              <Link
                                href={`/view/${coordinator.id}/coordinator`}
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
                                  setCoordinatorToDelete(coordinator.id);
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
                                  setCoordinatorInativate({
                                    status: !coordinator.status,
                                    coordinatorId: coordinator.id,
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
                Coordenadores
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((coordinator: Coordinator) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={coordinator.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="relative h-[36px] w-[36px] overflow-hidden rounded-full">
                            <Image
                              src={
                                coordinator?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="logo do projeto"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[16px]">{coordinator.name}</p>
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
                              href={`/view/${coordinator.id}/coordinator`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              className="flex items-center gap-[8px]"
                              onClick={() => {
                                setCoordinatorToDelete(coordinator.id);
                                setDeleteModal(true);
                              }}
                            >
                              <BiTrash size={20} />
                              <p>Deletar</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCoordinatorInativate({
                                  status: !coordinator.status,
                                  coordinatorId: coordinator.id,
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
                        {coordinator.status ? (
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
                        <p className="text-[14px] text-main">Email:</p>
                        <p className="text-[14px] text-complement-200">
                          {coordinator.email}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Telefone:</p>
                        <p className="text-[14px] text-complement-200">
                          {coordinator.telephone}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Projeto:</p>
                        <p className="text-[14px] text-complement-200">
                          {coordinator.project.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Escola:</p>
                        <p className="text-[14px] text-complement-200">
                          {coordinator.school.name}
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
                src="/assets/images/without-coordinators.png"
                alt="imagem dizendo que até agora estamos sem coordenadores"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum coordenador encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir esse coordenador?"
        onConfirm={() => {
          mutate(coordinatorToDelete);
          setDeleteModal(false);
        }}
      />
      <ConfirmModal
        isOpen={inativateModal}
        setOpen={setInativateModal}
        text={
          coordinatorInativate.status
            ? 'Deseja realmente ativar esse Coordenador?'
            : 'Deseja realmente inativar esse Coordenador?'
        }
        onConfirm={() => {
          mutateInativate(coordinatorInativate);
          setInativateModal(false);
        }}
      />
    </div>
  );
};

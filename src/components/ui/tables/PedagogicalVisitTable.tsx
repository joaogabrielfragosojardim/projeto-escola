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
import { BiDownload, BiTrash } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { IoIosArrowDown, IoMdMore } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { useTableTheme } from '@/hooks/useTableTheme';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import type { ADM } from '@/types/adm';
import type { PedagogicalVisit } from '@/types/pedagogicalVisit';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { CoordinatorSelect } from './Selects/CoordinatorSelect';

export const PedagogicalVisitTable = ({
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
  const [filtersValues, setFiltersValues] = useState({ coordinatorId: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [pedagogicalVisitToDelete, setPedagogicalVisitToDelete] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    finalDate: '',
  });

  const userIsCoordinator = useUserIsCoordinator();

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
    datePopopver: {
      element: (
        <div className="flex items-center gap-[16px]">
          <InputThemed
            type="date"
            label="Data Inicial"
            name="startDate"
            register={register}
            max={maxDate.toISOString().split('T')[0]}
            onChange={(e) => {
              setDateFilter((prev) => ({ ...prev, startDate: e.target.value }));
            }}
          />
          <InputThemed
            type="date"
            label="Data Final"
            name="finalDate"
            register={register}
            max={maxDate.toISOString().split('T')[0]}
            onChange={(e) => {
              setDateFilter((prev) => ({ ...prev, finalDate: e.target.value }));
            }}
          />
        </div>
      ),
      view: false,
    },
    coordinatorPopover: {
      element: (
        <CoordinatorSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({
              ...prev,
              coordinatorId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
    periodPopover: {
      element: (
        <CoordinatorSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({
              ...prev,
              coordinatorId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
    socialEducatorPopover: {
      element: (
        <CoordinatorSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({
              ...prev,
              coordinatorId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
  });

  const deletePedagogicalVisit = async (id: string) => {
    return (await axiosApi.delete(`/pedagogicalVisit/${id}`)).data;
  };

  const { mutate } = useMutation(
    'deletePedagogicalVisitMutation',
    deletePedagogicalVisit,
    {
      onSuccess: () => {
        toast.success('Visita pedagógica deletada!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao deletar a visita pedagógica!');
      },
    },
  );

  const fetchPedagogicalVisit = async () => {
    return (
      await axiosApi.get('/pedagogicalVisit', {
        params: {
          page,
          perPage,
          startDate: dateFilter.startDate || null,
          finalDate: dateFilter.finalDate || null,
          coordinatorId: filtersValues.coordinatorId || null,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllPedagogicalVisit',
    fetchPedagogicalVisit,
    { refetchOnWindowFocus: false },
  );
  const nodes = { nodes: data?.data };

  useEffect(() => {
    if (dateFilter.startDate && dateFilter.finalDate) {
      if (
        new Date(dateFilter.finalDate).getTime() >=
        new Date(dateFilter.startDate).getTime()
      ) {
        refetch();
      } else {
        toast.error('Data final maior que a data inicial');
      }
    }
    if (!dateFilter.startDate && !dateFilter.finalDate) {
      refetch();
    }
  }, [dateFilter, refetch]);

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
                <VscFilter size={20} /> Filtros <IoIosArrowDown size={20} />
              </button>
            }
          >
            <form className="flex flex-col gap-[8px]">
              <InputCheckBoxThemed
                label="Data"
                register={register}
                name="datePopopver"
                onClick={() => {
                  setDateFilter({ startDate: '', finalDate: '' });
                }}
              />
              {!userIsCoordinator && (
                <InputCheckBoxThemed
                  label="Coordenador"
                  register={register}
                  name="coordinatorPopover"
                  onClick={(event) => {
                    handleChangeFilters(
                      'coordinatorPopover',
                      'coordinatorId',
                      event,
                    );
                  }}
                />
              )}
              <InputCheckBoxThemed
                label="Período"
                register={register}
                name="periodPopover"
                onClick={(event) => {
                  handleChangeFilters('periodPopover', 'coordinatorId', event);
                }}
              />
              <InputCheckBoxThemed
                label="Educador Social"
                register={register}
                name="socialEducatorPopover"
                onClick={(event) => {
                  handleChangeFilters(
                    'socialEducatorPopover',
                    'teacherId',
                    event,
                  );
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
                  data?.data.map((item: ADM) => ({
                    name: item.name,
                    email: item.email,
                  })),
                  ['Nome', 'Email'],
                  'relatorioAdms',
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
                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 0.4fr' }}
              >
                {(tableList: PedagogicalVisit[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Data</HeaderCell>
                        <HeaderCell>Coordenador</HeaderCell>
                        <HeaderCell>Educador Social</HeaderCell>
                        <HeaderCell>Turma</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((pedagogicalVisit) => {
                        const date = new Date(pedagogicalVisit.date);
                        date.setHours(date.getHours() + 3);
                        return (
                          <Row
                            key={pedagogicalVisit.id}
                            item={pedagogicalVisit}
                          >
                            <Cell className="text-[20px] text-main hover:text-main">
                              {date.toLocaleDateString()}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {pedagogicalVisit.coordinator.name}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {pedagogicalVisit.teacher.name}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {`${pedagogicalVisit.classroom.year}º - ${pedagogicalVisit.classroom.period}`}
                            </Cell>
                            <Cell className="text-center text-main hover:text-main">
                              <div className="flex gap-[8px]">
                                <Link
                                  href={`/view/${pedagogicalVisit.id}/pedagogicalVisit`}
                                >
                                  <FiEye size={20} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPedagogicalVisitToDelete(
                                      pedagogicalVisit.id,
                                    );
                                    setDeleteModal(true);
                                  }}
                                >
                                  <BiTrash size={20} />
                                </button>
                              </div>
                            </Cell>
                          </Row>
                        );
                      })}
                    </Body>
                  </>
                )}
              </Table>
            </div>
            <div className="2xl:hidden">
              <div className="rounded-[6px_6px_0px_0px] bg-main px-[16px] py-[18px] text-complement-100">
                Adms
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((adm: ADM) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={adm.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="relative h-[36px] w-[36px] overflow-hidden">
                            <Image
                              src={
                                adm?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="logo do projeto"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[16px]">{adm.name}</p>
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
                              href={`/view/${adm.id}/adm`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              className="flex items-center gap-[8px]"
                              onClick={() => {
                                setPedagogicalVisitToDelete(adm.id);
                                setDeleteModal(true);
                              }}
                            >
                              <BiTrash size={20} />
                              <p>Deletar</p>
                            </button>
                          </div>
                        </Popover>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Nome:</p>
                        <p className="text-[14px] text-complement-200">
                          {adm.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Email:</p>
                        <p className="text-[14px] text-complement-200">
                          {adm.email}
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
                src="/assets/images/without-adm.png"
                alt="imagem dizendo que até agora estamos sem adms"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum ADM encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir essa visita pedagógica?"
        onConfirm={() => {
          mutate(pedagogicalVisitToDelete);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

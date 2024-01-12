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
import { Tooltip } from 'react-tooltip';

import { axiosApi } from '@/components/api/axiosApi';
import { useTableTheme } from '@/hooks/useTableTheme';
import { useUserIsTeacher } from '@/hooks/useUserIsTeacher';
import type { Frequency } from '@/types/frequency';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { PeriodSelect } from './Selects/PeriodSelect';
import { ProjectSelect } from './Selects/ProjectSelect';
import { TeacherSelect } from './Selects/TeacherSelect';
import { YearSelect } from './Selects/YearSelect';

export const FrequencyTable = ({
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
    teacherId: '',
    year: '',
    period: '',
    projectId: '',
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [frequencyToDelete, setFrequencyToDelete] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    finalDate: '',
  });

  const userIsTeacher = useUserIsTeacher();

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
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
    datePopover: {
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
    periodPopover: {
      element: (
        <div className="flex w-full items-center gap-[16px]">
          <YearSelect
            onChange={(event) => {
              setPage(1);
              setFiltersValues((prev) => ({ ...prev, year: event?.value }));
            }}
          />

          <PeriodSelect
            onChange={(event) => {
              setPage(1);
              setFiltersValues((prev) => ({ ...prev, period: event?.value }));
            }}
          />
        </div>
      ),
      view: false,
    },
    socialEducatorPopover: {
      element: (
        <TeacherSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({
              ...prev,
              teacherId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
  });

  const deleteFrequency = async (id: string) => {
    return (await axiosApi.delete(`/attendance/${id}`)).data;
  };

  const { mutate } = useMutation('deleteFrequencyMutation', deleteFrequency, {
    onSuccess: () => {
      toast.success('Frequencia do aluno deletada!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar a Frequencia do aluno!');
    },
  });

  const fetchAttendance = async () => {
    return (
      await axiosApi.get('/attendance', {
        params: {
          page,
          perPage,
          startDate: dateFilter.startDate || null,
          finalDate: dateFilter.finalDate || null,
          teacherId: filtersValues.teacherId || null,
          year: filtersValues.year || null,
          period: filtersValues.period || null,
          projectId: filtersValues.projectId || null,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAttendance',
    fetchAttendance,
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
              {!userIsTeacher && (
                <InputCheckBoxThemed
                  label="Projeto"
                  register={register}
                  name="projectPopover"
                  onClick={(event) => {
                    handleChangeFilters('projectPopover', 'projectId', event);
                  }}
                />
              )}
              <InputCheckBoxThemed
                label="Data"
                register={register}
                name="datePopover"
                onClick={(event) => {
                  handleChangeFilters('datePopover', '', event);
                  setDateFilter({ startDate: '', finalDate: '' });
                }}
              />
              <InputCheckBoxThemed
                label="Período"
                register={register}
                name="periodPopover"
                onClick={(event) => {
                  handleChangeFilters('periodPopover', 'coordinatorId', event);
                }}
              />
              {!userIsTeacher ? (
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
              ) : null}
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
                  data?.data.map((item: Frequency) => ({
                    date: item.date,
                    student: item.student.user.name,
                    registration: item.student.registration,
                    classrooom: `${item.Classroom.year}º Ano - ${item.Classroom.period}`,
                    present: item.isPresent ? 'Presente' : 'Ausente',
                  })),
                  ['Data', 'Matrícula', 'Estudante', 'Turma', 'Presente'],
                  'relatorioFrequencia',
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
                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 0.4fr' }}
              >
                {(tableList: Frequency[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Aluno</HeaderCell>
                        <HeaderCell>Matrícula</HeaderCell>
                        <HeaderCell>Data</HeaderCell>
                        <HeaderCell>Turma</HeaderCell>
                        <HeaderCell>Presente</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((attendence) => {
                        const date = new Date(attendence.date);
                        date.setHours(date.getHours() + 3);
                        return (
                          <Row key={attendence.id} item={attendence}>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {attendence.student.user.name}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {attendence.student.registration}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {date.toLocaleDateString()}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {`${attendence.Classroom.year}º - ${attendence.Classroom.period}`}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {attendence.isPresent ? 'Sim' : 'Não'}
                            </Cell>
                            <Cell className="text-center text-main hover:text-main">
                              <div className="flex gap-[8px]">
                                <Link
                                  href={`/view/${attendence.id}/frequency`}
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
                                    setFrequencyToDelete(attendence.id);
                                    setDeleteModal(true);
                                  }}
                                  data-tooltip-id="trash"
                                  data-tooltip-content="remover"
                                  data-tooltip-place="top"
                                >
                                  <BiTrash size={20} />
                                </button>
                                <Tooltip id="trash" />
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
                Visitas Pedagógicas
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((frequency: Frequency) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={frequency.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="mt-[8px] flex items-center gap-[8px]">
                            <p className="text-[14px] text-main">Data:</p>
                            <p className="text-[14px] text-complement-200">
                              {new Date(frequency.date).toLocaleDateString()}
                            </p>
                          </div>
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
                              href={`/view/${frequency.id}/frequency`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              className="flex items-center gap-[8px]"
                              onClick={() => {
                                setFrequencyToDelete(frequency.id);
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
                        <p className="text-[14px] text-main">Aluno:</p>
                        <p className="text-[14px] text-complement-200">
                          {frequency.student.user.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Matrícula:</p>
                        <p className="text-[14px] text-complement-200">
                          {frequency.student.registration}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Aluno:</p>
                        <p className="text-[14px] text-complement-200">
                          {frequency.isPresent ? 'Sim' : 'Não'}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Turma:</p>
                        <p className="text-[14px] text-complement-200">
                          {`${frequency.Classroom.year}º Ano - ${frequency.Classroom.period}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {nodes?.nodes && !nodes?.nodes.length && !isLoading && !isRefetching ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-adm.png"
                alt="imagem dizendo que até agora estamos sem visitas pedagógicas"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhuma frequência encontrada!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir essa frequência?"
        onConfirm={() => {
          mutate(frequencyToDelete);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

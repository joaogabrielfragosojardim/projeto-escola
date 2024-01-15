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
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';
import { useUserIsTeacher } from '@/hooks/useUserIsTeacher';
import type { LearningMonitoring } from '@/types/learningMonitoring';
import {
  learningMonitoringColumns,
  learningMonitoringValues,
} from '@/types/learningMonitoring';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { CoordinatorSelect } from './Selects/CoordinatorSelect';
import { PeriodSelect } from './Selects/PeriodSelect';
import { ProjectSelect } from './Selects/ProjectSelect';
import { StudentSelect } from './Selects/StudentSelect';
import { TeacherSelect } from './Selects/TeacherSelect';
import { YearSelect } from './Selects/YearSelect';

export const LearnMonitoringTable = ({
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
    studentId: '',
    year: '',
    period: '',
    projectId: '',
    coordinatorId: '',
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [learingMonitoringToDelete, setlearingMonitoringToDelete] =
    useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    finalDate: '',
  });

  const userIsTeacher = useUserIsTeacher();
  const userIsAdm = useUserIsAdm();
  const userIsAdmMaster = useUserIsAdmMaster();

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
    studentPopover: {
      element: (
        <StudentSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({
              ...prev,
              studentId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
  });

  const deleteLearningMonitoring = async (id: string) => {
    return (await axiosApi.delete(`/learningMonitoring/${id}`)).data;
  };

  const { mutate } = useMutation(
    'deleteLearningMonitoringMutation',
    deleteLearningMonitoring,
    {
      onSuccess: () => {
        toast.success('Acompanhamento de aprendizagem deletado!');
        refetch();
      },
      onError: () => {
        toast.error(
          'Algo de arrado aconteceu ao deletar o acompanhamento de aprendizagem!',
        );
      },
    },
  );

  const fetchLearningMonitoring = async () => {
    return (
      await axiosApi.get('/learningMonitoring', {
        params: {
          page,
          perPage,
          startDate: dateFilter.startDate || null,
          finalDate: dateFilter.finalDate || null,
          teacherId: filtersValues.teacherId || null,
          year: filtersValues.year || null,
          period: filtersValues.period || null,
          projectId: filtersValues.projectId || null,
          coordinatorId: filtersValues.coordinatorId || null,
          studentId: filtersValues.studentId || null,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchLearningMonitoring',
    fetchLearningMonitoring,
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
                label="Turma"
                register={register}
                name="periodPopover"
                onClick={(event) => {
                  handleChangeFilters('periodPopover', 'coordinatorId', event);
                }}
              />
              {(userIsAdm || userIsAdmMaster) && (
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
              {!userIsTeacher ? (
                <InputCheckBoxThemed
                  label="Educador"
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
              <InputCheckBoxThemed
                label="Aluno"
                register={register}
                name="studentPopover"
                onClick={(event) => {
                  handleChangeFilters('studentPopover', 'studentId', event);
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
                  data?.data.map((item: LearningMonitoring) => ({
                    date: item.createdAt,
                    teacher: item.teacher.user.name,
                    student: item.student.user.name,
                    registration: item.student.registration,
                    classrooom: `${item.classroom.year} - ${item.classroom.period}`,
                    ...learningMonitoringValues(item.questions),
                    writingLevel: item.writingLevel,
                  })),
                  [
                    'Data',
                    'Educador Social',
                    'Aluno',
                    'Matrícula',
                    'Turma',
                    'Nivel de sistema de escrita alfabética - SEA',
                    ...learningMonitoringColumns,
                  ],
                  'relatorioAprendizagem',
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
                {(tableList: LearningMonitoring[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Data</HeaderCell>
                        <HeaderCell>Educador Social</HeaderCell>
                        <HeaderCell>Aluno</HeaderCell>
                        <HeaderCell>Matrícula</HeaderCell>
                        <HeaderCell>Turma</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((laerningMonitoring) => {
                        const date = new Date(laerningMonitoring.createdAt);
                        date.setHours(date.getHours() + 3);
                        return (
                          <Row
                            key={laerningMonitoring.id}
                            item={laerningMonitoring}
                          >
                            <Cell className="text-[20px] text-main hover:text-main">
                              {date.toLocaleDateString()}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {laerningMonitoring.teacher.user.name}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {laerningMonitoring.student.user.name}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {laerningMonitoring.student.registration}
                            </Cell>
                            <Cell className="text-[20px] text-main hover:text-main">
                              {`${laerningMonitoring.classroom.year}º - ${laerningMonitoring.classroom.period}`}
                            </Cell>
                            <Cell className="text-center text-main hover:text-main">
                              <div className="flex gap-[8px]">
                                <Link
                                  href={`/view/${laerningMonitoring.id}/learningMonitoring`}
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
                                    setlearingMonitoringToDelete(
                                      laerningMonitoring.id,
                                    );
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
                Acompanhamento de Aprendizagem
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((learningMonitoring: LearningMonitoring) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={learningMonitoring.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="mt-[8px] flex items-center gap-[8px]">
                            <p className="text-[14px] text-main">Data:</p>
                            <p className="text-[14px] text-complement-200">
                              {new Date(
                                learningMonitoring.createdAt,
                              ).toLocaleDateString()}
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
                              href={`/view/${learningMonitoring.id}/learningMonitoring`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              className="flex items-center gap-[8px]"
                              onClick={() => {
                                setlearingMonitoringToDelete(
                                  learningMonitoring.id,
                                );
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
                        <p className="text-[14px] text-main">
                          Educador Social:
                        </p>
                        <p className="text-[14px] text-complement-200">
                          {learningMonitoring.teacher.user.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Aluno</p>
                        <p className="text-[14px] text-complement-200">
                          {learningMonitoring.student.user.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Matrícula</p>
                        <p className="text-[14px] text-complement-200">
                          {learningMonitoring.student.registration}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Turma:</p>
                        <p className="text-[14px] text-complement-200">
                          {`${learningMonitoring.classroom.year} - ${learningMonitoring.classroom.period}`}
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
                alt="imagem dizendo que até agora estamos sem acompanhamento de aprendizagem"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum acompanhamento de aprendizagem encontrada!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir ess acompanhamento de aprendizagem?"
        onConfirm={() => {
          mutate(learingMonitoringToDelete);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

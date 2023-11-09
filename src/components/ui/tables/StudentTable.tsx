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
import { AiOutlineBook } from 'react-icons/ai';
import { BiBlock, BiDownload, BiTrash } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { IoIosArrowDown, IoMdMore } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useTableTheme } from '@/hooks/useTableTheme';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import { useUserIsTeacher } from '@/hooks/useUserIsTeacher';
import { useUser } from '@/store/user/context';
import type { Student } from '@/types/student';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { PeriodSelect } from './Selects/PeriodSelect';
import { SchoolSelect } from './Selects/SchoolSelect';
import { StatusSelect } from './Selects/StatusSelect';
import { YearSelect } from './Selects/YearSelect';

export const StudentTable = ({
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
  const userIsCoordinator = useUserIsCoordinator();
  const userIsTeacher = useUserIsTeacher();
  const [deleteModal, setDeleteModal] = useState(false);
  const [inativateModal, setInativateModal] = useState(false);

  const [studentId, setStudentId] = useState('');
  const [studentInativate, setStudentInativate] = useState<{
    status: boolean;
    studentId: string;
  }>({ status: true, studentId: '' });

  const user = useUser();

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    schoolId: '',
    year: '',
    period: '',
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
          label="Nome da escola"
          onChange={(event) => {
            nameDebounce(event.target.value);
          }}
        />
      ),
      view: false,
    },
    schoolPopover: {
      element: (
        <SchoolSelect
          coordinatorId={userIsCoordinator ? user.id : undefined}
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, schoolId: event.value }));
          }}
        />
      ),
      view: false,
    },
    classroomPopover: {
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
  });

  const fetchStudents = async () => {
    const { data } = await axiosApi.get('/student', {
      params: {
        page,
        perPage,
        name: filtersValues.name || null,
        schoolId: filtersValues.schoolId || null,
        year: filtersValues.year || null,
        period: filtersValues.period || null,
        status: filtersValues.status,
      },
    });
    return data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'students',
    fetchStudents,
    {
      refetchOnWindowFocus: false,
    },
  );
  const nodes = { nodes: data?.data };

  const deleteStudent = async (id: string) => {
    return (await axiosApi.delete(`/student/${id}`)).data;
  };

  const inativateStudent = async (studentData: {
    studentId: string;
    status: boolean;
  }) => {
    const { studentId: id, status } = studentData;
    return axiosApi.put('/student/status', { studentId: id, status });
  };

  const { mutate } = useMutation('deleteStudent', deleteStudent, {
    onSuccess: () => {
      toast.success('Estudante deletado!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar o aluno!');
    },
  });

  const { mutate: mutateInativate } = useMutation(
    'inativateStudent',
    inativateStudent,
    {
      onSuccess: () => {
        toast.success('Status do Estudante alterado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao inativar o Estudante!');
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
              {!userIsTeacher ||
                (!userIsCoordinator && (
                  <InputCheckBoxThemed
                    label="Escola"
                    register={register}
                    name="schoolPopover"
                    onClick={(event) => {
                      handleChangeFilters('schoolPopover', 'schoolId', event);
                    }}
                  />
                ))}
              <InputCheckBoxThemed
                label="Ano/Período"
                register={register}
                name="classroomPopover"
                onClick={(event) => {
                  handleChangeFilters('classroomPopover', 'classId', event);
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
              className="flex items-center gap-[8px]"
              onClick={() =>
                createCSV(
                  data?.data.map((item: Student) => ({
                    name: item.name,
                    status: item.status,
                    email: item.email,
                    school: item.school.name,
                    classrooms: `${item.classroom.year}º ano - ${item.classroom.period}`,
                  })),
                  ['Nome', 'Status', 'Email', 'Escola', 'Turma'],
                  'relatorioAlunos',
                )
              }
            >
              <BiDownload size={16} />
              CSV
            </button>
          </Popover>
        </div>
        <div className="mt-[32px] grid grid-cols-2 items-end gap-[32px]">
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
                {(students: Student[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Nome</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                        <HeaderCell>Escola</HeaderCell>
                        <HeaderCell>Turma</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {students.map((student) => (
                        <Row key={student.id} item={student}>
                          <Cell className="text-main hover:text-main">
                            <div className="flex items-center gap-[16px] text-[20px]">
                              <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                                <Image
                                  src={
                                    student?.visualIdentity ||
                                    '/assets/images/default-profile.png'
                                  }
                                  alt="foto do coordenador"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {student.name}
                            </div>
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {student.status ? (
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
                            {`${student.school.name}`}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {`${student.classroom.year}º Ano - ${student.classroom.period}`}
                          </Cell>
                          <Cell className="text-center text-main hover:text-main">
                            <div className="flex gap-[8px]">
                              <Link href={`/view/${student.id}/student`}>
                                <FiEye size={20} />
                              </Link>
                              {userIsCoordinator || userIsTeacher ? null : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setStudentId(student.id);
                                    setDeleteModal(true);
                                  }}
                                >
                                  <BiTrash size={20} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setStudentInativate({
                                    status: !student.status,
                                    studentId: student.id,
                                  });
                                  setInativateModal(true);
                                }}
                              >
                                <BiBlock size={20} />
                              </button>
                              {userIsTeacher && student.status ? (
                                <Link
                                  href={`/reports/${student.id}/learningMonitoring`}
                                >
                                  <AiOutlineBook size={20} />
                                </Link>
                              ) : null}
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
                Estudantes
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {data?.data.map((student: Student) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={student.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-[16px]">
                          <div className="relative h-[36px] w-[36px] overflow-hidden rounded-full">
                            <Image
                              src={
                                student?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="logo do projeto"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[16px]">{student.name}</p>
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
                              href={`/view/${student.id}/student`}
                              className="flex items-center gap-[8px]"
                            >
                              <FiEye size={20} />
                              <p>Visualizar</p>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setStudentInativate({
                                  status: !student.status,
                                  studentId: student.id,
                                });
                                setInativateModal(true);
                              }}
                              className="flex items-center gap-[8px]"
                            >
                              <BiBlock size={20} />
                              <p>Inativar</p>
                            </button>
                            {userIsCoordinator ? null : (
                              <button
                                type="button"
                                className="flex items-center gap-[8px]"
                                onClick={() => {
                                  setStudentId(student.id);
                                  setDeleteModal(true);
                                }}
                              >
                                <BiTrash size={20} />
                                <p>Deletar</p>
                              </button>
                            )}
                            {userIsCoordinator && student.status ? (
                              <Link
                                href={`/reports/${student.id}/pedagogicalVisit`}
                                className="flex items-center gap-[8px]"
                              >
                                <AiOutlineBook size={20} />
                                Acompanhamento de Aprendizagem
                              </Link>
                            ) : null}
                          </div>
                        </Popover>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px] ">
                        <p className="text-[14px] text-main">Status:</p>
                        {student.status ? (
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
                        <p className="text-[14px] text-main">Escola:</p>
                        <p className="text-[14px] text-complement-200">
                          {student.school.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Turma:</p>
                        <p className="text-[14px] text-complement-200">
                          {`${student.classroom.year}º Ano - ${student.classroom.period}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {!!data && !data?.data.length ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-students.png"
                alt="imagem dizendo que até agora estamos sem estudantes"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum estudante encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir esse aluno?"
        onConfirm={() => {
          mutate(studentId);
          setDeleteModal(false);
        }}
      />
      <ConfirmModal
        isOpen={inativateModal}
        setOpen={setInativateModal}
        text={
          studentInativate.status
            ? 'Deseja realmente ativar esse Aluno?'
            : 'Deseja realmente inativar esse Aluno?'
        }
        onConfirm={() => {
          mutateInativate(studentInativate);
          setInativateModal(false);
        }}
      />
    </div>
  );
};

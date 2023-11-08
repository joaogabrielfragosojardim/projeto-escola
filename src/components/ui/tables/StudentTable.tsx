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
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useTableTheme } from '@/hooks/useTableTheme';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import type { Student } from '@/types/student';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { PeriodSelect } from './Selects/PeriodSelect';
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [studentId, setStudentId] = useState('');

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    schoolId: '',
    year: '',
    period: '',
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

  const { mutate } = useMutation('deleteStudent', deleteStudent, {
    onSuccess: () => {
      toast.success('Estudante deletado!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar o aluno!');
    },
  });

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
      <div className="p-[32px]">
        <div className="flex items-center justify-between">
          <Popover
            triggerElement={
              <button
                disabled={isLoading || isRefetching || !data?.data.length}
                type="button"
                className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100 disabled:opacity-60"
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
                label="Escola"
                register={register}
                name="schoolPopover"
                onClick={(event) => {
                  handleChangeFilters('schoolPopover', 'schoolId', event);
                }}
              />
              <InputCheckBoxThemed
                label="Ano/Período"
                register={register}
                name="classroomPopover"
                onClick={(event) => {
                  handleChangeFilters('classroomPopover', 'classId', event);
                }}
              />
            </form>
          </Popover>
          <Popover
            triggerElement={
              <button
                type="button"
                disabled={isLoading || isRefetching || !data?.data.length}
                className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100 disabled:opacity-60"
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
                    email: item.email,
                    school: item.school.name,
                    classrooms: `${item.classroom.year}º ano - ${item.classroom.period}`,
                  })),
                  ['Nome', 'Email', 'Escola', 'Turma'],
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
          <Table
            data={nodes}
            theme={theme}
            style={{ gridTemplateColumns: '1fr 1fr 1fr 0.4fr' }}
          >
            {(students: Student[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Nome</HeaderCell>
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
                        {`${student.school.name}`}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {`${student.classroom.year}º - ${student.classroom.period}`}
                      </Cell>
                      <Cell className="text-center text-main hover:text-main">
                        <div className="flex gap-[8px]">
                          <Link href={`/view/${student.id}/socialEducator`}>
                            <FiEye size={20} />
                          </Link>
                          {userIsCoordinator ? null : (
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
                        </div>
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
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
    </div>
  );
};

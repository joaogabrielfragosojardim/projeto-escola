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
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useTableTheme } from '@/hooks/useTableTheme';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import { useUser } from '@/store/user/context';
import { createCSV } from '@/utils/createCSV';
import type { Teacher } from '@/utils/teacherAdapter';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { PeriodSelect } from './Selects/PeriodSelect';
import { ProjectSelect } from './Selects/ProjectSelect';
import { SchoolSelect } from './Selects/SchoolSelect';
import { YearSelect } from './Selects/YearSelect';

export const SocialEducatorTable = ({
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
  const user = useUser();
  const userIsCoordinator = useUserIsCoordinator();
  const [deleteModal, setDeleteModal] = useState(false);
  const [inativateModal, setInativateModal] = useState(false);

  const [socialEducatorId, setSocialEducatorId] = useState('');
  const [socialEducatorInative, setSocialEducatorInativate] = useState<{
    status: boolean;
    teacherId: string;
  }>({ status: true, teacherId: '' });

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    projectId: '',
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
  });

  const fetchSocialEducators = async () => {
    const { data } = await axiosApi.get('/teacher', {
      params: {
        page,
        perPage,
        name: filtersValues.name || null,
        projectId: filtersValues.projectId || null,
        schoolId: filtersValues.schoolId || null,
        year: filtersValues.year || null,
        period: filtersValues.period || null,
      },
    });
    return data;
  };

  const {
    isLoading,
    data: teachers,
    refetch,
    isRefetching,
  } = useQuery('socialEducators', fetchSocialEducators, {
    refetchOnWindowFocus: false,
  });
  const nodes = { nodes: teachers?.data };

  const deleteSocialEducator = async (id: string) => {
    return (await axiosApi.delete(`/teacher/${id}`)).data;
  };

  const inativateSocialEducator = async (data: {
    teacherId: string;
    status: boolean;
  }) => {
    const { teacherId, status } = data;
    return (await axiosApi.put('/teacher/status', { teacherId, status })).data;
  };

  const { mutate } = useMutation('deleteSocialEducator', deleteSocialEducator, {
    onSuccess: () => {
      toast.success('Educador Social deletado!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar o Educador Social!');
    },
  });

  const { mutate: mutateInativate } = useMutation(
    'inativateSocialEducator',
    inativateSocialEducator,
    {
      onSuccess: () => {
        toast.success('Status do Educador Social alterado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao inativar o Educador Social!');
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
    setTotalPages(teachers?.meta.totalPage);
  }, [teachers, setTotalPages]);

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
                disabled={isLoading || isRefetching || !teachers?.data.length}
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
              {!userIsCoordinator ? (
                <>
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
                </>
              ) : null}
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
                disabled={isLoading || isRefetching || !teachers?.data.length}
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
                  teachers?.data.map((item: Teacher) => ({
                    name: item.name,
                    email: item.email,
                    telephone: item.telephone,
                    project: item.project.name,
                    school: item.school.name,
                    classrooms: item.classrooms
                      .map(
                        (classroom) =>
                          `${classroom.year}º ano - ${classroom.period}`,
                      )
                      .join('/'),
                  })),
                  ['Nome', 'Email', 'Telefone', 'Projeto', 'Escola', 'Turmas'],
                  'relatorioEducadorSocial',
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
                style={{
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.4r 0.4fr',
                }}
              >
                {(socialEducators: Teacher[]) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Nome</HeaderCell>
                        <HeaderCell>Email</HeaderCell>
                        <HeaderCell>Telefone</HeaderCell>
                        <HeaderCell>Projeto</HeaderCell>
                        <HeaderCell>Escola</HeaderCell>
                        <HeaderCell>Turmas</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                        <HeaderCell>Ações</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {socialEducators.map((teacher) => (
                        <Row key={teacher.id} item={teacher}>
                          <Cell className="text-main hover:text-main">
                            <div className="flex items-center gap-[16px] text-[20px]">
                              <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                                <Image
                                  src={
                                    teacher?.visualIdentity ||
                                    '/assets/images/default-profile.png'
                                  }
                                  alt="foto do coordenador"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {teacher.name}
                            </div>
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.email}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.telephone}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.project.name}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.school.name}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.classrooms.map((classroom) => (
                              <p
                                key={`${classroom.year} - ${classroom.period}`}
                              >
                                {classroom.year}º ano - {classroom.period}
                              </p>
                            ))}
                          </Cell>
                          <Cell className="text-[20px] text-main hover:text-main">
                            {teacher.status ? (
                              <div className="flex items-center gap-[8px]">
                                <p>Ativo</p>
                                <div className="h-[8px] w-[8px] rounded-full bg-right" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-[8px]">
                                <p>Inativo</p>
                                <div className="h-[8px] w-[8px] rounded-full bg-wrong" />
                              </div>
                            )}
                          </Cell>
                          <Cell className="text-center text-main hover:text-main">
                            <div className="flex gap-[8px]">
                              <Link href={`/view/${teacher.id}/socialEducator`}>
                                <FiEye size={20} />
                              </Link>
                              {userIsCoordinator ? null : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSocialEducatorId(teacher.id);
                                    setDeleteModal(true);
                                  }}
                                >
                                  <BiTrash size={20} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setSocialEducatorInativate({
                                    status: !teacher.status,
                                    teacherId: teacher.id,
                                  });
                                  setInativateModal(true);
                                }}
                              >
                                <BiBlock size={20} />
                              </button>
                              {userIsCoordinator ? (
                                <Link href="/">
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
                Educadores Sociais
              </div>
              <div className="overflow-hidden rounded-[0px_0px_6px_6px] border-2 border-main">
                {teachers?.data.map((teacher: Teacher) => (
                  <div
                    className="border-b-2 border-b-complement-100 p-[14px]"
                    key={teacher.id}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-[16px]">
                        <div className="relative h-[36px] w-[36px] overflow-hidden">
                          <Image
                            src={
                              teacher?.visualIdentity ||
                              '/assets/images/default-profile.png'
                            }
                            alt="logo do projeto"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-[16px]">{teacher.name}</p>
                      </div>

                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Email:</p>
                        <p className="text-[14px] text-complement-200">
                          {teacher.email}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Telefone:</p>
                        <p className="text-[14px] text-complement-200">
                          {teacher.telephone}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Projeto:</p>
                        <p className="text-[14px] text-complement-200">
                          {teacher.project.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex items-center gap-[8px]">
                        <p className="text-[14px] text-main">Escola:</p>
                        <p className="text-[14px] text-complement-200">
                          {teacher.school.name}
                        </p>
                      </div>
                      <div className="mt-[8px] flex flex-col gap-[8px]">
                        <p className="text-[14px] text-main">Turmas:</p>
                        <p className="text-[14px] text-complement-200">
                          {teacher.classrooms.map((classroom) => (
                            <p key={`${classroom.year} - ${classroom.period}`}>
                              {classroom.year}º ano - {classroom.period}
                            </p>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {!!teachers && !teachers?.data.length ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-social-educator.png"
                alt="imagem dizendo que até agora estamos sem educadores sociais"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum educador social encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir esse professor?"
        onConfirm={() => {
          mutate(socialEducatorId);
          setDeleteModal(false);
        }}
      />
      <ConfirmModal
        isOpen={inativateModal}
        setOpen={setInativateModal}
        text={
          socialEducatorInative.status
            ? 'Deseja realmente ativar esse professor?'
            : 'Deseja realmente inativar esse professor?'
        }
        onConfirm={() => {
          mutateInativate(socialEducatorInative);
          setInativateModal(false);
        }}
      />
    </div>
  );
};

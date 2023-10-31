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
  const [deleteModal, setDeleteModal] = useState(false);
  const [socialEducatorId, setSocialEducatorId] = useState('');

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
        <>
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
        </>
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

  const deleteSocialEducator = async (id: string) => {
    return (await axiosApi.delete(`/teacher/${id}`)).data;
  };

  const { mutate } = useMutation('deleteSocialEducator', deleteSocialEducator, {
    onSuccess: () => {
      toast.success('Professor deletado!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar o professor!');
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
      <div className="p-[32px]">
        <div className="flex items-center justify-between">
          <Popover
            triggerElement={
              <button
                disabled={isLoading || isRefetching}
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
              <InputCheckBoxThemed
                label="Turma"
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
                disabled={isLoading}
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
                  teachers?.data.map((item: Teacher) => ({
                    name: item.name,
                    email: item.email,
                    telephone: item.telephone,
                    project: item.project.name,
                    school: item.school.name,
                  })),
                  ['Nome', 'Email', 'Telefone', 'Projeto', 'Escola'],
                  'relatorioEducadorSocial',
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
        {!!teachers?.data && !(isLoading || isRefetching) ? (
          <Table
            data={{ nodes: teachers.data }}
            theme={theme}
            style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.4fr' }}
          >
            {(teachers: Teacher[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Nome</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Telefone</HeaderCell>
                    <HeaderCell>Projeto</HeaderCell>
                    <HeaderCell>Escola</HeaderCell>
                    <HeaderCell>Turmas</HeaderCell>
                    <HeaderCell>Ações</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {teachers.map((teacher) => (
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
                          <p key={`${classroom.year} - ${classroom.period}`}>
                            {classroom.year}º ano - {classroom.period}
                          </p>
                        ))}
                      </Cell>

                      <Cell className="text-center text-main hover:text-main">
                        <div className="flex gap-[8px]">
                          <Link href={`/view/${teacher.id}/teacher`}>
                            <FiEye size={20} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setSocialEducatorId(teacher.id);
                              setDeleteModal(true);
                            }}
                          >
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
        {!!teachers && !teachers?.data.length ? (
          <div className="p-[44px]">
            <div className="relative mx-auto h-[370px] w-[313px]">
              <Image
                src="/assets/images/without-projects.png"
                alt="imagem dizendo que até agora estamos sem projetos"
                fill
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
        text="Deseja realmente excluir esse professor?"
        onConfirm={() => {
          mutate(socialEducatorId);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

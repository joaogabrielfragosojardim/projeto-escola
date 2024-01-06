import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useForm } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useQuery } from 'react-query';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { axiosApi } from '@/components/api/axiosApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useUserIsAdm } from '@/hooks/useUserIsAdm';
import { useUserIsAdmMaster } from '@/hooks/useUserIsAdmMaster';
import { useUserIsCoordinator } from '@/hooks/useUserIsCoordinator';
import { useUserIsTeacher } from '@/hooks/useUserIsTeacher';
import { useUser } from '@/store/user/context';

import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { CoordinatorSelect } from '../tables/Selects/CoordinatorSelect';
import { PeriodSelect } from '../tables/Selects/PeriodSelect';
import { ProjectSelect } from '../tables/Selects/ProjectSelect';
import { SchoolSelect } from '../tables/Selects/SchoolSelect';
import { StatusSelect } from '../tables/Selects/StatusSelect';
import { TeacherSelect } from '../tables/Selects/TeacherSelect';
import { YearSelect } from '../tables/Selects/YearSelect';

export const StudentGraph = () => {
  const { register } = useForm();
  const user = useUser();
  const userIsTeacher = useUserIsTeacher();
  const userIsCoordinator = useUserIsCoordinator();
  const userIsAdmMaster = useUserIsAdmMaster();
  const userIsAdm = useUserIsAdm();

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    schoolId: '',
    year: '',
    period: '',
    status: undefined,
    projectId: '',
    coordinatorId: '',
    teacherId: '',
  });

  const [initialTotal, setInitialTotal] = useState(null);

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
            setFiltersValues((prev) => ({ ...prev, schoolId: event.value }));
          }}
        />
      ),
      view: false,
    },
    coordinatorPopover: {
      element: (
        <CoordinatorSelect
          onChange={(event) => {
            setFiltersValues((prev) => ({
              ...prev,
              coordinatorId: event.value,
            }));
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
              setFiltersValues((prev) => ({ ...prev, year: event?.value }));
            }}
          />

          <PeriodSelect
            onChange={(event) => {
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
            setFiltersValues((prev) => ({
              ...prev,
              teacherId: event.value,
            }));
          }}
        />
      ),
      view: false,
    },
    statusPopover: {
      element: (
        <StatusSelect
          onChange={(event) => {
            setFiltersValues((prev) => ({ ...prev, status: event.value }));
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
    if (filtersValues.projectId || filtersValues.schoolId) {
      setFilters((prev) => ({
        ...prev,
        coordinatorPopover: {
          view: prev.coordinatorPopover?.view || false,
          element: (
            <CoordinatorSelect
              onChange={(event) => {
                setFiltersValues((prevFilters) => ({
                  ...prevFilters,
                  coordinatorId: event.value,
                }));
              }}
              projectId={filtersValues.projectId || undefined}
              schoolId={filtersValues.schoolId || undefined}
            />
          ),
        },
      }));
    }
    if (
      filtersValues.projectId ||
      filtersValues.schoolId ||
      filtersValues.coordinatorId
    ) {
      setFilters((prev) => ({
        ...prev,
        socialEducatorPopover: {
          view: prev.socialEducatorPopover?.view || false,
          element: (
            <TeacherSelect
              onChange={(event) => {
                setFiltersValues((prevFilters) => ({
                  ...prevFilters,
                  teacherId: event.value,
                }));
              }}
              projectId={filtersValues.projectId || undefined}
              schoolId={filtersValues.schoolId || undefined}
              coordinatorId={filtersValues.coordinatorId || undefined}
            />
          ),
        },
      }));
    }
  }, [filtersValues]);

  const nameDebounce = useDebounce((value: string) => {
    setFiltersValues((prev) => ({ ...prev, name: value }));
  }, 600);

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

  const fetchStudents = async () => {
    const { data } = await axiosApi.get('/student', {
      params: {
        name: filtersValues.name || null,
        projectId: filtersValues.projectId || null,
        schoolId: filtersValues.schoolId || null,
        coordinatorId: filtersValues.coordinatorId || null,
        teacherId: filtersValues.teacherId || null,
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
  useEffect(() => {
    refetch();
  }, [filtersValues, refetch]);

  useEffect(() => {
    if (data?.meta?.total && initialTotal === null) {
      // Verifica se há um valor em data.meta.total e se initialTotal ainda não foi definido
      setInitialTotal(data.meta.total); // Armazena o valor inicial de total
    }
  }, [data?.meta?.total, initialTotal]);

  const COLORS = ['#5e69bd', '#737d8a'];

  const dataGraph = [
    {
      name: 'Total',
      value: initialTotal !== null ? initialTotal : data?.meta?.total,
    },
    {
      name: 'Filtro',
      value: data?.meta?.total === initialTotal ? 0 : data?.meta?.total,
    },
  ];

  return (
    <div>
      <div className="py-[16px] 2xl:p-[22px]">
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
              {(userIsAdm || userIsAdmMaster) && (
                <InputCheckBoxThemed
                  label="Projeto"
                  register={register}
                  name="projectPopover"
                  onClick={(event) => {
                    handleChangeFilters('projectPopover', 'projectId', event);
                  }}
                />
              )}
              {!(userIsTeacher || userIsCoordinator) && (
                <InputCheckBoxThemed
                  label="Escola"
                  register={register}
                  name="schoolPopover"
                  onClick={(event) => {
                    handleChangeFilters('schoolPopover', 'schoolId', event);
                  }}
                />
              )}
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
              {(userIsAdm || userIsAdmMaster || userIsCoordinator) && (
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
              )}
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
        {(isLoading || isRefetching) && (
          <div className="flex h-[420px] w-full items-center justify-center text-main">
            <div>
              <div className="animate-spin">
                <TbLoader size={62} />
              </div>
            </div>
          </div>
        )}

        <div className="relative  flex h-[300px] items-center justify-center p-[44px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={dataGraph}
                startAngle={180}
                endAngle={0}
                cy={135}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={15}
                dataKey="value"
                label
              >
                {dataGraph.map((item, index: any) => (
                  <Cell
                    key={`cell-${item.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-[115px] flex text-[24px] font-bold">
            <CountUp
              end={((data?.meta?.total || 0) * 100) / (initialTotal || 0) || 0}
              duration={1.5}
            />
            <p>%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
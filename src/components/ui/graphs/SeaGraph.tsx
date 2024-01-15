import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { VscFilter } from 'react-icons/vsc';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { axiosApi } from '@/components/api/axiosApi';

import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { CoordinatorSelect } from '../tables/Selects/CoordinatorSelect';
import { PeriodSelect } from '../tables/Selects/PeriodSelect';
import { ProjectSelect } from '../tables/Selects/ProjectSelect';
import { SchoolSelect } from '../tables/Selects/SchoolSelect';
import { StudentSelect } from '../tables/Selects/StudentSelect';
import { TeacherSelect } from '../tables/Selects/TeacherSelect';
import { YearSelect } from '../tables/Selects/YearSelect';

const CustomizedLabel = ({
  x,
  y,
  fill,
  value,
}: {
  x: number;
  y: number;
  fill: string;
  value: number;
}) => {
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      fontSize="16"
      fontFamily="sans-serif"
      fill={fill}
      width="100%"
      textAnchor="middle"
    >
      {value}
    </text>
  );
};
export const SeaGraph = () => {
  const { register } = useForm();
  const [graphData, setGraphData] = useState([]);
  const [filtersValues, setFiltersValues] = useState({
    teacherId: '',
    schoolId: '',
    studentId: '',
    year: '',
    period: '',
    projectId: '',
    coordinatorId: '',
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    finalDate: '',
  });

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
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
      view: true,
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
          coordinatorId={filtersValues.coordinatorId}
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
    periodPopover: {
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
    studentPopover: {
      element: (
        <StudentSelect
          onChange={(event) => {
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

  const fetchSea = async () => {
    return (
      await axiosApi.get('/graphs/sea', {
        params: {
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

  const { isLoading, mutate } = useMutation('fetchSea', fetchSea, {
    onSuccess: (dataFromApi) => {
      setGraphData(dataFromApi.data);
    },
  });

  useEffect(() => {
    if (dateFilter.startDate && dateFilter.finalDate) {
      if (
        new Date(dateFilter.finalDate).getTime() >=
        new Date(dateFilter.startDate).getTime()
      ) {
        mutate();
      } else {
        toast.error('Data final maior que a data inicial');
      }
    }
    if (!dateFilter.startDate && !dateFilter.finalDate) {
      mutate();
    }
  }, [dateFilter, mutate]);

  useEffect(() => {
    mutate();
  }, [filtersValues, mutate]);

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

  const sumNumbers = (dataNumbers: any) => {
    let total = 0;

    dataNumbers.forEach((item: any) => {
      total +=
        item['Pré-Silábico'] +
        item['Silábico'] +
        item['Silábico-Alfabético'] +
        item['Alfabético'];
    });

    return total;
  };

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
    if (
      filtersValues.projectId ||
      filtersValues.schoolId ||
      filtersValues.coordinatorId ||
      filtersValues.teacherId
    ) {
      setFilters((prev) => ({
        ...prev,
        studentPopover: {
          view: prev.studentPopover?.view || false,
          element: (
            <StudentSelect
              onChange={(event) => {
                setFiltersValues((prevFilters) => ({
                  ...prevFilters,
                  studentId: event.value,
                }));
              }}
              projectId={filtersValues.projectId || undefined}
              schoolId={filtersValues.schoolId || undefined}
            />
          ),
        },
      }));
    }
  }, [filtersValues]);

  return (
    <div>
      <div className="py-[22px] 2xl:p-[32px]">
        <div className="flex items-center justify-between">
          <Popover
            triggerElement={
              <button
                disabled={isLoading}
                type="button"
                className="flex items-center gap-[8px] rounded bg-main px-[16px] py-[8px] text-[14px] text-complement-100 disabled:opacity-60 2xl:gap-[16px] 2xl:text-[20px]"
              >
                <VscFilter size={20} /> Filtros <IoIosArrowDown size={20} />
              </button>
            }
          >
            <form className="flex flex-col gap-[8px]">
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
              <InputCheckBoxThemed
                label="Turma"
                register={register}
                name="periodPopover"
                onClick={(event) => {
                  handleChangeFilters('periodPopover', 'coordinatorId', event);
                }}
              />
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
        {isLoading ? (
          <div className="flex h-[420px] w-full items-center justify-center text-main">
            <div>
              <div className="animate-spin">
                <TbLoader size={62} />
              </div>
            </div>
          </div>
        ) : graphData.length ? (
          <div className="h-[360px] w-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={graphData}
                margin={{
                  top: 15,
                  bottom: 15,
                }}
              >
                <CartesianGrid vertical={false} stroke="#ebf3f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Pré-Silábico"
                  fill="#EA4235"
                  activeBar={<Rectangle fill="#ea41357d" stroke="black" />}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  label={(props) => {
                    console.log(props);
                    const { x, y, value, width } = props;
                    return (
                      <CustomizedLabel
                        x={x + width / 2}
                        y={y}
                        value={value}
                        fill="black"
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="Silábico"
                  fill="#4286F5"
                  activeBar={<Rectangle fill="#4287f57b" stroke="black" />}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  label={(props) => {
                    const { x, y, value, width } = props;
                    return (
                      <CustomizedLabel
                        x={x + width / 2}
                        y={y}
                        value={value}
                        fill="black"
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="Silábico-Alfabético"
                  fill="#F7BF01"
                  activeBar={<Rectangle fill="#f7be017a" stroke="black" />}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  label={(props) => {
                    const { x, y, value, width } = props;
                    return (
                      <CustomizedLabel
                        x={x + width / 2}
                        y={y}
                        value={value}
                        fill="black"
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="Alfabético"
                  fill="#35A853"
                  activeBar={<Rectangle fill="#35a85478" stroke="black" />}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  label={(props) => {
                    const { x, y, value, width } = props;
                    return (
                      <CustomizedLabel
                        x={x + width / 2}
                        y={y}
                        value={value}
                        fill="black"
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="pl-12 text-[24px] font-bold">{`Total Geral: ${sumNumbers(
              graphData,
            )}`}</p>
          </div>
        ) : (
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
              <p>Insira uma data válida</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

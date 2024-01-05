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

import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';

export const ProjectGraph = () => {
  const { register } = useForm();
  const [filtersValues, setFiltersValues] = useState({ name: '' });
  const [initialTotal, setInitialTotal] = useState(null);

  const [filters, setFilters] = useState<{
    [key: string]: { element: ReactNode; view: boolean };
  }>({
    namePopover: {
      element: (
        <InputThemed
          register={register}
          name="name"
          label="Nome do projeto"
          onChange={(event) => {
            nameDebounce(event.target.value);
          }}
        />
      ),
      view: false,
    },
  });

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

  const fetchProjects = async () => {
    return (
      await axiosApi.get('/project', {
        params: { name: filtersValues.name || null },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllProjectsQuery',
    fetchProjects,
    { refetchOnWindowFocus: false },
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
            <form>
              <InputCheckBoxThemed
                label="Nome"
                register={register}
                name="namePopover"
                onClick={(event) => {
                  handleChangeFilters('namePopover', 'name', event);
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

        <div className="relative flex h-[300px] items-center justify-center p-[44px]">
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

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
import { useRouter } from 'next/router';
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
import type { SchollAddress } from '@/types/school';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { CitySelect } from './Selects/CitySelect';
import { ProjectSelect } from './Selects/ProjectSelect';
import { StateSelect } from './Selects/StateSelect';

export const SchoolTable = ({
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
  const route = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [schoolToDelete, setScholToDelete] = useState('');

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    projectId: '',
    state: '',
    city: '',
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
    statePopover: {
      element: (
        <StateSelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, state: event.value }));
          }}
        />
      ),
      view: false,
    },
    cityPopover: {
      element: (
        <CitySelect
          onChange={(event) => {
            setPage(1);
            setFiltersValues((prev) => ({ ...prev, city: event.value }));
          }}
        />
      ),
      view: false,
    },
  });

  const fetchSchools = async () => {
    return (
      await axiosApi.get('/school', {
        params: {
          page,
          perPage,
          name: filtersValues.name || null,
          projectId: filtersValues.projectId || null,
          state: filtersValues.state || null,
          city: filtersValues.city || null,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllSchoolsQuery',
    fetchSchools,
    { refetchOnWindowFocus: false },
  );
  const nodes = { nodes: data?.data };

  const deleteProject = async (id: string) => {
    return (await axiosApi.delete(`/school/${id}`)).data;
  };

  const { mutate } = useMutation('fetchAllProjectsQuery', deleteProject, {
    onSuccess: () => {
      toast.success('escola deletada!');
      refetch();
    },
    onError: () => {
      toast.error('Algo de arrado aconteceu ao deletar a escola!');
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
                label="Estado"
                register={register}
                name="statePopover"
                onClick={(event) => {
                  handleChangeFilters('statePopover', 'state', event);
                }}
              />
              <InputCheckBoxThemed
                label="Cidade"
                register={register}
                name="cityPopover"
                onClick={(event) => {
                  handleChangeFilters('cityPopover', 'city', event);
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
                  data?.data.map((item: SchollAddress) => ({
                    name: item.name,
                    project: item.project.name,
                    city: item.address.city,
                    state: item.address.state,
                  })),
                  ['Nome', 'Projeto', 'Cidade', 'Estado'],
                  'relatorioEscolas',
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
            style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.4fr' }}
          >
            {(tableList: SchollAddress[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Nome</HeaderCell>
                    <HeaderCell>Projeto</HeaderCell>
                    <HeaderCell>Cidade</HeaderCell>
                    <HeaderCell>Estado</HeaderCell>
                    <HeaderCell>Ações</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((school) => (
                    <Row key={school.id} item={school}>
                      <Cell className="text-main hover:text-main">
                        <div className="flex items-center gap-[16px] text-[20px]">
                          <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                            <Image
                              src={
                                school?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="logo da escola"
                              fill
                              className="object-cover"
                            />
                          </div>
                          {school.name}
                        </div>
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {school.project.name}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {school.address.city}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {school.address.state}
                      </Cell>
                      <Cell className="text-center text-main hover:text-main">
                        <div className="flex gap-[8px]">
                          <button
                            type="button"
                            onClick={() => {
                              route.push(`/view/${school.id}/school`);
                            }}
                          >
                            <FiEye size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setScholToDelete(school.id);
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
        {nodes?.nodes && !nodes?.nodes.length ? (
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
        text="Deseja realmente excluir essa escola?"
        onConfirm={() => {
          mutate(schoolToDelete);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

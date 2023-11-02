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
import type { Coordinator } from '@/types/coordinator';
import { createCSV } from '@/utils/createCSV';

import { ConfirmModal } from '../ConfirmModal';
import { InputCheckBoxThemed } from '../forms/InputCheckBoxThemed';
import { InputThemed } from '../forms/InputThemed';
import { Popover } from '../Popover';
import { ProjectSelect } from './Selects/ProjectSelect';
import { SchoolSelect } from './Selects/SchoolSelect';

export const CoordinatorTable = ({
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
  const [coordinatorToDelete, setCoordinatorToDelete] = useState('');

  const [filtersValues, setFiltersValues] = useState({
    name: '',
    projectId: '',
    schoolId: '',
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
  });

  const fetchCoordinators = async () => {
    return (
      await axiosApi.get('/coordinator', {
        params: {
          page,
          perPage,
          name: filtersValues.name || null,
          projectId: filtersValues.projectId || null,
          schoolId: filtersValues.schoolId || null,
        },
      })
    ).data;
  };

  const { isLoading, data, refetch, isRefetching } = useQuery(
    'fetchAllCoordinatorsQuery',
    fetchCoordinators,
    { refetchOnWindowFocus: false },
  );
  const nodes = { nodes: data?.data };

  const deleteCoordinator = async (id: string) => {
    return (await axiosApi.delete(`/coordinator/${id}`)).data;
  };

  const { mutate } = useMutation(
    'deleteCoordinatorMutation',
    deleteCoordinator,
    {
      onSuccess: () => {
        toast.success('Coordenador deletado!');
        refetch();
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu ao deletar o coordenador!');
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
                  data?.data.map((item: Coordinator) => ({
                    name: item.name,
                    email: item.email,
                    telephone: item.telephone,
                    project: item.project.name,
                    school: item.school.name,
                  })),
                  ['Nome', 'Email', 'Telefone', 'Projeto', 'Escola'],
                  'relatorioCoordenadores',
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
            style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 0.4fr' }}
          >
            {(tableList: Coordinator[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Nome</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Telefone</HeaderCell>
                    <HeaderCell>Projeto</HeaderCell>
                    <HeaderCell>Escola</HeaderCell>
                    <HeaderCell>Ações</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((coordinator) => (
                    <Row key={coordinator.id} item={coordinator}>
                      <Cell className="text-main hover:text-main">
                        <div className="flex items-center gap-[16px] text-[20px]">
                          <div className="relative h-[62px] w-[62px] min-w-[62px] overflow-hidden rounded-full">
                            <Image
                              src={
                                coordinator?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="foto do coordenador"
                              fill
                              className="object-cover"
                            />
                          </div>
                          {coordinator.name}
                        </div>
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {coordinator.email}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {coordinator.telephone}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {coordinator.project.name}
                      </Cell>
                      <Cell className="text-[20px] text-main hover:text-main">
                        {coordinator.school.name}
                      </Cell>
                      <Cell className="text-center text-main hover:text-main">
                        <div className="flex gap-[8px]">
                          <Link href={`/view/${coordinator.id}/coordinator`}>
                            <FiEye size={20} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setCoordinatorToDelete(coordinator.id);
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
                src="/assets/images/without-coordinators.png"
                alt="imagem dizendo que até agora estamos sem coordenadores"
                fill
                objectFit="contain"
              />
            </div>
            <div className="text-center text-[22px] text-main">
              <p>Nenhum coordenador encontrado!</p>
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={deleteModal}
        setOpen={setDeleteModal}
        text="Deseja realmente excluir esse coordenador?"
        onConfirm={() => {
          mutate(coordinatorToDelete);
          setDeleteModal(false);
        }}
      />
    </div>
  );
};

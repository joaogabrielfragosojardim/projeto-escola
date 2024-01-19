import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type {
  SchollAddress,
  School as SchoolType,
  SchoolEdit,
} from '@/types/school';

const School = ({
  school,
  projectOptions,
}: {
  school: SchollAddress;
  projectOptions: { label: string; value: string }[];
}) => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<SchoolType>();

  const editSchoolHandle = async (data: SchoolEdit): Promise<any> => {
    return (await axiosApi.put(`/school/${school.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editingSchoolMutation',
    editSchoolHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar a escola!',
        );
      },
      onSuccess: () => {
        toast.success('Escola editada');
      },
    },
  );

  const onSubmit = (data: SchoolType) => {
    const {
      visualIdentity,
      name,
      projectId: { value },
      zipCode,
      city,
      state,
      street,
      neighborhood,
      houseNumber,
    } = data;

    const submitData = {
      visualIdentity,
      name,
      projectId: value,
      address: {
        zipCode: zipCode || school.address.zipCode,
        city: city || school.address.city,
        state: state || school.address.state,
        street: street || school.address.street,
        neighborhood: neighborhood || school.address.neighborhood,
        houseNumber: houseNumber || school.address.houseNumber,
      },
    };
    mutate(submitData);
  };

  const getDataFromViaCep = async (cep: string) => {
    if (cep.length !== 8) {
      return;
    }
    const {
      data: { localidade, uf },
    } = await axiosApi.get(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET',
        'Access-Control-Allow-Headers':
          'Access-Control-Allow-Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization, Accept',
        'Access-Control-Allow-Credentials': 'true',
        Accept: 'text/plain; charset=utf-8',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
    setValue('city', localidade);
    setValue('state', uf);
  };

  const { mutate: mutateViaCep } = useMutation(
    'viaCepMutation',
    getDataFromViaCep,
    {
      onError: () => {
        toast.error('Algo de errado aconteceu ao buscar os dados de CEP');
      },
    },
  );

  return (
    <SideNavMenuContainer title="Escola">
      <div className="p-[32px]">
        <form
          className="grid grid-cols-1 items-end gap-[32px] 2xl:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            defaultValue={school.visualIdentity}
          />
          <InputThemed
            label="CEP"
            placeholder="99999999"
            register={register}
            name="zipCode"
            validations={{
              required: 'Campo obrigatório',
              minLength: {
                message: 'Você deve digitar pelo menos 8 digitos sem traço',
                value: 8,
              },
            }}
            defaultValue={school.address.zipCode}
            maxLength={8}
            error={errors.zipCode}
            onChange={(e) => mutateViaCep(e.target.value)}
          />
          <InputThemed
            register={register}
            name="name"
            defaultValue={school.name}
            label="Nome"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
          <InputThemed
            disabled
            register={register}
            name="state"
            defaultValue={school.address.state}
            label="Estado"
          />
          <SelectThemed
            reset={reset}
            control={control}
            name="projectId"
            label="Projeto"
            placeholder="Projeto"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.projectId}
            options={projectOptions}
            defaultValue={
              {
                value: school.project.id,
                label: school.project.name,
              } as unknown as any
            }
            menuPlacement="top"
          />
          <InputThemed
            disabled
            register={register}
            name="city"
            defaultValue={school.address.city}
            label="Cidade"
          />
          <InputThemed
            register={register}
            name="street"
            defaultValue={school.address.street}
            label="Rua"
          />
          <InputThemed
            register={register}
            name="neighborhood"
            defaultValue={school.address.neighborhood}
            label="Bairro"
          />
          <InputThemed
            register={register}
            name="houseNumber"
            defaultValue={school.address.houseNumber}
            label="Número"
            type="number"
          />
          <div className="mt-[48px] text-[16px] lg:text-[20px]">
            <button
              type="submit"
              className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <TbLoader />
                </div>
              ) : (
                'Editar'
              )}
            </button>
          </div>
        </form>
      </div>
    </SideNavMenuContainer>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token, user } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';
  const userObject = JSON.parse(user || '');

  try {
    verify(token || '', secret);

    const canView = [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(
      userObject?.role.name,
    );
    if (canView) {
      const { data } = await axiosApi.get(`/school/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data: dataOptions } = await axiosApi.get(`/project/options`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        props: {
          school: data?.school,
          projectOptions: dataOptions?.options,
        },
      };
    }
    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default School;

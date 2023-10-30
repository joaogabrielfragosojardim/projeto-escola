import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { validatePhone } from 'validations-br';

import { axiosApi } from '@/components/api/axiosApi';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import type {
  Coordinator as CoordinatorType,
  CoordinatorEdit,
} from '@/types/coordinator';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const Coordinator = ({
  coordinator,
  schoolOptions,
}: {
  coordinator: CoordinatorType;
  schoolOptions: { label: string; value: string }[];
}) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CoordinatorType>();

  const editCoordinatorHandle = async (data: CoordinatorEdit): Promise<any> => {
    return (await axiosApi.put(`/coordinator/${coordinator.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editingSchoolMutation',
    editCoordinatorHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar a escola!',
        );
      },
      onSuccess: () => {
        toast.success('Coordenador editado');
      },
    },
  );

  const onSubmit = (data: CoordinatorType) => {
    const { visualIdentity, name, telephone, school } = data;
    const submitData = {
      visualIdentity: visualIdentity || coordinator.visualIdentity,
      name: name || coordinator.name,
      telephone: telephone || coordinator.telephone,
      schoolId: school?.value || coordinator.school.id,
    };
    mutate(submitData);
  };

  return (
    <SideNavMenuContainer title="Projeto">
      <div className="p-[32px]">
        <form
          className="grid grid-cols-2 items-end gap-[32px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            defaultValue={coordinator?.visualIdentity}
          />
          <InputThemed
            register={register}
            name="telephone"
            mask="(99) 9 9999-9999"
            defaultValue={coordinator.telephone}
            label="Telefone"
            validations={{
              required: 'Campo obrigatório',
              validate: (value: string) => {
                return validatePhone(value) || 'Telefone invalido';
              },
            }}
            error={errors.telephone}
          />
          <InputThemed
            register={register}
            name="name"
            defaultValue={coordinator.name}
            label="Nome"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
          <SelectThemed
            reset={reset}
            control={control}
            name="school"
            label="Escola"
            placeholder="Escola"
            options={schoolOptions}
            defaultValue={
              {
                value: coordinator.school.id,
                label: coordinator.school.name,
              } as unknown as any
            }
            menuPlacement="top"
          />
          <InputThemed
            register={register}
            name="email"
            disabled
            defaultValue={coordinator.email}
            label="Email"
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
      const { data } = await axiosApi.get(`/coordinator/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data: dataSchoolOptions } = await axiosApi.get(
        `/school/options`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return {
        props: {
          coordinator: data?.coordinator,
          schoolOptions: dataSchoolOptions?.options,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Coordinator;

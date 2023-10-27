import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { useClientSide } from '@/hooks/useClientSide';
import { useUser } from '@/store/user/context';
import type { ADM } from '@/types/adm';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const Adm = ({ adm }: { adm: ADM }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ADM>();
  const route = useRouter();
  const user = useUser();
  const clientSide = useClientSide();

  const editAdmHandle = async (data: ADM): Promise<any> => {
    return (await axiosApi.put(`/adm/${adm.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editingAdmMutation',
    editAdmHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar o projeto!',
        );
      },
      onSuccess: () => {
        toast.success('Projeto editado');
      },
    },
  );

  const onSubmit = (data: ADM) => {
    mutate(data);
  };

  if (!clientSide) {
    return;
  }

  return (
    <SideNavMenuContainer title="Projeto">
      <div className="p-[32px]">
        <form className="max-w-[430px]" onSubmit={handleSubmit(onSubmit)}>
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            defaultValue={adm.visualIdentity}
            validations={{ required: 'Campo obrigatório' }}
            error={errors.visualIdentity}
          />
          <div className="mt-[32px]">
            <InputThemed
              register={register}
              name="name"
              defaultValue={adm.name}
              label="Nome"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.name}
            />
          </div>
          <div className="mt-[32px]">
            <InputThemed
              register={register}
              name="email"
              defaultValue={adm.email}
              label="Email"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.email}
            />
          </div>
          <div className="mt-[32px]">
            <InputPasswordThemed
              disabled={user.id !== route.query.id}
              register={register}
              name="password"
              defaultValue={adm.password}
              label="Senha"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.password}
            />
          </div>
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

    const canView = [RoleEnum.ADM_MASTER].includes(userObject?.role.name);

    if (canView) {
      const { data } = await axiosApi.get(`/adm/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        props: {
          adm: data?.adm,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Adm;

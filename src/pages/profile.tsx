import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
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
import type { PrismaError } from '@/types/prismaError';
import type { User } from '@/types/user';

interface ProfileProps {
  user: User;
}

const Profile = ({ user: { name, email, visualIdentity } }: ProfileProps) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const clientSide = useClientSide();

  const editUserHandle = async (data: User): Promise<any> => {
    return (await axiosApi.put(`/user`, data)).data;
  };

  const { isLoading, mutate } = useMutation('editUser', editUserHandle, {
    onError: (error: PrismaError) => {
      toast.error(
        error?.response?.data?.message ||
          'Algo deu errado ao editar seu perfil!',
      );
    },
    onSuccess: () => {
      toast.success('Perfil editado');
    },
  });

  const onSubmit = (data: User) => {
    mutate(data);
  };

  if (!clientSide) {
    return;
  }

  return (
    <SideNavMenuContainer title="Adm">
      <div className="p-[32px]">
        <form className="max-w-[430px]" onSubmit={handleSubmit(onSubmit)}>
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            defaultValue={visualIdentity}
            validations={{ required: 'Campo obrigatório' }}
            error={errors.visualIdentity}
          />
          <div className="mt-[32px]">
            <InputThemed
              register={register}
              name="name"
              defaultValue={name}
              label="Nome"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.name}
            />
          </div>
          <div className="mt-[32px]">
            <InputThemed
              disabled
              register={register}
              name="email"
              defaultValue={email}
              label="Email"
            />
          </div>
          <div className="mt-[32px]">
            <InputPasswordThemed
              register={register}
              name="password"
              placeholder="******"
              label="Senha"
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

export default Profile;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';

  try {
    verify(token || '', secret);

    const { data } = await axiosApi.get('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      props: { user: data?.user },
    };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

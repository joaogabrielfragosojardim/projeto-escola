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
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import type { PrismaError } from '@/types/prismaError';
import type { Project as ProjectType } from '@/types/project';
import { RoleEnum } from '@/types/roles';

const Project = ({ project }: { project: ProjectType }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectType>();

  const editProjectHandle = async (data: ProjectType): Promise<any> => {
    return (await axiosApi.put(`/project/${project.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editingProjectMutation',
    editProjectHandle,
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

  const onSubmit = (data: ProjectType) => {
    mutate(data);
  };

  return (
    <SideNavMenuContainer title="Projeto">
      <div className="p-[32px]">
        <form className="max-w-[430px]" onSubmit={handleSubmit(onSubmit)}>
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            error={errors.visualIdentity}
          />
          <div className="mt-[32px]">
            <InputThemed
              register={register}
              name="name"
              defaultValue={project.name}
              label="Nome"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.name}
            />
          </div>
          <div className="mt-[32px]">
            <InputThemed
              register={register}
              name="about"
              defaultValue={project.about}
              label="Sobre"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.about}
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

    const canView = [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(
      userObject?.role.name,
    );

    if (canView) {
      const { data } = await axiosApi.get(`/project/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        props: {
          project: data?.project,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Project;

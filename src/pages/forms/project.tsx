import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import type { PrismaError } from '@/types/prismaError';
import type { Project as ProjectType } from '@/types/project';
import { RoleEnum } from '@/types/roles';

const ProjectForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ProjectType>();

  const router = useRouter();

  const createProjectHandle = async (data: ProjectType): Promise<any> => {
    return (await axiosApi.post('/project', data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'creatingProjectMutation',
    createProjectHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao cadastrar o projeto!',
        );
      },
      onSuccess: () => {
        toast.success('Projeto cadastrado');
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: ProjectType) => {
    mutate(data);
  };

  return (
    <div className="mx-auto flex max-w-[345px] flex-col items-center lg:inline lg:max-w-[400px]">
      <Link
        href="/dashboard"
        className="flex max-w-max items-center gap-[8px] self-start rounded bg-main p-[8px] text-complement-100"
      >
        <IoIosArrowBack />
        <p className="hidden lg:inline">Voltar para o dashboard</p>
      </Link>
      <h1 className="mt-[32px] text-[16px] font-semibold text-complement-200 lg:text-[24px]">
        Cadastro de Projeto:
      </h1>
      <form
        className="mt-[16px] w-full lg:max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputImageThemed
          label="Identidade Visual"
          register={register}
          name="visualIdentity"
          reset={reset}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome do projeto"
            placeholder="projeto exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Sobre"
            placeholder="Projeto desenvolvido para..."
            register={register}
            name="about"
            validations={{
              required: 'Campo obrigatório',
            }}
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
              'Cadastrar Projeto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Project = () => {
  return (
    <FormDefaultPage
      image="/assets/images/form-project.jpg"
      form={<ProjectForm />}
    />
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
      return { props: {} };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Project;

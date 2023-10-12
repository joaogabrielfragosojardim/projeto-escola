import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import type { PrismaError } from '@/types/prismaError';

interface IProjectForm {
  name: string;
  visualIdentity: string;
  about: string;
}

const ProjectForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IProjectForm>();

  const router = useRouter();

  const createProjectHandle = async (data: IProjectForm): Promise<any> => {
    return (await axiosApi.post('/project', data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'creatingProjectMutation',
    createProjectHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message ||
            'Algo deu errado ao cadastrar o projeto!',
        );
      },
      onSuccess: () => {
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: IProjectForm) => {
    mutate(data);
  };

  return (
    <div>
      <Link
        href="/dashboard"
        className="flex max-w-max items-center gap-[8px] rounded bg-main p-[8px] text-complement-100"
      >
        <IoIosArrowBack /> Voltar para o dashboard
      </Link>
      <h1 className="mt-[32px] text-[24px] font-semibold text-complement-200">
        Cadastro de Projeto:
      </h1>
      <form
        className="mt-[16px] max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputImageThemed
          label="Identidade Visual"
          register={register}
          name="visualIdentity"
          validations={{ required: 'Campo obrigatório' }}
          error={errors.name}
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
        <div className="mt-[48px] text-[20px]">
          <button
            type="submit"
            className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
          >
            {isLoading ? (
              <div className="animate-spin">
                <AiOutlineLoading3Quarters />
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
      image="/assets/images/form-project.png"
      form={<ProjectForm />}
    />
  );
};

export default Project;

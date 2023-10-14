import type { Project } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { RoleEnum } from '@/types/roles';
import type { School as SchoolType } from '@/types/school';

const SchoolForm = ({ projects }: { projects: Project[] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SchoolType>();
  const formatedProjects = projects.map((project) => ({
    value: project.name,
    label: project.name,
  }));

  const onSubmit = (data: SchoolType) => {
    console.log({ data });
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
        Cadastro de Escola:
      </h1>
      <form
        className="mt-[16px] w-full lg:max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputImageThemed
          label="Imagem"
          register={register}
          name="visualIdentity"
          validations={{ required: 'Campo obrigatório' }}
          error={errors.visualIdentity}
          reset={reset}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome da escola"
            placeholder="Escola exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
        </div>
        <div className="mt-[16px]">
          <SelectThemed
            label="Projeto"
            placeholder="Selecione um projeto"
            control={control}
            name="project"
            validations={{
              required: 'Campo obrigatório',
            }}
            error={errors.project}
            options={formatedProjects}
          />
        </div>
        <div className="mt-[48px] text-[16px] lg:text-[20px]">
          <button
            type="submit"
            className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

const School = ({ projects }: { projects: Project[] }) => {
  return (
    <FormDefaultPage
      image="/assets/images/form-project.png"
      form={<SchoolForm projects={projects} />}
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
      const { data } = await axiosApi.get('/project', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { props: { projects: data.data } };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default School;

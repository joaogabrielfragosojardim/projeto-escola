import type { Project } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import nookies from 'nookies';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { MultiStepForm } from '@/components/ui/forms/MultiStepForm';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import {
  useSchoolForm,
  useSchoolFormDispatch,
} from '@/store/schoolForm/context';
import { SchoolFormTypesEnum } from '@/store/schoolForm/types';
import { RoleEnum } from '@/types/roles';
import type { School as SchoolType } from '@/types/school';

const SchoolFormFirstStep = ({
  projects,
  setStep,
}: {
  projects: Project[];
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<SchoolType>();

  const schoolFormDispatch = useSchoolFormDispatch();
  const schoolForm = useSchoolForm();

  const formatedProjects = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const onSubmit = (data: SchoolType) => {
    const {
      visualIdentity,
      name,
      projectId: { value, label },
    } = data;
    schoolFormDispatch({
      type: SchoolFormTypesEnum.ADD_SCHOOL_FORM,
      payload: {
        visualIdentity,
        name,
        projectId: { value, label },
        city: '',
        state: '',
        street: '',
        cep: '',
      },
    });
    setStep((prev) => prev + 1);
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
          defaultValue={schoolForm.visualIdentity}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome da escola"
            placeholder="Escola exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
            defaultValue={schoolForm.name}
          />
        </div>
        <div className="mt-[16px]">
          <SelectThemed
            label="Projeto"
            placeholder="Selecione um projeto"
            control={control}
            name="projectId"
            validations={{
              required: 'Campo obrigatório',
            }}
            error={errors.projectId}
            options={formatedProjects}
            defaultValue={
              schoolForm.projectId.label && schoolForm.projectId.value
                ? ({
                    label: schoolForm.projectId.label,
                    value: schoolForm.projectId.value,
                  } as unknown as any)
                : null
            }
            reset={reset}
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

const SchoolFormSecondStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SchoolType>();

  const schoolFormDispatch = useSchoolFormDispatch();

  const getDataFromViaCep = async (cep: string) => {
    if (cep.length !== 8) {
      return;
    }
    const {
      data: { localidade, uf },
    } = await axiosApi.get(`https://viacep.com.br/ws/${cep}/json/`);
    setValue('city', localidade);
    setValue('state', uf);
  };

  const { mutate } = useMutation('viaCepMutation', getDataFromViaCep, {
    onError: () => {
      toast.error('Alglo de errado aconteceu ao buscar os dados de CEP');
    },
  });

  const onSubmit = (data: SchoolType) => {
    const {
      visualIdentity,
      name,
      projectId: { value, label },
    } = data;
    schoolFormDispatch({
      type: SchoolFormTypesEnum.ADD_SCHOOL_FORM,
      payload: {
        visualIdentity,
        name,
        projectId: { value, label },
        city: '',
        state: '',
        street: '',
        cep: '',
      },
    });
    setStep((prev) => prev + 1);
  };
  return (
    <div className="mx-auto flex max-w-[345px] flex-col items-center lg:inline lg:max-w-[400px]">
      <button
        type="button"
        className="flex max-w-max items-center gap-[8px] self-start rounded bg-main p-[8px] text-complement-100"
        onClick={() => {
          setStep((prev) => prev - 1);
        }}
      >
        <IoIosArrowBack />
        <p className="hidden lg:inline">Voltar</p>
      </button>
      <form
        className="mt-[16px] w-full lg:max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputThemed
          label="CEP"
          placeholder="99999999"
          register={register}
          name="cep"
          validations={{
            required: 'Campo obrigatório',
            minLength: {
              message: 'Você deve digitar pelo menos 8 digitos sem traço',
              value: 8,
            },
          }}
          maxLength={8}
          error={errors.cep}
          onChange={(e) => mutate(e.target.value)}
        />
        <div className="mt-[16px] flex gap-[16px]">
          <div className="w-[50%]">
            <InputThemed
              label="Estado"
              register={register}
              disabled
              name="state"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.name}
            />
          </div>
          <div className="w-[50%]">
            <InputThemed
              label="Município"
              disabled
              register={register}
              name="city"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.name}
            />
          </div>
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Rua"
            placeholder="Rua Josevaldo, Bairro Romero, Número 10"
            register={register}
            name="street"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
        </div>
        <div className="mt-[48px] text-[16px] lg:text-[20px]">
          <button
            type="submit"
            className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
          >
            Cadastrar Escola
          </button>
        </div>
      </form>
    </div>
  );
};

const School = ({ projects }: { projects: Project[] }) => {
  const [step, setStep] = useState(0);
  return (
    <FormDefaultPage
      image="/assets/images/form-school.png"
      form={
        <MultiStepForm
          step={step}
          forms={[
            <SchoolFormFirstStep
              projects={projects}
              setStep={setStep}
              key={0}
            />,
            <SchoolFormSecondStep setStep={setStep} key={1} />,
          ]}
        />
      }
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

import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { MultiStepForm } from '@/components/ui/forms/MultiStepForm';
import {
  useSchoolForm,
  useSchoolFormDispatch,
} from '@/store/schoolForm/context';
import { SchoolFormTypesEnum } from '@/store/schoolForm/types';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type { School as SchoolType } from '@/types/school';

const SocialEducatorFirstStep = ({
  projects,
  setStep,
}: {
  projects: { label: string; value: string }[];
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
        zipCode: '',
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
        Cadastro de Educador Social:
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
            label="Nome do educador"
            placeholder="Nome exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
            defaultValue={schoolForm.name}
          />
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Email do educador"
            placeholder="Email exemplo..."
            register={register}
            name="email"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.email}
            defaultValue={schoolForm.email}
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

const SocialEducatorSecondStep = ({
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
  const schoolForm = useSchoolForm();
  const route = useRouter();

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
      toast.error('Algo de errado aconteceu ao buscar os dados de CEP');
    },
  });

  const createSchool = async (data: any) => {
    return axiosApi.post('/school', data);
  };

  const { mutate: mutateCreateSchool, isLoading } = useMutation(
    'createSchoolMutation',
    createSchool,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message ||
            'Algo de errado aconteceu ao criar a escola!',
        );
      },
      onSuccess: () => {
        toast.success('escola criada com sucesso!');
        schoolFormDispatch({
          type: SchoolFormTypesEnum.REMOVE_SCHOOL_FORM,
          payload: {},
        });
        route.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: SchoolType) => {
    const {
      visualIdentity,
      name,
      projectId: { value },
    } = schoolForm;
    const { zipCode, city, state, street } = data;

    const submitData = {
      visualIdentity,
      name,
      projectId: value,
      address: {
        zipCode,
        city,
        state,
        street,
      },
    };
    mutateCreateSchool(submitData);
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
          name="zipCode"
          validations={{
            required: 'Campo obrigatório',
            minLength: {
              message: 'Você deve digitar pelo menos 8 digitos sem traço',
              value: 8,
            },
          }}
          maxLength={8}
          error={errors.zipCode}
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
              error={errors.state}
            />
          </div>
          <div className="w-[50%]">
            <InputThemed
              label="Município"
              disabled
              register={register}
              name="city"
              validations={{ required: 'Campo obrigatório' }}
              error={errors.city}
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
            error={errors.street}
          />
        </div>
        <div className="mt-[48px] text-[16px] lg:text-[20px]">
          <button
            disabled={isLoading}
            type="submit"
            className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
          >
            {isLoading ? (
              <div className="animate-spin">
                <TbLoader size={24} />
              </div>
            ) : (
              'Cadastrar Escola'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Educator = ({
  projects,
}: {
  projects: { value: string; label: string }[];
}) => {
  const [step, setStep] = useState(0);
  return (
    <FormDefaultPage
      image="/assets/images/form-educator.png"
      form={
        <MultiStepForm
          step={step}
          forms={[
            <SocialEducatorFirstStep
              projects={projects}
              setStep={setStep}
              key={0}
            />,
            <SocialEducatorSecondStep setStep={setStep} key={1} />,
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
      const { data } = await axiosApi.get('/project/options', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { props: { projects: data.options } };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Educator;

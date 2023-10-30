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
import { validateEmail, validatePhone } from 'validations-br';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { MultiStepForm } from '@/components/ui/forms/MultiStepForm';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { allPeriods, allSeries } from '@/constants/classroom';
import {
  useSocialEducatorForm,
  useSocialEducatorFormDispatch,
} from '@/store/socialEducatorForm/context';
import { SocialEducatorFormTypesEnum } from '@/store/socialEducatorForm/types';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type { SocialEducator } from '@/types/socialEducator';

const SocialEducatorFirstStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SocialEducator>();

  const socialEducatorFormDispatch = useSocialEducatorFormDispatch();
  const socialEdutatorForm = useSocialEducatorForm();

  const onSubmit = (data: SocialEducator) => {
    const { visualIdentity, name, email } = data;
    socialEducatorFormDispatch({
      type: SocialEducatorFormTypesEnum.ADD_SOCIAL_EDUCATOR_FORM,
      payload: {
        visualIdentity,
        name,
        email,
        schoolId: '',
        period: '',
        year: '',
        password: '',
        telephone: '',
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
          defaultValue={socialEdutatorForm.visualIdentity}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome do educador"
            placeholder="Nome exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
            defaultValue={socialEdutatorForm.name}
          />
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Email do educador"
            placeholder="Email exemplo..."
            register={register}
            name="email"
            validations={{
              required: 'Campo obrigatório',
              validate: (value: string) => {
                return validateEmail(value) || 'Email invalido';
              },
            }}
            error={errors.email}
            defaultValue={socialEdutatorForm.email}
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
  schools,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  schools: { value: string; label: string }[];
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SocialEducator>();

  const socialEducatorFormDispatch = useSocialEducatorFormDispatch();
  const socialEducatorForm = useSocialEducatorForm();
  const route = useRouter();

  const createSocialEducator = async (data: any) => {
    return axiosApi.post('/teacher', data);
  };

  const { mutate: mutateCreateSocialEducator, isLoading } = useMutation(
    'createSocialEducatorMutation',
    createSocialEducator,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message ||
            'Algo de errado aconteceu ao criar o educador social!',
        );
      },
      onSuccess: () => {
        toast.success('Educador social criado com sucesso!');
        socialEducatorFormDispatch({
          type: SocialEducatorFormTypesEnum.REMOVE_SOCIAL_EDUCATOR_FORM,
          payload: {},
        });
        route.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: SocialEducator) => {
    const { visualIdentity, name } = socialEducatorForm;
    const { email, password } = data;

    const submitData = {
      visualIdentity,
      name,
      email,
      password,
    };
    mutateCreateSocialEducator(submitData);
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
        <InputPasswordThemed
          label="Senha"
          placeholder="******"
          register={register}
          name="password"
          error={errors.password}
        />

        <div className="mt-[16px]">
          <SelectThemed
            name="schoolId"
            reset={reset}
            control={control}
            label="Escola"
            placeholder="Escola..."
            options={schools}
          />
        </div>
        <div className="mt-[16px] flex gap-[16px]">
          <div className="w-[50%]">
            <SelectThemed
              name="year"
              reset={reset}
              control={control}
              label="Série"
              placeholder="Série..."
              options={allSeries.map((serie) => ({
                label: `${serie}º Ano`,
                value: serie.toString(),
              }))}
            />
          </div>
          <div className="w-[50%]">
            <SelectThemed
              name="period"
              reset={reset}
              control={control}
              label="Período"
              placeholder="Período..."
              options={allPeriods.map((periods) => ({
                label: periods,
                value: periods,
              }))}
            />
          </div>
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Telefone"
            placeholder="(99) 9 9999-9999"
            mask="(99) 9 9999-9999"
            register={register}
            name="telephone"
            validations={{
              required: 'Campo obrigatório',
              validate: (value: string) => {
                return validatePhone(value) || 'Telefone invalido';
              },
            }}
            error={errors.telephone}
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
  schools,
}: {
  schools: { value: string; label: string }[];
}) => {
  const [step, setStep] = useState(0);
  return (
    <FormDefaultPage
      image="/assets/images/form-educator.png"
      form={
        <MultiStepForm
          step={step}
          forms={[
            <SocialEducatorFirstStep setStep={setStep} key={0} />,
            <SocialEducatorSecondStep
              setStep={setStep}
              key={1}
              schools={schools}
            />,
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

    const canView = [
      RoleEnum.ADM_MASTER,
      RoleEnum.ADM,
      RoleEnum.COORDINATOR,
    ].includes(userObject?.role.name);

    if (canView) {
      const { data: dataSchool } = await axiosApi.get('/school/options', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        props: {
          schools: dataSchool.options,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Educator;

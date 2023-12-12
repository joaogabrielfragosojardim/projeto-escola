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
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { MultiStepForm } from '@/components/ui/forms/MultiStepForm';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import {
  useCoordinatorForm,
  useCoordinatorFormDispatch,
} from '@/store/coordinatorForm/context';
import { CoordinatorFormTypesEnum } from '@/store/coordinatorForm/types';
import type { Coordinator as CoordinatorType } from '@/types/coordinator';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const CoordinatorFirstStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CoordinatorType>();

  const coordinatorFormDispatch = useCoordinatorFormDispatch();
  const coordinatorForm = useCoordinatorForm();

  const onSubmit = (data: CoordinatorType) => {
    const { visualIdentity, name } = data;
    coordinatorFormDispatch({
      type: CoordinatorFormTypesEnum.ADD_COORDINATOR_FORM,
      payload: {
        visualIdentity,
        name,
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
        Cadastro de Coordenador:
      </h1>
      <form
        className="mt-[16px] w-full lg:max-w-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputImageThemed
          label="Imagem"
          register={register}
          name="visualIdentity"
          reset={reset}
          defaultValue={coordinatorForm.visualIdentity}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome"
            placeholder="Nome exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
            defaultValue={coordinatorForm.name}
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

const CoordinatorSecondStep = ({
  setStep,
  projects,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  projects: { value: string; label: string }[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CoordinatorType>();
  const [schoolOptions, setSchoolOptions] = useState([]);

  const coordinatorFormDispatch = useCoordinatorFormDispatch();
  const coordinatorForm = useCoordinatorForm();
  const route = useRouter();

  const createCoordinator = async (data: any) => {
    return axiosApi.post('/coordinator', data);
  };

  const { mutate: mutateCreateCoordinator, isLoading } = useMutation(
    'createSchoolMutation',
    createCoordinator,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message ||
            'Algo de errado aconteceu ao criar o Coordenador!',
        );
      },
      onSuccess: () => {
        toast.success('Coordenador criado com sucesso!');
        coordinatorFormDispatch({
          type: CoordinatorFormTypesEnum.REMOVE_COORDINATOR_FORM,
          payload: {},
        });
        route.push('/dashboard');
      },
    },
  );

  const findSchoolsByProject = async (projectId: string) => {
    return axiosApi.get('/school/options', {
      params: {
        projectId,
      },
    });
  };

  const { mutate: mutateFindSchoolByProjectMutation, isLoading: isMutating } =
    useMutation('findSchoolByProjectMutation', findSchoolsByProject, {
      onSuccess: (dataSchools) => {
        setSchoolOptions(dataSchools?.data.options);
      },
      onError: () => {
        toast.error('Algo de arrado aconteceu');
      },
    });

  const onSubmit = (data: CoordinatorType) => {
    const { email, telephone, school } = data;
    const { visualIdentity, name } = coordinatorForm;

    const submitData = {
      visualIdentity,
      name,
      email,
      telephone,
      schoolId: school.value,
    };
    mutateCreateCoordinator(submitData);
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
          label="Email"
          placeholder="email@email.com"
          register={register}
          name="email"
          validations={{
            required: 'Campo obrigatório',
            validate: (value: string) => {
              return validateEmail(value) || 'Email invalido';
            },
          }}
          error={errors.email}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Telefone - Prefencialmente Whatsapp"
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
        <div className="mt-[16px]">
          <SelectThemed
            control={control}
            reset={reset}
            label="Projeto"
            placeholder="Projeto"
            name="project"
            validations={{
              required: 'Campo obrigatório',
            }}
            options={projects}
            error={errors.project as unknown as any}
            onChange={(option: any) => {
              mutateFindSchoolByProjectMutation(option.value);
            }}
          />
        </div>
        <div className="mt-[16px]">
          <SelectThemed
            control={control}
            reset={reset}
            label="Escola"
            placeholder="Escola"
            name="school"
            validations={{
              required: 'Campo obrigatório',
            }}
            options={schoolOptions}
            error={errors.school as unknown as any}
            isDisabled={!schoolOptions.length || isMutating}
            isLoading={isMutating}
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
              'Cadastrar Coordenador'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Coordinator = ({
  schools: projects,
}: {
  schools: { value: string; label: string }[];
}) => {
  const [step, setStep] = useState(0);
  return (
    <FormDefaultPage
      image="/assets/images/form-coordinator.png"
      form={
        <MultiStepForm
          step={step}
          forms={[
            <CoordinatorFirstStep setStep={setStep} key={0} />,
            <CoordinatorSecondStep
              setStep={setStep}
              key={1}
              projects={projects}
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

    const canView = [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(
      userObject?.role.name,
    );

    if (canView) {
      const { data } = await axiosApi.get('/project/options', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { props: { schools: data.options } };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Coordinator;

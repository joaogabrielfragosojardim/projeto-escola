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
import { validateEmail } from 'validations-br';

import { axiosApi } from '@/components/api/axiosApi';
import { FormDefaultPage } from '@/components/ui/forms/FormDefaultPage';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { MultiStepForm } from '@/components/ui/forms/MultiStepForm';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import {
  useStudentForm,
  useStudentFormDispatch,
} from '@/store/studentForm/context';
import { StudentFormTypesEnum } from '@/store/studentForm/types';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type { Student as StudentProps } from '@/types/student';
import { formatDateToISO } from '@/utils/formatDate';

const StudentFirstStep = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentProps>();

  const studentFormDispatch = useStudentFormDispatch();
  const studentForm = useStudentForm();

  const onSubmit = (data: StudentProps) => {
    const { visualIdentity, name, email } = data;
    studentFormDispatch({
      type: StudentFormTypesEnum.ADD_STUDENT_FORM,
      payload: {
        visualIdentity,
        name,
        email,
        schoolId: { id: '', value: '' },
        period: '',
        password: '',
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
        Cadastro de aluno:
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
          defaultValue={studentForm.visualIdentity}
        />
        <div className="mt-[16px]">
          <InputThemed
            label="Nome do aluno"
            placeholder="Nome exemplo..."
            register={register}
            name="name"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
            defaultValue={studentForm.name}
          />
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Email do aluno"
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
            defaultValue={studentForm.email}
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

const StudentSecondStep = ({
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
  } = useForm<StudentProps>();

  const studentFormDispatch = useStudentFormDispatch();
  const studentForm = useStudentForm();
  const route = useRouter();

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const optionsClass = async (schoolId: string) => {
    const { data } = await axiosApi.get('/class/options', {
      params: {
        schoolId,
      },
    });

    return data.options;
  };

  const {
    mutate: mutateOptionsClass,
    data: options,
    isLoading: IsLoadingOptions,
  } = useMutation({
    mutationFn: (schoolId: string) => optionsClass(schoolId),
  });

  const createStudent = async (data: any) => {
    return axiosApi.post('/student', data);
  };

  const { mutate: mutateCreateStudent, isLoading } = useMutation(
    'createStudent',
    createStudent,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message ||
            'Algo de errado aconteceu ao criar o aluno!',
        );
      },
      onSuccess: () => {
        toast.success('Aluno criado com sucesso!');
        studentFormDispatch({
          type: StudentFormTypesEnum.REMOVE_STUDENT_FORM,
          payload: {},
        });
        route.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: StudentProps) => {
    const { visualIdentity, name, email } = studentForm;
    const { password, schoolId, birtday, classId } = data;

    const submitData = {
      name,
      visualIdentity,
      email,
      password,
      birtday: formatDateToISO(birtday),
      schoolId: schoolId?.value,
      classId: classId?.value,
    };

    mutateCreateStudent(submitData);
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
          validations={{
            required: 'Campo obrigatório',
            minLength: {
              value: 6,
              message: 'a senha deve conter no mínimo 6 caracteres',
            },
          }}
        />

        <div className="mt-[16px]">
          <SelectThemed
            reset={reset}
            control={control}
            label="Escola"
            name="schoolId"
            placeholder="Escola..."
            options={schools}
            error={errors.schoolId}
            validations={{ required: 'Campo obrigatório' }}
            onChange={(option) => {
              // @ts-ignore
              mutateOptionsClass(option?.value);
            }}
          />
        </div>
        <div className="mt-[16px] flex gap-[16px]">
          <div className="w-full">
            <SelectThemed
              isLoading={IsLoadingOptions}
              isDisabled={!options}
              name="classId"
              reset={reset}
              error={errors.classId}
              control={control}
              label="Turma"
              placeholder="Turma..."
              options={options || []}
              validations={{ required: 'Campo obrigatório' }}
            />
          </div>
        </div>
        <div className="mt-[16px]">
          <InputThemed
            label="Data de nascimento"
            placeholder="00/00/0000"
            mask="99/99/9999"
            register={register}
            name="birtday"
            validations={{
              required: 'Campo obrigatório',
            }}
            max={maxDate.toISOString().split('T')[0]}
            error={errors.birtday}
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
              'Cadastrar Aluno'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Student = ({
  schools,
}: {
  schools: { value: string; label: string }[];
}) => {
  const [step, setStep] = useState(0);
  return (
    <FormDefaultPage
      image="/assets/images/form-student.png"
      form={
        <MultiStepForm
          step={step}
          forms={[
            <StudentFirstStep setStep={setStep} key={0} />,
            <StudentSecondStep setStep={setStep} key={1} schools={schools} />,
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
      RoleEnum.TEACHER,
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

export default Student;

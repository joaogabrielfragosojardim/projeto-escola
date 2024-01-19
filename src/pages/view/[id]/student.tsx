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
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { allPeriods, allSeries } from '@/constants/classroom';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type {
  StudentEdit,
  StudentEditForm,
  StudentEditRequest,
} from '@/types/student';

const SocialEducator = ({ student }: { student: StudentEdit }) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentEditForm>();

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const editStudentHandle = async (data: StudentEditRequest): Promise<any> => {
    return (await axiosApi.put(`/student/${student.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editStudentMutation',
    editStudentHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar o Estudante!',
        );
      },
      onSuccess: () => {
        toast.success('Estudante editado');
      },
    },
  );

  const onSubmit = (data: StudentEditForm) => {
    const { visualIdentity, name, classRoom, birtday, registration } = data;
    console.log(classRoom);

    const submitData = {
      visualIdentity: visualIdentity || student.user.visualIdentity,
      name: name || student.user.name,
      classRoom:
        { period: classRoom.value.period, year: classRoom.value.year } ||
        student.Classroom,
      birtday: birtday || student.birtday,
      registration: registration || student.registration,
    };
    mutate(submitData);
  };

  return (
    <SideNavMenuContainer title="Projeto">
      <div className="p-[32px]">
        <form
          className="grid grid-cols-2 items-end gap-[32px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputImageThemed
            register={register}
            name="visualIdentity"
            label=""
            reset={reset}
            defaultValue={student?.user.visualIdentity}
          />

          <InputThemed
            register={register}
            name="name"
            defaultValue={student.user.name}
            label="Nome"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.name}
          />
          <InputThemed
            register={register}
            disabled
            name="school"
            label="Escola"
            placeholder="Escola"
            defaultValue={student.school.name}
          />
          <InputThemed
            register={register}
            name="email"
            disabled
            defaultValue={student.user.email}
            label="Email"
          />
          <InputThemed
            register={register}
            name="birtday"
            defaultValue={new Date(student.birtday).toISOString().split('T')[0]}
            type="date"
            max={maxDate.toISOString().split('T')[0]}
            label="Aniversário"
          />
          <InputThemed
            register={register}
            name="registration"
            defaultValue={student.registration}
            label="Matrícula"
          />
          <div>
            <div className="flex w-full items-center gap-[16px]">
              <SelectThemed
                control={control}
                reset={reset}
                name="classRoom"
                label="Turma"
                placeholder="turma"
                options={allPeriods
                  .map((period) => {
                    return allSeries.map((serie) => ({
                      label: `${serie} - ${period}`,
                      value: { year: serie, period },
                    }));
                  })
                  .flat()}
                defaultValue={{
                  label: `${student.Classroom.year} - ${student.Classroom.period}`,
                  valeu: {
                    year: student.Classroom.year,
                    period: student.Classroom.period,
                  },
                }}
              />
            </div>
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

    const canView = [
      RoleEnum.ADM_MASTER,
      RoleEnum.ADM,
      RoleEnum.COORDINATOR,
      RoleEnum.TEACHER,
    ].includes(userObject?.role.name);

    if (canView) {
      const { data } = await axiosApi.get(`/student/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        props: {
          student: data?.student,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default SocialEducator;

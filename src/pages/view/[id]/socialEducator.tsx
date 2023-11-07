import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { validatePhone } from 'validations-br';

import { axiosApi } from '@/components/api/axiosApi';
import { InputImageThemed } from '@/components/ui/forms/InputImageThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { allPeriods, allSeries } from '@/constants/classroom';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';
import type {
  SocialEducator as SocialEducatorType,
  SocialEducatorEdit,
  SocialEducatorEditRequest,
} from '@/types/socialEducator';

const SocialEducator = ({ teacher }: { teacher: SocialEducatorType }) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SocialEducatorEdit>();

  const editSocialEducatorHandle = async (
    data: SocialEducatorEditRequest,
  ): Promise<any> => {
    return (await axiosApi.put(`/teacher/${teacher.id}`, data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'editinSocialEducatorMutation',
    editSocialEducatorHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar o Educador Social!',
        );
      },
      onSuccess: () => {
        toast.success('Educador Social editado');
      },
    },
  );

  const onSubmit = (data: SocialEducatorEdit) => {
    const { visualIdentity, name, telephone, classRooms } = data;
    const submitData = {
      visualIdentity: visualIdentity || teacher.visualIdentity,
      name: name || teacher.name,
      telephone: telephone || teacher.telephone,
      classRooms:
        classRooms?.map((classroom) => ({
          period: classroom.value.period,
          year: classroom.value.year,
        })) ||
        teacher.classrooms.map((classroom) => ({
          period: classroom.period,
          year: classroom.year,
        })),
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
            defaultValue={teacher?.visualIdentity}
          />
          <InputThemed
            register={register}
            name="telephone"
            mask="(99) 9 9999-9999"
            defaultValue={teacher.telephone}
            label="Telefone"
            validations={{
              required: 'Campo obrigatório',
              validate: (value: string) => {
                return validatePhone(value) || 'Telefone invalido';
              },
            }}
            error={errors.telephone}
          />
          <InputThemed
            register={register}
            name="name"
            defaultValue={teacher.name}
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
            defaultValue={teacher.school.name}
          />
          <InputThemed
            register={register}
            name="email"
            disabled
            defaultValue={teacher.email}
            label="Email"
          />
          <div>
            <div className="flex w-full items-center gap-[16px]">
              <SelectThemed
                isMulti
                control={control}
                reset={reset}
                name="classRooms"
                label="Turmas"
                placeholder="turmas"
                options={allPeriods
                  .map((period) =>
                    allSeries.map((serie) => ({
                      label: `${serie}º Ano - ${period}`,
                      value: { year: serie, period },
                    })),
                  )
                  .flat()}
                defaultValue={teacher.classrooms.map((item) => ({
                  label: `${item.year}º Ano - ${item.period}`,
                  value: { year: item.year, period: item.period },
                }))}
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
    ].includes(userObject?.role.name);

    if (canView) {
      const { data } = await axiosApi.get(`/teacher/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('passou');
      console.log(data.teacher);

      return {
        props: {
          teacher: data?.teacher,
        },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default SocialEducator;

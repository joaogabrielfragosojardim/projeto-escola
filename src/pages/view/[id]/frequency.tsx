import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { RoleEnum } from '@/types/roles';

const Frequency = ({ frequency }: any) => {
  const { register, handleSubmit } = useForm();
  const route = useRouter();

  const editFrequency = async (data: any) => {
    return axiosApi.put(`/attendance/${route.query.id}`, data);
  };

  const { mutate, isLoading: isLoadingMutate } = useMutation(
    'createFrequency',
    editFrequency,

    {
      onSuccess: () => {
        toast.success('frequencia editada');
        route.push('/dashboard');
      },
      onError: () => {
        toast.error('erro ao editar frequencia');
      },
    },
  );

  const onSubmit = (dataSubmit: any) => {
    mutate(dataSubmit);
  };

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const defaultDate = new Date(frequency.date);
  maxDate.setHours(maxDate.getHours() - 3);

  return (
    <SideNavMenuContainer title="Frequência">
      <div className="p-[22px] 2xl:p-[32px]">
        <p className="mb-[32px] text-[20px] font-semibold text-complement-200 2xl:text-[24px]">
          Altere a frequência do aluno
        </p>
        <div>
          <div>
            <div>
              <div className="flex items-center gap-[16px]">
                <InputThemed
                  type="date"
                  label="Data"
                  name="date"
                  register={register}
                  max={maxDate.toISOString().split('T')[0]}
                  defaultValue={defaultDate.toISOString().split('T')[0]}
                />
              </div>
              <div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-[16px] rounded border-[2px] border-main p-[22px]"
                >
                  <div>
                    <p className="text-main">Alunos:</p>
                  </div>
                  <div
                    className="flex w-full items-center justify-between border-b-[1px] border-b-complement-200 py-3"
                    key={frequency.id}
                  >
                    <div className="flex items-center gap-[16px] text-[20px]">
                      <div className="relative h-[52px] w-[52px] min-w-[52px] overflow-hidden rounded-full">
                        <Image
                          src={
                            frequency?.student.visualIdentity ||
                            '/assets/images/default-profile.png'
                          }
                          alt="foto do aluno"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-[16px] text-complement-200">
                        {frequency.student.name}
                      </p>
                    </div>
                    <InputCheckBoxThemed
                      label="Presente"
                      register={register}
                      defaultChecked={frequency.isPresent}
                      name="isPresent"
                      reverse
                    />
                  </div>
                  <div className="mt-[64px] text-[16px] lg:text-[20px]">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
                    >
                      {isLoadingMutate ? (
                        <div className="animate-spin">
                          <TbLoader size={24} />
                        </div>
                      ) : (
                        'Enviar Relatório'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
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
      const { data } = await axiosApi.get(`/attendance/${ctx?.params?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        props: { frequency: data },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default Frequency;

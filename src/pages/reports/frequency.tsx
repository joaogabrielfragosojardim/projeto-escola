import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { ClassRoomSelect } from '@/components/ui/tables/Selects/ClassrooomSelect';
import { useUser } from '@/store/user/context';
import type { Student } from '@/types/student';

const Frequency = () => {
  const { register, handleSubmit } = useForm();
  const [dateFilter, setDateFilter] = useState('');
  const [classId, setClassId] = useState('');
  const route = useRouter();
  const user = useUser();

  const fetchStudents = async () => {
    const { data } = await axiosApi.get('/student', {
      params: {
        perPage: 200,
        classId,
      },
    });
    return data;
  };

  const createFrequency = async (data: any) => {
    return axiosApi.post(`/attendance/${classId}`, {
      ...data,
      teacherId: user.id,
    });
  };

  const {
    isLoading,
    data,
    mutate: mutateStudents,
  } = useMutation('fetchStudentsFrequency', fetchStudents);

  useEffect(() => {
    if (classId) {
      mutateStudents();
    }
  }, [classId, mutateStudents]);

  const { mutate, isLoading: isLoadingMutate } = useMutation(
    'createFrequency',
    createFrequency,
    {
      onSuccess: () => {
        toast.success('frequencia cadastrada');
        route.push('/dashboard');
      },
      onError: () => {
        toast.error('erro ao cadastrar frequencia');
      },
    },
  );

  const onSubmit = (dataSubmit: any) => {
    const submitData = {
      students: Object.keys(dataSubmit.student).map((key) => ({
        id: key,
        isPresent: dataSubmit.student[key],
      })),
      date: dataSubmit.startDate,
    };
    mutate(submitData);
  };

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  return (
    <SideNavMenuContainer title="Frequência">
      <div className="p-[22px] 2xl:p-[32px]">
        <p className="mb-[32px] text-[20px] font-semibold text-complement-200 2xl:text-[24px]">
          Registre a frequência de seus alunos
        </p>
        <div>
          <div>
            <div>
              <div className="flex items-center gap-[16px]">
                <InputThemed
                  type="date"
                  label="Data"
                  name="startDate"
                  register={register}
                  max={maxDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                  }}
                />
                <div>
                  <ClassRoomSelect
                    onChange={(e) => {
                      setClassId(e.value);
                    }}
                  />
                </div>
              </div>
              <div>
                {isLoading && dateFilter && classId && (
                  <div className="flex h-[420px] w-full items-center justify-center text-main">
                    <div>
                      <div className="animate-spin">
                        <TbLoader size={62} />
                      </div>
                    </div>
                  </div>
                )}
                {classId && dateFilter && (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-[16px] rounded border-[2px] border-main p-[22px]"
                  >
                    <div>
                      <p className="text-main">Alunos:</p>
                    </div>
                    {data?.data?.map((student: Student) => (
                      <div
                        className="flex w-full items-center justify-between border-b-[1px] border-b-complement-200 py-3"
                        key={student.id}
                      >
                        <div className="flex items-center gap-[16px] text-[20px]">
                          <div className="relative h-[52px] w-[52px] min-w-[52px] overflow-hidden rounded-full">
                            <Image
                              src={
                                student?.visualIdentity ||
                                '/assets/images/default-profile.png'
                              }
                              alt="foto do aluno"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[16px] text-complement-200">
                            {student.name}
                          </p>
                        </div>
                        <InputCheckBoxThemed
                          label="Presente"
                          register={register}
                          name={`student.${student.id}`}
                          reverse
                        />
                      </div>
                    ))}
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
                )}
              </div>
            </div>
            {!!data && !data?.data.length ? (
              <div className="p-[44px]">
                <div className="relative mx-auto h-[370px] w-[313px]">
                  <Image
                    src="/assets/images/without-students.png"
                    alt="imagem dizendo que até agora estamos sem estudantes"
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="text-center text-[22px] text-main">
                  <p>Nenhum estudante encontrado!</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SideNavMenuContainer>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { token } = nookies.get(ctx);
  const secret = process.env.SECRET_KEY || '';
  try {
    verify(token || '', secret);

    return {
      props: {},
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};

export default Frequency;

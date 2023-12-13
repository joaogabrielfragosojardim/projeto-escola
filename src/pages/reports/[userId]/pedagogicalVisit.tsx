import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import router from 'next/router';
import nookies from 'nookies';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SelectThemed } from '@/components/ui/forms/SelectThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { useUser } from '@/store/user/context';
import {
  PedagogicalVisitEnumLabels,
  PedagogicalVisitEnumQuestions,
} from '@/types/pedagogicalVisit';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const PedagogicalVisit = ({
  classrooms,
}: {
  classrooms: { label: string; value: string }[];
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<
    Record<PedagogicalVisitEnumQuestions | string, boolean | string>
  >();
  const user = useUser();

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const createPedagogicalVisit = async (data: any): Promise<any> => {
    return (await axiosApi.post('/pedagogicalVisit', data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'createPedagogicalVisit',
    createPedagogicalVisit,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao fazer a visita pedagogica!',
        );
      },
      onSuccess: () => {
        toast.success('Visita pedagogica feita');
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: any) => {
    const formatedData = {
      date: data.date,
      frequency: parseInt(data.frequency as string, 10),
      observations: data[PedagogicalVisitEnumQuestions.observations],
      coordiantorId: user.id,
      questions: { ...data },
      classId: data.classroom.value,
      coordinatorId: user.id,
    };

    mutate(formatedData);
  };

  return (
    <SideNavMenuContainer title="Visita Pedagógica">
      <div className="p-[32px] text-complement-200">
        <form
          className="flex max-w-[875px] flex-col gap-[22px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <h3 className="text-[22px]">Aspectos organizacionais</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={PedagogicalVisitEnumQuestions.oAmbienteEAlfabetizador}
                label={PedagogicalVisitEnumLabels.oAmbienteEAlfabetizador}
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oEducadorCirculaPelaSalaDeAula
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorCirculaPelaSalaDeAula
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades
                }
                label={
                  PedagogicalVisitEnumLabels.oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">
              Processos e estratégias de ensino de aprendizagem
            </h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.osObjetivosDaAulaSaoInformadosAosEstudantes
                }
                label={
                  PedagogicalVisitEnumLabels.osObjetivosDaAulaSaoInformadosAosEstudantes
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante
                }
                label={
                  PedagogicalVisitEnumLabels.ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada
                }
                label={
                  PedagogicalVisitEnumLabels.osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oEducadorSegueARotinaPropostaParaAAulaPeloProjeto
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorSegueARotinaPropostaParaAAulaPeloProjeto
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Interação do estudante na aula</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.aMaioriaDosEstudantesParticipamDaAula
                }
                label={
                  PedagogicalVisitEnumLabels.aMaioriaDosEstudantesParticipamDaAula
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">
              Plano de aula e estratégia de ensino
            </h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={
                  PedagogicalVisitEnumQuestions.oPlanoDeAulaContemplaOsObjetivosDaAula
                }
                label={
                  PedagogicalVisitEnumLabels.oPlanoDeAulaContemplaOsObjetivosDaAula
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Rotina de alfabetização</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={PedagogicalVisitEnumQuestions.leitura}
                label={PedagogicalVisitEnumLabels.leitura}
              />
              <InputCheckBoxThemed
                register={register}
                name={PedagogicalVisitEnumQuestions.escrita}
                label={PedagogicalVisitEnumLabels.escrita}
              />
              <InputCheckBoxThemed
                register={register}
                name={PedagogicalVisitEnumQuestions.atividadesDiferenciadas}
                label={PedagogicalVisitEnumLabels.atividadesDiferenciadas}
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Frequência</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputThemed
                register={register}
                type="number"
                defaultValue={1}
                name={PedagogicalVisitEnumQuestions.frequency}
                label={PedagogicalVisitEnumLabels.frequency}
                validations={{
                  required: 'Campo Obrigatório',
                  min: { value: 1, message: 'Valor inválido' },
                }}
                error={errors.frequency}
              />
            </div>
          </div>
          <InputThemed
            register={register}
            placeholder="Observações..."
            name={PedagogicalVisitEnumQuestions.observations}
            label={PedagogicalVisitEnumLabels.observations}
          />
          <SelectThemed
            control={control}
            reset={reset}
            placeholder="Turma..."
            options={classrooms}
            name="classroom"
            label="Turma"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.classroom}
          />
          <InputThemed
            register={register}
            name="date"
            label="Data"
            type="date"
            max={maxDate.toISOString().split('T')[0]}
            validations={{ required: 'Campo obrigatório' }}
            error={errors.date}
          />
          <div className="mt-[22px] text-[16px] lg:text-[20px]">
            <button
              type="submit"
              className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <TbLoader />
                </div>
              ) : (
                'Enviar Relatório'
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

    const canView = [RoleEnum.COORDINATOR].includes(userObject?.role.name);
    console.log(canView)
    if (canView) {
      const { data } = await axiosApi.get(`/teacher/${ctx?.params?.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const classrooms = data?.teacher?.classrooms.map(
        (item: { id: string; year: number; period: number }) => ({
          value: item.id,
          label: `${item.year}º ano - ${item.period}`,
        }),
      );

      return {
        props: { classrooms },
      };
    }
    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default PedagogicalVisit;

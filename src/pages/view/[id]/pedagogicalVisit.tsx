import html2canvas from 'html2canvas';
import { verify } from 'jsonwebtoken';
import JSPDF from 'jspdf';
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
import { classrooms } from '@/constants/classroom';
import type { GetOnePedagogicalVisit } from '@/types/pedagogicalVisit';
import {
  PedagogicalVisitEnumLabels,
  PedagogicalVisitEnumQuestions,
} from '@/types/pedagogicalVisit';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const PedagogicalVisit = ({
  pedagogicalVisit,
}: {
  pedagogicalVisit: GetOnePedagogicalVisit;
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

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  const downloadPDF = () => {
    const element = document.getElementById('pageContent'); // Replace 'pageContent' with the ID of the div holding your page content
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('img/png');
        const doc = new JSPDF('p', 'mm', 'a4');
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'PNG', 0, 0, width, height);
        doc.save('relatorio.pdf');
      });
    }
  };

  const editPedagogicalVisit = async (data: any): Promise<any> => {
    return (
      await axiosApi.put(`/pedagogicalVisit/${pedagogicalVisit.id}`, data)
    ).data;
  };

  const { isLoading, mutate } = useMutation(
    'editPedagogicalVisit',
    editPedagogicalVisit,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar a visita pedagógica!',
        );
      },
      onSuccess: () => {
        toast.success('Visita pedagógica Editada');
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: any) => {
    const formatedData = {
      date: data.date,
      frequency: parseInt(data.frequency as string, 10),
      observations: data[PedagogicalVisitEnumQuestions.observations],
      questions: { ...data },
    };

    mutate(formatedData);
  };

  return (
    <SideNavMenuContainer title="Visita Pedagógica">
      <div className="p-[32px] text-complement-200" id="pageContent">
        <form
          className="flex max-w-[875px] flex-col gap-[22px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputThemed
            register={register}
            name="teacher"
            label="Educador Social"
            disabled
            defaultValue={pedagogicalVisit.Classroom.teacher.user.name}
          />
          <InputThemed
            register={register}
            name="coordinator"
            label="Coordenador"
            disabled
            defaultValue={pedagogicalVisit.Coordinator.user.name}
          />
          <InputThemed
            register={register}
            name="school"
            label="Escola"
            disabled
            defaultValue={pedagogicalVisit.School.name}
          />
          <SelectThemed
            control={control}
            reset={reset}
            placeholder="Turma..."
            options={classrooms}
            name="classroom"
            label="Turma"
            isDisabled
            defaultValue={{
              label: `${pedagogicalVisit.Classroom.year}º Ano - ${pedagogicalVisit.Classroom.period}`,
              value: {
                series: pedagogicalVisit.Classroom.year,
                period: pedagogicalVisit.Classroom.period,
              },
            }}
            validations={{ required: 'Campo obrigatório' }}
            error={errors.classroom}
          />
          <div>
            <h3 className="text-[22px]">Aspectos organizacionais</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.oAmbienteEAlfabetizador
                  ]
                }
                register={register}
                name={PedagogicalVisitEnumQuestions.oAmbienteEAlfabetizador}
                label={PedagogicalVisitEnumLabels.oAmbienteEAlfabetizador}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.oEducadorCirculaPelaSalaDeAula
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.oEducadorCirculaPelaSalaDeAula
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorCirculaPelaSalaDeAula
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .oRitmosDasOrientacoesEAdequadoParaAtenderAosEstudantesQueApresentamMaisDificuldades
                  ]
                }
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
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorDemonstraDominioDoConteudoEDasHabilidadesPropostas
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .osObjetivosDaAulaSaoInformadosAosEstudantes
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.osObjetivosDaAulaSaoInformadosAosEstudantes
                }
                label={
                  PedagogicalVisitEnumLabels.osObjetivosDaAulaSaoInformadosAosEstudantes
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante
                }
                label={
                  PedagogicalVisitEnumLabels.ocorreAContextualizacaoEntreOConteudoEAsVivenciasDoEstudante
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada
                }
                label={
                  PedagogicalVisitEnumLabels.osEstudantesqueApresentamMaioresDificuldadesRecebemAtencaoDiferenciada
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto
                  ]
                }
                name={
                  PedagogicalVisitEnumQuestions.oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto
                }
                label={
                  PedagogicalVisitEnumLabels.oEducadorObservaAFormaDeRegistroDoEstudanteEConduzAAulaNoSentidoDeAlcancarOObjetivoProposto
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .oEducadorSegueARotinaPropostaParaAAulaPeloProjeto
                  ]
                }
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
            <h3 className="text-[22px]">Alfabetização em Matemática</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .aMaioriaDosEstudantesParticipamDaAula
                  ]
                }
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
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions
                      .oPlanoDeAulaContemplaOsObjetivosDaAula
                  ]
                }
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
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.leitura
                  ]
                }
                register={register}
                name={PedagogicalVisitEnumQuestions.leitura}
                label={PedagogicalVisitEnumLabels.leitura}
              />
              <InputCheckBoxThemed
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.escrita
                  ]
                }
                register={register}
                name={PedagogicalVisitEnumQuestions.escrita}
                label={PedagogicalVisitEnumLabels.escrita}
              />
              <InputCheckBoxThemed
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.atividadesDiferenciadas
                  ]
                }
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
                defaultChecked={
                  pedagogicalVisit.questions[
                    PedagogicalVisitEnumQuestions.frequency
                  ]
                }
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
            defaultChecked={
              pedagogicalVisit.questions[
                PedagogicalVisitEnumQuestions.observations
              ]
            }
            defaultValue={pedagogicalVisit.observations}
            name={PedagogicalVisitEnumQuestions.observations}
            label={PedagogicalVisitEnumLabels.observations}
          />
          <InputThemed
            register={register}
            name="date"
            label="Data"
            type="date"
            max={maxDate.toISOString().split('T')[0]}
            defaultValue={
              new Date(pedagogicalVisit.date).toISOString().split('T')[0]
            }
          />
          <div className="mt-[22px] flex gap-[8px] text-[16px] lg:text-[20px]">
            <button
              type="submit"
              className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <TbLoader />
                </div>
              ) : (
                'Editar Relatório'
              )}
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
              onClick={downloadPDF}
            >
              Baixar PDF
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
      RoleEnum.ADM,
      RoleEnum.ADM_MASTER,
      RoleEnum.COORDINATOR,
    ].includes(userObject?.role.name);
    if (canView) {
      const { data } = await axiosApi.get(
        `/pedagogicalVisit/${ctx?.params?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return {
        props: { pedagogicalVisit: data?.pedagogicalVisit },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default PedagogicalVisit;

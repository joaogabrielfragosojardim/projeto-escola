import html2canvas from 'html2canvas';
import { verify } from 'jsonwebtoken';
import JSPDF from 'jspdf';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import type { LearningMonitoringEdit } from '@/types/learningMonitoring';
import {
  LearningMonitoringLabelsEnum,
  LearningMonitoringValuesEnum,
} from '@/types/learningMonitoring';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const LearningMonitoring = ({
  learningMonitoring,
}: {
  learningMonitoring: LearningMonitoringEdit;
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const downloadPDF = () => {
    const element = document.getElementById('pageContent');
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

  const editLearningMonitoring = async (data: any): Promise<any> => {
    return (await axiosApi.put(`/learningMonitoring/${router.query.id}`, data))
      .data;
  };

  const { mutate } = useMutation(
    'editLearningMonitoring',
    editLearningMonitoring,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao editar o acompanhamento de aprendizagem!',
        );
      },
      onSuccess: () => {
        toast.success('Acompanhamento de aprendizagem editado!');
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: any) => {
    const formatedData = {
      writingLevel: data.writingLevel,
      questions: { ...data },
      studentId: router.query.id,
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
          <div>
            <InputThemed
              register={register}
              name="student"
              label="Aluno"
              disabled
              defaultValue={learningMonitoring.student.name}
            />
          </div>
          <div>
            <InputThemed
              register={register}
              name="classroom"
              label="Turma"
              disabled
              defaultValue={`${learningMonitoring.classroom.year}º Ano - ${learningMonitoring.classroom.period}`}
            />
          </div>
          <div>
            <h3 className="text-[22px]">Observação direta da sala de aula</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .persisteDiandteDeSuasDificuldades
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.persisteDiandteDeSuasDificuldades
                }
                label={
                  LearningMonitoringLabelsEnum.persisteDiandteDeSuasDificuldades
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .acompanhaAsLeiturasIndividualEColetiva
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.acompanhaAsLeiturasIndividualEColetiva
                }
                label={
                  LearningMonitoringLabelsEnum.acompanhaAsLeiturasIndividualEColetiva
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .realizaAtividadesEAcompanhanhaACorrecao
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.realizaAtividadesEAcompanhanhaACorrecao
                }
                label={
                  LearningMonitoringLabelsEnum.realizaAtividadesEAcompanhanhaACorrecao
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .participaDasAtividadesIndividuaisEOuColetivas
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.participaDasAtividadesIndividuaisEOuColetivas
                }
                label={
                  LearningMonitoringLabelsEnum.participaDasAtividadesIndividuaisEOuColetivas
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.relacionaseBemComOsOutros
                  ]
                }
                name={LearningMonitoringValuesEnum.relacionaseBemComOsOutros}
                label={LearningMonitoringLabelsEnum.relacionaseBemComOsOutros}
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Alfabetização em língua portuguesa</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .reconheceEEscreveAsLetrasDoAlfabeto
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.reconheceEEscreveAsLetrasDoAlfabeto
                }
                label={
                  LearningMonitoringLabelsEnum.reconheceEEscreveAsLetrasDoAlfabeto
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.identificaAsVogaisEConsoantes
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaAsVogaisEConsoantes
                }
                label={
                  LearningMonitoringLabelsEnum.identificaAsVogaisEConsoantes
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.escreveSeuNome
                  ]
                }
                name={LearningMonitoringValuesEnum.escreveSeuNome}
                label={LearningMonitoringLabelsEnum.escreveSeuNome}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .identificaDiferentesTiposDeLetraManuscriteOuImprensa
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaDiferentesTiposDeLetraManuscriteOuImprensa
                }
                label={
                  LearningMonitoringLabelsEnum.identificaDiferentesTiposDeLetraManuscriteOuImprensa
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .aoOuvirAsPalavrasConsegueIdentificarSonsoESilabasQueAsCompoem
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.aoOuvirAsPalavrasConsegueIdentificarSonsoESilabasQueAsCompoem
                }
                label={
                  LearningMonitoringLabelsEnum.aoOuvirAsPalavrasConsegueIdentificarSonsoESilabasQueAsCompoem
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .lePalavrasComFluenciaOuSilabando
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.lePalavrasComFluenciaOuSilabando
                }
                label={
                  LearningMonitoringLabelsEnum.lePalavrasComFluenciaOuSilabando
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leFrasesComFluenciaOuSilabando
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.leFrasesComFluenciaOuSilabando
                }
                label={
                  LearningMonitoringLabelsEnum.leFrasesComFluenciaOuSilabando
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leTextosComAutonomia
                  ]
                }
                name={LearningMonitoringValuesEnum.leTextosComAutonomia}
                label={LearningMonitoringLabelsEnum.leTextosComAutonomia}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .identificaQuantasLetrasHaNumaPalavra
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaQuantasLetrasHaNumaPalavra
                }
                label={
                  LearningMonitoringLabelsEnum.identificaQuantasLetrasHaNumaPalavra
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .aoOuvirAsPalavrasIdentificaQuantasSilabas
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.aoOuvirAsPalavrasIdentificaQuantasSilabas
                }
                label={
                  LearningMonitoringLabelsEnum.aoOuvirAsPalavrasIdentificaQuantasSilabas
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.compreendeTextosLidosEmVozAlta
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.compreendeTextosLidosEmVozAlta
                }
                label={
                  LearningMonitoringLabelsEnum.compreendeTextosLidosEmVozAlta
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.retiraInformacoesDosTextosQueLe
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.retiraInformacoesDosTextosQueLe
                }
                label={
                  LearningMonitoringLabelsEnum.retiraInformacoesDosTextosQueLe
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.conheceVariosTiposDeTextos
                  ]
                }
                name={LearningMonitoringValuesEnum.conheceVariosTiposDeTextos}
                label={LearningMonitoringLabelsEnum.conheceVariosTiposDeTextos}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.escreveSentencas
                  ]
                }
                name={LearningMonitoringValuesEnum.escreveSentencas}
                label={LearningMonitoringLabelsEnum.escreveSentencas}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.compreendeOQueLeComAutonomia
                  ]
                }
                name={LearningMonitoringValuesEnum.compreendeOQueLeComAutonomia}
                label={
                  LearningMonitoringLabelsEnum.compreendeOQueLeComAutonomia
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Interação do estudante na aula</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.compreendeOValorAbsoluto
                  ]
                }
                name={LearningMonitoringValuesEnum.compreendeOValorAbsoluto}
                label={LearningMonitoringLabelsEnum.compreendeOValorAbsoluto}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.compreendeOValorRelativo
                  ]
                }
                name={LearningMonitoringValuesEnum.compreendeOValorRelativo}
                label={LearningMonitoringLabelsEnum.compreendeOValorRelativo}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.escreveNumerosPorExtenso
                  ]
                }
                name={LearningMonitoringValuesEnum.escreveNumerosPorExtenso}
                label={LearningMonitoringLabelsEnum.escreveNumerosPorExtenso}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.escreveNumerosPorOrdem
                  ]
                }
                name={LearningMonitoringValuesEnum.escreveNumerosPorOrdem}
                label={LearningMonitoringLabelsEnum.escreveNumerosPorOrdem}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.calculaAdicoesESubtracoes
                  ]
                }
                name={LearningMonitoringValuesEnum.calculaAdicoesESubtracoes}
                label={LearningMonitoringLabelsEnum.calculaAdicoesESubtracoes}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.resolveSituacoesComAsQuatro
                  ]
                }
                name={LearningMonitoringValuesEnum.resolveSituacoesComAsQuatro}
                label={
                  LearningMonitoringLabelsEnum.calculaMultiplicacoesEDivisoes
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.utilizaCorretamenteOsSinas
                  ]
                }
                name={LearningMonitoringValuesEnum.utilizaCorretamenteOsSinas}
                label={LearningMonitoringLabelsEnum.utilizaCorretamenteOsSinas}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.resolveSituacoesComAsQuatro
                  ]
                }
                name={LearningMonitoringValuesEnum.resolveSituacoesComAsQuatro}
                label={LearningMonitoringLabelsEnum.resolveSituacoesComAsQuatro}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.identificaNumeros
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaNumeros}
                label={LearningMonitoringLabelsEnum.identificaNumeros}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.identificaFigurasGeometricas
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaFigurasGeometricas}
                label={
                  LearningMonitoringLabelsEnum.identificaFigurasGeometricas
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.identificaAsMedidas
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaAsMedidas}
                label={LearningMonitoringLabelsEnum.identificaAsMedidas}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leTabelasEGraficos
                  ]
                }
                name={LearningMonitoringValuesEnum.leTabelasEGraficos}
                label={LearningMonitoringLabelsEnum.leTabelasEGraficos}
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">
              Nivel de sistema de escrita alfabética - SEA
            </h3>
            <div className="mt-[16px]">
              <div>
                <label htmlFor={LearningMonitoringValuesEnum.preSilabico}>
                  <input
                    {...register('writingLevel', {
                      required: 'Campo obrigatório',
                    })}
                    type="radio"
                    value={LearningMonitoringLabelsEnum.preSilabico}
                    id={LearningMonitoringValuesEnum.preSilabico}
                    defaultChecked={
                      learningMonitoring.writingLevel ===
                      LearningMonitoringLabelsEnum.preSilabico
                    }
                    className="mr-[8px]"
                  />
                  {LearningMonitoringLabelsEnum.preSilabico}
                </label>
              </div>
              <div>
                <label htmlFor={LearningMonitoringValuesEnum.silabico}>
                  <input
                    {...register('writingLevel', {
                      required: 'Campo obrigatório',
                    })}
                    type="radio"
                    value={LearningMonitoringLabelsEnum.silabico}
                    id={LearningMonitoringValuesEnum.silabico}
                    defaultChecked={
                      learningMonitoring.writingLevel ===
                      LearningMonitoringLabelsEnum.silabico
                    }
                    className="mr-[8px]"
                  />
                  {LearningMonitoringLabelsEnum.silabico}
                </label>
              </div>
              <div>
                <label
                  htmlFor={LearningMonitoringValuesEnum.silabicoAlfabético}
                >
                  <input
                    {...register('writingLevel', {
                      required: 'Campo obrigatório',
                    })}
                    type="radio"
                    value={LearningMonitoringLabelsEnum.silabicoAlfabético}
                    id={LearningMonitoringValuesEnum.silabicoAlfabético}
                    defaultChecked={
                      learningMonitoring.writingLevel ===
                      LearningMonitoringLabelsEnum.silabicoAlfabético
                    }
                    className="mr-[8px]"
                  />
                  {LearningMonitoringLabelsEnum.silabicoAlfabético}
                </label>
              </div>
              <div>
                <label htmlFor={LearningMonitoringValuesEnum.alfabetico}>
                  <input
                    {...register('writingLevel', {
                      required: 'Campo obrigatório',
                    })}
                    type="radio"
                    value={LearningMonitoringLabelsEnum.alfabetico}
                    id={LearningMonitoringValuesEnum.alfabetico}
                    defaultChecked={
                      learningMonitoring.writingLevel ===
                      LearningMonitoringLabelsEnum.alfabetico
                    }
                    className="mr-[8px]"
                  />
                  {LearningMonitoringLabelsEnum.alfabetico}
                </label>
              </div>
              {errors.writingLevel && (
                <div className="mt-[8px] text-wrong">
                  {errors.writingLevel.message as string}
                </div>
              )}
            </div>
          </div>
          <div className="mt-[22px] flex gap-[8px] text-[16px] lg:text-[20px]">
            <button
              type="submit"
              className="flex items-center justify-center gap-[16px] rounded-[5px] bg-main px-[62px] py-[8px] text-complement-100"
            >
              Editar Relatório
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
      RoleEnum.TEACHER,
    ].includes(userObject?.role.name);
    if (canView) {
      const { data } = await axiosApi.get(
        `/learningMonitoring/${ctx?.params?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return {
        props: { learningMonitoring: data },
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default LearningMonitoring;

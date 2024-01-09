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

  const maxDate = new Date();
  maxDate.setHours(maxDate.getHours() - 3);

  return (
    <SideNavMenuContainer title="Acompanhamento de Aprendizagem">
      <div className="p-[32px] text-complement-200" id="pageContent">
        <form
          className="flex max-w-[875px] flex-col gap-[22px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <InputThemed
              register={register}
              name="date"
              label="Data"
              type="date"
              max={maxDate.toISOString().split('T')[0]}
              defaultValue={
                new Date(learningMonitoring.createdAt)
                  .toISOString()
                  .split('T')[0]
              }
              disabled
            />
          </div>
          <div>
            <InputThemed
              register={register}
              name="teacher"
              label="Educador Social"
              disabled
              defaultValue={learningMonitoring.teacher.user.name}
            />
          </div>
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
              name="registration"
              label="Matrícula"
              disabled
              defaultValue={learningMonitoring.student.registration}
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
                    LearningMonitoringValuesEnum.identificaAsVogais
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaAsVogais}
                label={LearningMonitoringLabelsEnum.identificaAsVogais}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.identificaAsConsoantes
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaAsConsoantes}
                label={LearningMonitoringLabelsEnum.identificaAsConsoantes}
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
                      .aoOuvirUmaPalavraIdentificaQuantasSilabasHa
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.aoOuvirUmaPalavraIdentificaQuantasSilabasHa
                }
                label={
                  LearningMonitoringLabelsEnum.aoOuvirUmaPalavraIdentificaQuantasSilabasHa
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.lePalavrasComAutonomia
                  ]
                }
                name={LearningMonitoringValuesEnum.lePalavrasComAutonomia}
                label={LearningMonitoringLabelsEnum.lePalavrasComAutonomia}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leFrasesComFluencia
                  ]
                }
                name={LearningMonitoringValuesEnum.leFrasesComFluencia}
                label={LearningMonitoringLabelsEnum.leFrasesComFluencia}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leTextosComFluencia
                  ]
                }
                name={LearningMonitoringValuesEnum.leTextosComFluencia}
                label={LearningMonitoringLabelsEnum.leTextosComFluencia}
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .IdentificaOsDiferenetesGenerosTextuais
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.IdentificaOsDiferenetesGenerosTextuais
                }
                label={
                  LearningMonitoringLabelsEnum.IdentificaOsDiferenetesGenerosTextuais
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.escreveFrasesDeFormaCondicional
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.escreveFrasesDeFormaCondicional
                }
                label={
                  LearningMonitoringLabelsEnum.escreveFrasesDeFormaCondicional
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .escreveTextosDeFormaLegivelECoerente
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.escreveTextosDeFormaLegivelECoerente
                }
                label={
                  LearningMonitoringLabelsEnum.escreveTextosDeFormaLegivelECoerente
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .compreendeInformacoesExplicitasDoTextoQueLe
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.compreendeInformacoesExplicitasDoTextoQueLe
                }
                label={
                  LearningMonitoringLabelsEnum.compreendeInformacoesExplicitasDoTextoQueLe
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .identificaOAssuntoPirncipalDeUmTexto
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaOAssuntoPirncipalDeUmTexto
                }
                label={
                  LearningMonitoringLabelsEnum.identificaOAssuntoPirncipalDeUmTexto
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.solcitaInformacoesComCorencia
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.solcitaInformacoesComCorencia
                }
                label={
                  LearningMonitoringLabelsEnum.solcitaInformacoesComCorencia
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .relataVivenciasOuExpressaOpinioes
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.relataVivenciasOuExpressaOpinioes
                }
                label={
                  LearningMonitoringLabelsEnum.relataVivenciasOuExpressaOpinioes
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
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .compreendeOValorAbsolutoDosAlgarismos
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.compreendeOValorAbsolutoDosAlgarismos
                }
                label={
                  LearningMonitoringLabelsEnum.compreendeOValorAbsolutoDosAlgarismos
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .compreendeOValorRleativoDosAlgarismosEmDeterminadosNumeros
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.compreendeOValorRleativoDosAlgarismosEmDeterminadosNumeros
                }
                label={
                  LearningMonitoringLabelsEnum.compreendeOValorRleativoDosAlgarismosEmDeterminadosNumeros
                }
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
                    LearningMonitoringValuesEnum
                      .resolveSituacoesProblemaDeAdicaoESubtracao
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.resolveSituacoesProblemaDeAdicaoESubtracao
                }
                label={
                  LearningMonitoringLabelsEnum.resolveSituacoesProblemaDeAdicaoESubtracao
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .resolveSituacoesProblemaDeMultiplicacaoEDivisao
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.resolveSituacoesProblemaDeMultiplicacaoEDivisao
                }
                label={
                  LearningMonitoringLabelsEnum.resolveSituacoesProblemaDeMultiplicacaoEDivisao
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .identificaNumerosOuElementosAusentesNumaSequenciaMatematica
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaNumerosOuElementosAusentesNumaSequenciaMatematica
                }
                label={
                  LearningMonitoringLabelsEnum.identificaNumerosOuElementosAusentesNumaSequenciaMatematica
                }
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
                    LearningMonitoringValuesEnum.identificaSolidosGeometricos
                  ]
                }
                name={LearningMonitoringValuesEnum.identificaSolidosGeometricos}
                label={
                  LearningMonitoringLabelsEnum.identificaSolidosGeometricos
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .identificaAsMedidasDeCadaGrandeza
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.identificaAsMedidasDeCadaGrandeza
                }
                label={
                  LearningMonitoringLabelsEnum.identificaAsMedidasDeCadaGrandeza
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum
                      .reconheceOSistemaMonetarioBrasileiro
                  ]
                }
                name={
                  LearningMonitoringValuesEnum.reconheceOSistemaMonetarioBrasileiro
                }
                label={
                  LearningMonitoringLabelsEnum.reconheceOSistemaMonetarioBrasileiro
                }
              />
              <InputCheckBoxThemed
                register={register}
                defaultChecked={
                  learningMonitoring.questions[
                    LearningMonitoringValuesEnum.leTableasEGraficos
                  ]
                }
                name={LearningMonitoringValuesEnum.leTableasEGraficos}
                label={LearningMonitoringLabelsEnum.leTableasEGraficos}
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

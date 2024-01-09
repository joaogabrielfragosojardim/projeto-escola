import { verify } from 'jsonwebtoken';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';
import { useUser } from '@/store/user/context';
import {
  LearningMonitoringLabelsEnum,
  LearningMonitoringValuesEnum,
} from '@/types/learningMonitoring';
import type { PrismaError } from '@/types/prismaError';
import { RoleEnum } from '@/types/roles';

const LearningMonitoring = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const user = useUser();

  const createLearningMonitoring = async (data: any): Promise<any> => {
    return (await axiosApi.post('/learningMonitoring', data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'createLearningMonitoring',
    createLearningMonitoring,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error?.response?.data?.message ||
            'Algo deu errado ao fazer o acompanhamento de aprendizagem!',
        );
      },
      onSuccess: () => {
        toast.success('Acompanhamento de aprendizagem feito!');
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: any) => {
    const formatedData = {
      teacherId: user.id,
      writingLevel: data.writingLevel,
      questions: { ...data },
      studentId: router.query.userId,
    };

    mutate(formatedData);
  };

  return (
    <SideNavMenuContainer title="Acompanhamento de Aprendizagem">
      <div className="p-[32px] text-complement-200">
        <form
          className="flex max-w-[875px] flex-col gap-[22px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <h3 className="text-[22px]">Observação direta da sala de aula</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.persisteDiandteDeSuasDificuldades
                }
                label={
                  LearningMonitoringLabelsEnum.persisteDiandteDeSuasDificuldades
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.acompanhaAsLeiturasIndividualEColetiva
                }
                label={
                  LearningMonitoringLabelsEnum.acompanhaAsLeiturasIndividualEColetiva
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.realizaAtividadesEAcompanhanhaACorrecao
                }
                label={
                  LearningMonitoringLabelsEnum.realizaAtividadesEAcompanhanhaACorrecao
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.participaDasAtividadesIndividuaisEOuColetivas
                }
                label={
                  LearningMonitoringLabelsEnum.participaDasAtividadesIndividuaisEOuColetivas
                }
              />
              <InputCheckBoxThemed
                register={register}
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
                name={
                  LearningMonitoringValuesEnum.reconheceEEscreveAsLetrasDoAlfabeto
                }
                label={
                  LearningMonitoringLabelsEnum.reconheceEEscreveAsLetrasDoAlfabeto
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.identificaAsVogaisEConsoantes
                }
                label={
                  LearningMonitoringLabelsEnum.identificaAsVogaisEConsoantes
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.escreveSeuNome}
                label={LearningMonitoringLabelsEnum.escreveSeuNome}
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.identificaDiferentesTiposDeLetraManuscriteOuImprensa
                }
                label={
                  LearningMonitoringLabelsEnum.identificaDiferentesTiposDeLetraManuscriteOuImprensa
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.aoOuvirAsPalavrasConsegueIdentificarSonsoESilabasQueAsCompoem
                }
                label={
                  LearningMonitoringLabelsEnum.aoOuvirAsPalavrasConsegueIdentificarSonsoESilabasQueAsCompoem
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.lePalavrasComFluenciaOuSilabando
                }
                label={
                  LearningMonitoringLabelsEnum.lePalavrasComFluenciaOuSilabando
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.leFrasesComFluenciaOuSilabando
                }
                label={
                  LearningMonitoringLabelsEnum.leFrasesComFluenciaOuSilabando
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.leTextosComAutonomia}
                label={LearningMonitoringLabelsEnum.leTextosComAutonomia}
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.identificaQuantasLetrasHaNumaPalavra
                }
                label={
                  LearningMonitoringLabelsEnum.identificaQuantasLetrasHaNumaPalavra
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.aoOuvirAsPalavrasIdentificaQuantasSilabas
                }
                label={
                  LearningMonitoringLabelsEnum.aoOuvirAsPalavrasIdentificaQuantasSilabas
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.compreendeTextosLidosEmVozAlta
                }
                label={
                  LearningMonitoringLabelsEnum.compreendeTextosLidosEmVozAlta
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.retiraInformacoesDosTextosQueLe
                }
                label={
                  LearningMonitoringLabelsEnum.retiraInformacoesDosTextosQueLe
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.conheceVariosTiposDeTextos}
                label={LearningMonitoringLabelsEnum.conheceVariosTiposDeTextos}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.escreveSentencas}
                label={LearningMonitoringLabelsEnum.escreveSentencas}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.compreendeOQueLeComAutonomia}
                label={
                  LearningMonitoringLabelsEnum.compreendeOQueLeComAutonomia
                }
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Alfabetização em Matemática</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.compreendeOValorAbsoluto}
                label={LearningMonitoringLabelsEnum.compreendeOValorAbsoluto}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.compreendeOValorRelativo}
                label={LearningMonitoringLabelsEnum.compreendeOValorRelativo}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.escreveNumerosPorExtenso}
                label={LearningMonitoringLabelsEnum.escreveNumerosPorExtenso}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.escreveNumerosPorOrdem}
                label={LearningMonitoringLabelsEnum.escreveNumerosPorOrdem}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.calculaAdicoesESubtracoes}
                label={LearningMonitoringLabelsEnum.calculaAdicoesESubtracoes}
              />
              <InputCheckBoxThemed
                register={register}
                name={
                  LearningMonitoringValuesEnum.calculaMultiplicacoesEDivisoes
                }
                label={
                  LearningMonitoringLabelsEnum.calculaMultiplicacoesEDivisoes
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.utilizaCorretamenteOsSinas}
                label={LearningMonitoringLabelsEnum.utilizaCorretamenteOsSinas}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.resolveSituacoesComAsQuatro}
                label={LearningMonitoringLabelsEnum.resolveSituacoesComAsQuatro}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.identificaNumeros}
                label={LearningMonitoringLabelsEnum.identificaNumeros}
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.identificaFigurasGeometricas}
                label={
                  LearningMonitoringLabelsEnum.identificaFigurasGeometricas
                }
              />
              <InputCheckBoxThemed
                register={register}
                name={LearningMonitoringValuesEnum.identificaAsMedidas}
                label={LearningMonitoringLabelsEnum.identificaAsMedidas}
              />
              <InputCheckBoxThemed
                register={register}
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

    const canView = [RoleEnum.TEACHER].includes(userObject?.role.name);
    if (canView) {
      return {
        props: {},
      };
    }

    return { redirect: { permanent: false, destination: '/login' } };
  } catch (error) {
    return { redirect: { permanent: false, destination: '/login' } };
  }
};

export default LearningMonitoring;

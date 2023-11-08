import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { phoneSite } from '@/constants/contacts';
import { useWindowSize } from '@/hooks/useWindowSize';

const partners = [
  '/assets/images/fonte-cultural.png',
  '/assets/images/fadurpe.png',
  '/assets/images/abdesm.png',
  '/assets/images/parceiros-acosta.png',
];

export const Hero = () => {
  return (
    <>
      <div className="hidden xl:block">
        <Swiper navigation modules={[Navigation]}>
          <SwiperSlide>
            <div className="bg-[url('/assets/images/hero-image.png')] bg-right bg-no-repeat p-[24px]">
              <div className="mx-auto max-w-[1194px]">
                <div className="relative h-[55px] w-[155px]">
                  <Image
                    src="/assets/images/educar-para-libertar-logo.png"
                    fill
                    alt="Logo educar para libertar"
                  />
                </div>
                <div className="my-[32px] max-w-[561px] text-[16px] text-complement-200">
                  <p className="text-justify">
                    Em 2020, durante o início da pandemia, um grupo de
                    profissionais da educação, incluindo as professoras Ana
                    Márcia de Sousa e Ana Flávia Vieira Rolim, juntamente com o
                    professor Camilo Cazé, iniciou uma reflexão sobre as
                    mudanças de paradigma que estavam ocorrendo na educação
                    pública brasileira devido ao contexto da pandemia.
                    <br />
                    <br />O desafio que nos preocupava era como lidar com os
                    problemas preexistentes na educação pública, agravados pela
                    pandemia. Sentíamos a necessidade de colaborar com o governo
                    para enfrentar as dificuldades decorrentes do distanciamento
                    social, incluindo a regressão da aprendizagem e as questões
                    socioemocionais.
                  </p>
                </div>
                <Link
                  href={phoneSite}
                  target="_blank"
                  className="rounded bg-main px-[32px] py-[8px] text-complement-100"
                >
                  Fale Conosco
                </Link>
                <div className="mt-[32px] font-serif text-main">
                  <p className="font-serif text-[16px] text-main">
                    Nossos Parceiros:
                  </p>
                  <div className="ml-[-18px] mt-[24px] flex">
                    {partners.map((partner) => (
                      <div
                        className="relative h-[40px] w-[152px]"
                        key={partner}
                      >
                        <Image
                          src={partner}
                          alt="logo parceiro"
                          fill
                          className="aspect-[3/2] object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <Link
              href="https://forms.gle/9jDX2PAfMmnbRAJY6"
              className="hidden min-h-[551px] bg-[url('/assets/images/seletivo.jpg')] bg-contain bg-center bg-no-repeat p-[24px] xl:block"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="mt-[62px] xl:hidden">
        <Swiper navigation modules={[Navigation]}>
          <SwiperSlide>
            <div className="relative flex h-[134px] w-full items-center bg-[url('/assets/images/hero-image.png')] bg-cover bg-right bg-no-repeat px-[20px]">
              <div className="relative h-[40px] w-[98px]">
                <Image
                  src="/assets/images/educar-para-libertar-logo.png"
                  fill
                  alt="Logo educar para libertar"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <Link
              href="https://forms.gle/9jDX2PAfMmnbRAJY6"
              className="relative flex h-[134px] w-full items-center px-[20px]"
            >
              <div className="relative h-full w-full">
                <Image
                  src="/assets/images/seletivo.jpg"
                  fill
                  alt="Logo educar para libertar"
                  objectFit="contain"
                />
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
        <div className="my-[32px] px-[24px] text-[14px] text-complement-200">
          <p className="mb-[24px] text-justify">
            Em 2020, durante o início da pandemia, um grupo de profissionais da
            educação, incluindo as professoras Ana Márcia de Sousa e Ana Flávia
            Vieira Rolim, juntamente com o professor Camilo Cazé, iniciou uma
            reflexão sobre as mudanças de paradigma que estavam ocorrendo na
            educação pública brasileira devido ao contexto da pandemia.
            <br />
            <br />O desafio que nos preocupava era como lidar com os problemas
            preexistentes na educação pública, agravados pela pandemia.
            Sentíamos a necessidade de colaborar com o governo para enfrentar as
            dificuldades decorrentes do distanciamento social, incluindo a
            regressão da aprendizagem e as questões socioemocionais.
          </p>
          <Link
            href={phoneSite}
            target="_blank"
            className="rounded bg-main px-[16px] py-[8px] text-complement-100"
          >
            Fale Conosco
          </Link>
          <p className="mt-[24px] font-serif text-[16px] text-main">
            Nossos Parceiros:
          </p>
        </div>
        <Swiper
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          spaceBetween={32}
          slidesPerView={useWindowSize() < 570 ? 3 : 3.7}
          className="mt-[16px] bg-complement-100"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner}>
              <div className="relative my-[16px] h-[40px] w-[152px]">
                <Image
                  src={partner}
                  alt="logo parceiro"
                  fill
                  className="aspect-[3/2] object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

import 'swiper/css';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useWindowSize } from '@/hooks/useWindowSize';

const allFeedbacks = [
  {
    text: '“O Projeto Aprendizagens (PALEP+) trabalha com os nossos estudantes na Recomposição das Aprendizagens que ficaram para trás lá na pandemia. Tudo tem acontecido da melhor maneira. Nós estamos pensando na melhor gestão, focada em nossos estudantes e companheiros de trabalho.”',
    src: '/assets/images/wilza-vitorino.png',
    name: 'Wilza Vitorino',
    job: 'Secretária Municipal de Educação de Garanhuns/PE.',
  },
  {
    text: '“Identificamos através de levantamentos pedagógicos mais de 1.500 estudantes com aprendizado insuficiente, um impacto trazido pela pandemia. A gestão da prefeita Célia Salles garantiu recursos e, a partir de uma parceria com a Escola Prime, criamos o Projeto Nivelar (PALEP+).”',
    src: '/assets/images/francisco-amorim.png',
    name: 'Francisco Amorim',
    job: 'Secretário Municipal de Educação do Ipojuca / PE',
  },
  {
    text: '“O Projeto Somar (PALEP+) vem contribuindo para o desenvolvimento da educação em nosso município, gostaria de agradecer a toda equipe envolvida, por essa troca de conhecimentos e esse aproveitamento maravilhoso, que vem dando condições a educação do município.”',
    src: '/assets/images/francisco-ventura.png',
    name: 'Francismario Ventura',
    job: 'Secretário Municipal de Educação do Igaci/AL.',
  },
  {
    text: '“O Projeto Acolher é uma forte ferramenta desde a prevenção até a monitorização da Saúde Mental de todos os profissionais envolvidos, afim de motivar e incentivar uma vida com maior dinamismo e Equilíbrio Emocional, como um forte protetor para relações mais saudáveis no ambiente de trabalho.“',
    src: '/assets/images/andreia-costa.png',
    name: 'Andréia Costa',
    job: 'Enfermeira, especialista em Saúde Mental.',
  },
];

export const Feedbacks = () => {
  const gap = (useWindowSize() - 1194) / 2;

  return (
    <div className="mt-[48px]">
      <div className="mx-auto max-w-[1194px] px-[20px] xl:px-[0px]">
        <h2 className="text-[16px] font-bold text-main  xl:text-[24px]">
          Com a palavra, quem conhece
        </h2>
      </div>
      <Swiper
        slidesOffsetBefore={useWindowSize() < 1280 ? 20 : gap}
        slidesOffsetAfter={useWindowSize() < 1280 ? 20 : gap}
        spaceBetween={32}
        slidesPerView={useWindowSize() < 1280 ? 1.3 : 3.7}
        className="mt-[32px]"
      >
        {allFeedbacks.map((feedback) => (
          <SwiperSlide key={feedback.name}>
            <div className="my-[16px] overflow-hidden rounded p-[22px] shadow-lg">
              <p className="text-[16px] text-complement-200">{feedback.text}</p>
              <div className="mt-[24px] flex justify-start gap-[8px]">
                <div className="relative h-[40px] w-[40px]  min-w-[40px] overflow-hidden rounded-full">
                  <Image
                    src={feedback.src}
                    alt={`${feedback.name} foto`}
                    fill
                    quality={100}
                    className="object-cover"
                  />
                </div>
                <div className="text-main">
                  <p className="text-[12px] font-bold xl:text-[14px]">
                    {feedback.name}
                  </p>
                  <p className="mt-[8px] text-[12px]">{feedback.job}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

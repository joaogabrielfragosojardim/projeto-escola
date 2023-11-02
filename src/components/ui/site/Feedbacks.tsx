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
  {
    text: '“A rotina de professor é algo extremamente exaustivo, eu tive a oportunidade de presenciar isso no meu consultório, então estar no Projeto Acolher, trazendo uma forma de abordagem mais preventiva de cuidados com o corpo no que se refere a melhora da alimentação...”',
    src: '/assets/images/samuel-feitosa.png',
    name: 'Dr. Samuel Feitosa',
    job: 'Médico e formador do Projeto Acolher.',
  },
  {
    text: '“No Projeto Acolher, fizemos uma capacitação com os professores sobre Saúde Vocal, o principal instrumento de trabalho de toda equipe docente. Trabalhamos Técnicas de Oratória, como: falar em público e ter uma fala dinâmica, para que a voz desses profissionais seja sempre de melhor qualidade.”',
    src: '/assets/images/cirana-vasconcelos.png',
    name: 'Cirana Vasconcelos',
    job: 'Fonoaudióloga e formadora do Projeto Acolher',
  },
  {
    text: '“Estive no Projeto Comer Bem para conversar um pouquinho com os profissionais da merenda e de serviços gerais sobre a importância da Alimentação Escolar na saúde de todos os estudantes da rede municipal de Garanhuns.”',
    src: '/assets/images/drielly-costa.png',
    name: 'Drielly Costa',
    job: 'Nutricionista e formadora do Projeto Comer Bem',
  },
  {
    text: 'Trabalhei com a equipe a importância do movimento e como a gente precisa manter nosso corpo em movimento para que ele tenha saúde e qualidade de vida, para que a gente possa trabalhar melhor, exercer nossas funções laborais e nossas funções de vida com mais felicidade e mais capacidade funcional.',
    src: '/assets/images/cynara-raquel.png',
    name: 'Cynara Raquel',
    job: 'Fisioterapeuta, especialista em Pilates e formadora do Projeto Comer Bem',
  },
];

export const Feedbacks = () => {
  const gap = (useWindowSize() - 1194) / 2;

  return (
    <div className="mt-[48px]">
      <div className="mx-auto max-w-[1194px] px-[20px] xl:px-[0px]">
        <h2
          className="font-serif text-[16px] font-bold text-main xl:text-[24px]"
          id="feedbacks"
        >
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
              <p className="text-justify text-[16px] text-complement-200">
                {feedback.text}
              </p>
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

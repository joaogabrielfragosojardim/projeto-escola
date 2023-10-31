import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { GoPeople } from 'react-icons/go';
import { HiOutlineCloud, HiOutlineDocumentText } from 'react-icons/hi';
import { IoChatbubblesOutline, IoRestaurantOutline } from 'react-icons/io5';
import { LiaBriefcaseMedicalSolid } from 'react-icons/lia';
import { PiBookBookmarkLight, PiStethoscopeFill } from 'react-icons/pi';

import { phoneSite } from '@/constants/contacts';
import { verifyIsOdd } from '@/utils/verifyIsOdd';

const projects = [
  {
    projectLogo: '/assets/images/logo-palep.png',
    images: [
      '/assets/images/palep-01.png',
      '/assets/images/palep-02.png',
      '/assets/images/palep-03.png',
    ],
    text: 'O programa de Alfabetização e Letramento Escola Prime tem como objetivo principal a Recomposição da Aprendizagem, utilizando uma metodologia personalizada para cada estudante, reconhecendo as diferenças em ritmo e desafios de aprendizado. Além disso, o projeto promove a formação de Educadores Sociais com foco na adaptação às necessidades individuais dos estudantes, visando criar um ambiente favorável para a aprendizagem.',
    items: [
      {
        text: 'Facilita a interação entre educadores e alunos.',
        icon: <GoPeople />,
      },
      {
        text: 'Facilita a interação entre educadores e alunos.',
        icon: <PiBookBookmarkLight />,
      },
      {
        text: 'Facilita a interação entre educadores e alunos.',
        icon: <HiOutlineCloud />,
      },
    ],
  },
  {
    projectLogo: '/assets/images/logo-acolher-color.png',
    images: [
      '/assets/images/acolher-01.png',
      '/assets/images/acolher-02.png',
      '/assets/images/acolher-03.png',
    ],
    text: 'O Projeto Acolher visa garantir a qualidade do processo de aprendizagem ao priorizar a saúde dos estudantes e oferece assessoria, consultoria e planejamento para a realização de ações estratégicas de prevenção de saúde mental, fonoaudiologia, fisioterapia laboral e prevenção cardiológica nas escolas, com a contratação e formação de profissionais especializados.',
    items: [
      {
        text: 'Visa melhorar a qualidade da saúde mental dos estudantes.',
        icon: <AiOutlineHeart />,
      },
      {
        text: 'Visa melhorar a qualidade da saúde mental dos estudantes.',
        icon: <LiaBriefcaseMedicalSolid />,
      },
      {
        text: 'Diversos tipos de atendimento médico.',
        icon: <PiStethoscopeFill />,
      },
    ],
  },
  {
    projectLogo: '/assets/images/logo-comer-bem.png',
    images: [
      '/assets/images/comer-bem-01.png',
      '/assets/images/comer-bem-02.png',
      '/assets/images/comer-bem-03.png',
    ],
    text: 'O projeto oferece assessoria, consultoria e planejamento para o desenvolvimento de ações que visam implementar Hábitos Alimentares Saudáveis nos estudantes e suas famílias, como forma de prevenir a obesidade e suas consequências na saúde, através de atividades formativas que promovem a conscientização quanto à necessidade de uma alimentação saudável.',
    items: [
      {
        text: 'Profissionais envolvidos na merenda escolar.',
        icon: <IoRestaurantOutline />,
      },
      {
        text: 'Palestras voltadas para promover a saúde dos alunos.',
        icon: <IoChatbubblesOutline />,
      },
      {
        text: 'Avaliação antropométrica inicial e final dos estudantes',
        icon: <HiOutlineDocumentText />,
      },
    ],
  },
];

export const OurProjects = () => {
  return (
    <div className="mx-auto mt-[48px] max-w-[1194px]">
      <div className="flex  gap-[30px]">
        <div className="max-w-[563px]">
          <h2 className="text-[24px] font-bold  text-main">Nossos projetos</h2>
          <p className="my-[32px] text-justify text-[16px] text-complement-200">
            Ao visitarmos as redes públicas de ensino, percebemos que muitos
            estudantes perderam a capacidade de acompanhar o respectivo grupo
            classe. Isto gerou inúmeras perdas de aprendizagens. Por outro lado,
            nos deparamos com professores desmotivados, insatisfeitos e
            inseguros. Diante deste quadro, estabelecemos três eixos
            fundamentais para serem focados em nossa atuação.
          </p>
          <Link
            href={phoneSite}
            target="_blank"
            className="rounded bg-main px-[32px] py-[8px] text-complement-100"
          >
            Fale Conosco
          </Link>
        </div>
        <div>
          <div className="grid auto-cols-max grid-cols-2 grid-rows-2 gap-[32px]">
            <div className=" col-span-full w-full rounded bg-complement-100 p-[24px]">
              <div className="relative h-[25px] w-[80px]">
                <Image
                  src="/assets/images/logo-palep.png"
                  alt="logo palep"
                  fill
                />
              </div>
              <p className="mt-[16px] text-[16px] text-main">
                A recomposição da aprendizagem com foco na alfabetização e o
                letramento (numeracia e literacia).
              </p>
            </div>
            <div className="w-full rounded bg-main p-[16px]">
              <div className="relative h-[25px] w-[80px]">
                <Image
                  src="/assets/images/logo-acolher.png"
                  alt="logo acolher"
                  fill
                />
              </div>
              <p className="mt-[16px] text-[16px] text-complement-100">
                O Acolhimento dos professores com foco no socioemocional
              </p>
            </div>
            <div className="w-full rounded bg-complement-100 p-[24px]">
              <div className="relative h-[25px] w-[60px]">
                <Image
                  src="/assets/images/logo-comer-bem.png"
                  alt="logo comer bem"
                  fill
                />
              </div>
              <p className="mt-[10px] text-[16px] text-main">
                Estabelecimento de políticas de gestão por resultado.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[52px] flex flex-col gap-[40px]">
        {projects.map((project, index) => (
          <div key={project.projectLogo}>
            <div className="relative mb-[32px] h-[40px] w-[132px]">
              <Image
                src={project.projectLogo}
                alt="logo do projeto"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <div
              className={`flex justify-between gap-[30px] ${
                verifyIsOdd(index) ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="flex w-full items-center gap-[24px]">
                <div className="flex flex-col gap-[24px]">
                  <div className="relative h-[200px] w-[200px] overflow-hidden rounded">
                    <Image
                      src={project.images[0] || ''}
                      fill
                      quality={100}
                      alt="imagens do projeto"
                      objectFit="cover"
                    />
                  </div>
                  <div className="relative h-[200px] w-[200px] overflow-hidden rounded">
                    <Image
                      src={project.images[1] || ''}
                      fill
                      quality={100}
                      alt="imagens do projeto"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="relative h-[424px] w-[361px] overflow-hidden rounded">
                  <Image
                    src={project.images[2] || ''}
                    fill
                    quality={100}
                    alt="imagens do projeto"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="max-w-[580px]">
                <p className="text-justify text-[16px] text-complement-200">
                  {project.text}
                </p>
                <div className="mt-[24px] flex flex-col gap-[24px]">
                  {project.items.map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-[16px]"
                    >
                      <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-main text-[18px] text-complement-100">
                        {item.icon}
                      </div>
                      <p className="text-[16px] text-complement-200">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

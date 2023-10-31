import Image from 'next/image';
import Link from 'next/link';

import { phoneSite } from '@/constants/contacts';

const partners = [
  '/assets/images/fonte-cultural.png',
  '/assets/images/fadurpe.png',
  '/assets/images/abdesm.png',
  '/assets/images/parceiros-acosta.png',
];

export const Hero = () => {
  return (
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
          <p>
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
        </div>
        <Link
          href={phoneSite}
          target="_blank"
          className="rounded bg-main px-[32px] py-[8px] text-complement-100"
        >
          Fale Conosco
        </Link>
        <div className="mt-[32px] font-serif text-main">
          <p className="text-[16px]">Nossos Parceiros:</p>
          <div className="ml-[-18px] mt-[24px] flex">
            {partners.map((partner) => (
              <div className="relative h-[40px] w-[152px]" key={partner}>
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
  );
};

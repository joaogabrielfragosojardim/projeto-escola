import Image from 'next/image';
import Link from 'next/link';
import { BiSolidQuoteAltLeft } from 'react-icons/bi';

import { phoneSite } from '@/constants/contacts';

export const Books = () => {
  return (
    <div className="relative mt-[32px] bg-complement-100 py-[36px]">
      <div className="mx-auto flex max-w-[1194px] flex-col-reverse items-center justify-between gap-[36px] px-[20px] text-main xl:flex-row xl:px-[0px]">
        <div className="xl:max-w-[660px]">
          <BiSolidQuoteAltLeft size={30} />
          <p className="my-[32px] text-justify text-[14px] xl:text-[20px]">
            Hoje, estamos montando um grupo de autores com a produção de
            material didático de suporte aos projetos e livros paradidáticos a
            exemplo da Coleção Educação e Cidadania voltada para a discussão dos
            temas integradores da BNCC. Com a certeza que precisamos nos tornar
            necessários aos outros. Sempre!
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
          <div className="relative z-10 h-[120px] w-[265px] xl:h-[216px] xl:w-[479px]">
            <Image
              src="/assets/images/colecao-educacao-e-cidadania.png"
              alt="Livros da coleção educação e cidadania"
              fill
              quality={100}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 hidden h-[255px] w-[600px] xl:inline">
        <div className="relative z-[5] h-full w-full">
          <Image
            src="/assets/images/detalhes-circular.png"
            alt="detalhes"
            fill
            quality={100}
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute right-0 top-0 h-[130px] w-[130px] xl:hidden">
        <div className="relative z-[5] h-full w-full">
          <Image
            src="/assets/images/circulo-01.png"
            alt="detalhes"
            fill
            quality={100}
            className="object-contain object-right"
          />
        </div>
      </div>
      <div className="absolute left-0 top-[60px] h-[130px] w-[130px] xl:hidden">
        <div className="relative z-[5] h-full w-full">
          <Image
            src="/assets/images/circulo-02.png"
            alt="detalhes"
            fill
            quality={100}
            className="object-contain object-left"
          />
        </div>
      </div>
    </div>
  );
};

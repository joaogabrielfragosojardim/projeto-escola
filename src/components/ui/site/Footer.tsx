import Image from 'next/image';
import Link from 'next/link';
import {
  AiFillYoutube,
  AiOutlineInstagram,
  AiOutlineWhatsApp,
} from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';

import { phoneSite } from '@/constants/contacts';

export const Footer = () => {
  return (
    <footer>
      <div className="w-full bg-[#ADADAD] p-[24px]">
        <div className="mx-auto w-full max-w-[1194px]">
          <div className="flex w-full justify-between">
            <div>
              <div className="relative h-[40px] w-[115px]">
                <Image
                  src="/assets/images/logo-com-slogan.png"
                  alt="logo com slogan educar para libertar"
                  fill
                  quality={100}
                  objectFit="contain"
                />
              </div>
              <ul className="mt-[24px] flex flex-col gap-[16px]">
                <li>
                  <div className="flex items-center gap-[16px]">
                    <div className="rounded-[50%] bg-main p-[10px] text-complement-100">
                      <BsTelephone size={15} />
                    </div>
                    <p className="text-[14px] text-complement-200">
                      (81) 3032-1160
                    </p>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-[16px]">
                    <div className=" rounded-[50%] bg-main p-[10px] text-complement-100">
                      <FiMapPin size={15} />
                    </div>
                    <p className="text-[14px] text-complement-200">
                      Rua Castro Leão, 86, Sala 02, Madalena, Recife - PE
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <ul className="flex gap-[16px]">
                <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
                  <Link
                    href="https://www.youtube.com/@escolaprime"
                    target="_blank"
                  >
                    <AiFillYoutube size={15} />
                  </Link>
                </li>
                <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
                  <Link
                    href="https://www.instagram.com/escola.prime"
                    target="_blank"
                  >
                    <AiOutlineInstagram size={15} />
                  </Link>
                </li>
                <li className="rounded-[50%] bg-main p-[10px] text-complement-100">
                  <Link href={phoneSite} target="_blank">
                    <AiOutlineWhatsApp size={15} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-[32px] flex w-full justify-between text-[14px] text-complement-200">
            <div>
              <p>Todos os direitos reservados</p>
            </div>
            <div>
              <p>Copyright | 2023 Escola Prime</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

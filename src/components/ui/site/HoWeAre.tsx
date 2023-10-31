import Image from 'next/image';
import { PiSuitcaseSimpleLight } from 'react-icons/pi';

const hoWeAreItems = [
  {
    src: '/assets/images/alexandre-costa.png',
    name: 'Alexandre Costa',
    job: 'Coordenador técnico',
  },
  {
    src: '/assets/images/ana-flavia-e-ana-marcia.png',
    name: 'Ana Flávia e Ana Márcia',
    job: 'Assessoras',
  },
  {
    src: '/assets/images/camilo-caze.png',
    name: 'Camilo Cazé',
    job: 'Gerência de projetos',
  },
];

export const HoWeAre = () => {
  return (
    <div className="mx-auto mt-[32px] max-w-[1194px]" id="hoWeAre">
      <div>
        <h2 className="text-[24px] font-bold  text-main">Quem Somos</h2>
        <div className="mt-[32px] grid auto-cols-max grid-cols-3 justify-center gap-[30px]">
          {hoWeAreItems.map((item) => (
            <div key={item.name} className="overflow-hidden rounded">
              <div className="relative h-[277px] w-full">
                <Image src={item.src} alt={item.name} fill quality={100} />
              </div>
              <div className="bg-main p-[16px] text-complement-100">
                <p className="text-[16px] font-bold">{item.name}</p>
                <div className="flex items-center gap-[8px]">
                  <PiSuitcaseSimpleLight size={15} />
                  <p>{item.job}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { GoPeople } from 'react-icons/go';
import { PiHouseLight, PiStackSimpleLight, PiFolderMinusLight, PiRulerLight } from 'react-icons/pi';
import { RxPerson } from 'react-icons/rx';
import { IoSchoolOutline } from 'react-icons/io5';

export const sideNavMenuRoutes = ({
  isAdmMaster,
  isAdm,
  isCoordinator,
  isTeacher,
}: {
  isAdmMaster: boolean;
  isAdm: boolean;
  isCoordinator: boolean;
  isTeacher: boolean;
}) => {
  return [
    {
      name: 'Início',
      icon: <PiHouseLight size={25} />,
      route: '/dashboard',
      userCanView: true,
    },
    {
      name: 'Perfil',
      icon: <RxPerson size={25} />,
      route: '/dashboard/profile',
      userCanView: true,
    },
    {
      name: 'Cadastrar',
      icon: <RxPerson size={25} />,
      route: '',
      userCanView: true,
      children: [
        {
          name: 'Administrador',
          icon: <PiFolderMinusLight size={25} />,
          route: '/forms/adm',
          userCanView: isAdmMaster,
        },
        {
          name: 'Coordenador',
          icon: <GoPeople size={25} />,
          route: '/forms/coordenator',
          userCanView: isAdmMaster || isAdm,
        },
        {
          name: 'Projeto',
          icon: <PiStackSimpleLight size={25} />,
          route: '/forms/student',
          userCanView: isAdmMaster || isAdm,
        },
        {
          name: 'Educador Social',
          icon: <PiRulerLight size={25} />,
          route: '/forms/educator',
          userCanView: isAdmMaster || isAdm || isCoordinator,
        },
        {
          name: 'Aluno',
          icon: <IoSchoolOutline size={25} />,
          route: '/forms/student',
          userCanView: isAdmMaster || isAdm || isCoordinator || isTeacher,
        },
      ],
    },
  ];
};

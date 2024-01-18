import { GoPeople } from 'react-icons/go';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { IoSchoolOutline } from 'react-icons/io5';
import {
  PiBookBookmarkLight,
  PiFolderMinusLight,
  PiHouseLight,
  PiNotePencilLight,
  PiRulerLight,
  PiStackSimpleLight,
  PiStudentLight,
} from 'react-icons/pi';
import { RxPerson } from 'react-icons/rx';
import { SlGraph } from 'react-icons/sl';

import { RoleEnum } from '@/types/roles';

export const sideNavMenuRoutes = (role: RoleEnum) => {
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
      route: '/profile',
      userCanView: true,
    },
    {
      name: 'Cadastrar',
      icon: <PiNotePencilLight size={25} />,
      route: '',
      userCanView: true,
      children: [
        {
          name: 'Administrador',
          icon: <PiFolderMinusLight size={25} />,
          route: '/forms/adm',
          userCanView: [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(role),
        },
        {
          name: 'Coordenador',
          icon: <GoPeople size={25} />,
          route: '/forms/coordinator',
          userCanView: [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(role),
        },
        {
          name: 'Educador Social',
          icon: <PiRulerLight size={25} />,
          route: '/forms/educator',
          userCanView: [
            RoleEnum.ADM_MASTER,
            RoleEnum.ADM,
            RoleEnum.COORDINATOR,
          ].includes(role),
        },
        {
          name: 'Aluno',
          icon: <IoSchoolOutline size={25} />,
          route: '/forms/student',
          userCanView: [
            RoleEnum.ADM_MASTER,
            RoleEnum.ADM,
            RoleEnum.COORDINATOR,
            RoleEnum.TEACHER,
          ].includes(role),
        },
        {
          name: 'Frequência',
          icon: <PiStudentLight size={25} />,
          route: '/reports/frequency',
          userCanView: [RoleEnum.TEACHER].includes(role),
        },
        {
          name: 'Escola',
          icon: <PiBookBookmarkLight size={25} />,
          route: '/forms/school',
          userCanView: [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(role),
        },
        {
          name: 'Projeto',
          icon: <PiStackSimpleLight size={25} />,
          route: '/forms/project',
          userCanView: [RoleEnum.ADM_MASTER, RoleEnum.ADM].includes(role),
        },
      ],
    },
    {
      name: 'Relatórios',
      icon: <HiOutlineDocumentReport size={25} />,
      route: '/reports',
      userCanView: true,
    },
    {
      name: 'Gráficos',
      icon: <SlGraph size={25} />,
      route: '/graphs',
      userCanView: true,
    },
  ];
};

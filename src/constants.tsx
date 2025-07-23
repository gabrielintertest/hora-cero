import React from 'react';
import type { Role } from './types';
import { CisoIcon, ItManagerIcon, NetworkManagerIcon, HrManagerIcon, FinanceManagerIcon, PrManagerIcon } from './components/icons';
import { Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6 } from './components/avatars';

export const ROLES: Role[] = [
  {
    id: 'ciso',
    title: 'Gerente de Seguridad (CISO)',
    mission: 'Liderar la respuesta técnica, coordinar la seguridad y evaluar la amenaza.',
    icon: <CisoIcon />,
  },
  {
    id: 'it_manager',
    title: 'Gerente de TI / Sistemas',
    mission: 'Evaluar copias de seguridad, planificar y ejecutar la restauración de sistemas.',
    icon: <ItManagerIcon />,
  },
  {
    id: 'network_manager',
    title: 'Gerente de Redes',
    mission: 'Monitorear el tráfico de red para identificar y contener la propagación.',
    icon: <NetworkManagerIcon />,
  },
  {
    id: 'hr_manager',
    title: 'Gerente de Recursos Humanos',
    mission: 'Gestionar la comunicación con empleados y mantener la moral.',
    icon: <HrManagerIcon />,
  },
  {
    id: 'finance_manager',
    title: 'Gerente de Finanzas',
    mission: 'Evaluar el impacto financiero y gestionar la liquidez para la respuesta.',
    icon: <FinanceManagerIcon />,
  },
  {
    id: 'pr_manager',
    title: 'Gerente de Comunicaciones/RRPP',
    mission: 'Gestionar la comunicación externa con clientes, medios y reguladores.',
    icon: <PrManagerIcon />,
  },
];

export const AVATARS = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6];


export const MAX_HOURS = 24;
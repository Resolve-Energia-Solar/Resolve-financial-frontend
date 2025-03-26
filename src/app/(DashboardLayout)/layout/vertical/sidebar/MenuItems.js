import { uniqueId } from 'lodash';

import {
  IconCurrencyDollar,
  IconFileDescription,
  IconLayoutKanban,
  IconShoppingCart,
  IconUser,
  IconUsers,
  IconBuilding,
  IconVector,
  IconUserScan,
  IconTools,
  IconHomeQuestion,
  IconUserDollar,
  IconPoint,
  IconBuildingBank,
  IconUserPin,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Quadros',
    icon: IconLayoutKanban,
    href: '/',
    children: [
      { id: uniqueId(), title: 'CRM', icon: IconPoint, href: '/apps/kanban/' },
      // { id: uniqueId(), title: 'Operação', icon: IconPoint, href: '/apps/boards/erp' },
    ],
    chip: 'Novo',
    chipColor: 'secondary',
    permissions: ['core.view_board'],
  },
  {
    id: uniqueId(),
    title: 'Serviços de Campo',
    icon: IconUserPin,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Ordem de Serviço',
        icon: IconPoint,
        href: '/apps/inspections/schedule',
      },
      {
        id: uniqueId(),
        title: 'Agendamentos',
        icon: IconPoint,
        href: '/apps/commercial/schedules',
      },
    ],
    permissions: ['field_services.view_schedule'],
  },
  {
    id: uniqueId(),
    title: 'Leads',
    icon: IconUser,
    href: '/apps/leads',
    permissions: ['resolve_crm.view_lead'],
  },
  {
    id: uniqueId(),
    title: 'Solic. Financiamento',
    icon: IconBuildingBank,
    href: '/apps/funding-request',

    children: [
      {
        id: uniqueId(),
        title: 'Sicoob',
        icon: IconPoint,
        href: '/apps/funding-request/sicoob',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Vendas',
    icon: IconShoppingCart,
    href: '/apps/commercial/sale',
    permissions: ['resolve_crm.view_sale'],
  },
  {
    id: uniqueId(),
    title: 'Financeiro',
    icon: IconCurrencyDollar,
    href: '/',
    permissions: ['financial.view_payment', 'financial.view_financialrecord'],
    children: [
      {
        id: uniqueId(),
        title: 'Pagamentos',
        icon: IconPoint,
        href: '/apps/invoice',
        permissions: ['financial.view_payment'],
      },
      {
        id: uniqueId(),
        title: 'Parcelas',
        icon: IconPoint,
        href: '/apps/invoice/installments',
        permissions: ['financial.view_payment'],
      },
      {
        id: uniqueId(),
        title: 'Solicitação de Pagamento',
        icon: IconPoint,
        href: '/apps/financial-record',
        permissions: ['financial.view_financialrecord'],
      },
      {
        id: uniqueId(),
        title: 'Anexos',
        icon: IconPoint,
        href: '/apps/financial-record/attachments',
        permissions: ['financial.view_financialrecord_attachment'],
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Comissionamento',
    icon: IconUserDollar,
    href: '/apps/commission',
    permissions: ['financial.view_franchiseinstallment'],
  },
  {
    id: uniqueId(),
    title: 'Engenharia',
    icon: IconTools,
    href: '',
    permissions: ['resolve_crm.view_project'],
    children: [
      {
        id: uniqueId(),
        title: 'Projetos',
        icon: IconPoint,
        href: '/apps/project',
        permissions: ['resolve_crm.view_project'],
      },
      {
        id: uniqueId(),
        title: 'Solicitações Conce.',
        icon: IconPoint,
        href: '/apps/request',
        permissions: ['resolve_crm.view_project'],
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Tipos de Telhado',
    icon: IconHomeQuestion,
    href: '/apps/inspections/roof-type',
    permissions: ['inspections.view_rooftype'],
  },
  {
    id: uniqueId(),
    title: 'Usuários',
    icon: IconUser,
    href: '/apps/users',
    permissions: ['accounts.view_user'],
  },
  {
    id: uniqueId(),
    title: 'Squads',
    icon: IconUsers,
    href: '/apps/squad',
    permissions: ['accounts.view_squad'],
  },
  {
    id: uniqueId(),
    title: 'Franquias',
    icon: IconBuilding,
    href: '/apps/branch',
    permissions: ['accounts.view_branch'],
  },
  {
    id: uniqueId(),
    title: 'Departamentos',
    icon: IconVector,
    href: '/apps/department',
    permissions: ['accounts.view_department'],
  },
  {
    id: uniqueId(),
    title: 'Cargos',
    icon: IconUserScan,
    href: '/apps/roles',
    permissions: ['accounts.view_role'],
  },
  {
    id: uniqueId(),
    title: 'Tipos de Documentos',
    icon: IconFileDescription,
    href: '/apps/document-types',
    permissions: ['core.view_documenttype'],
  },
];

export default Menuitems;

import {
  IconPoint,
  IconSettings,
  IconShoppingCart,
  IconUser,
  IconUserPin,
  IconBuildingBank,
  IconTools,
  IconUsers,
  IconBuilding,
  IconVector,
  IconUserScan,
  IconFileDescription,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Comercial',
    icon: IconShoppingCart,
    href: '/apps/commercial/sale',
    permissions: ['resolve_crm.view_sale', 'resolve_crm.view_lead', 'core.view_board', 'field_services.view_schedule'],
    children: [
      {
        id: uniqueId(),
        title: 'Vendas',
        icon: IconPoint,
        href: '/apps/commercial/sale',
        permissions: ['resolve_crm.view_sale'],
      },
      {
        id: uniqueId(),
        title: 'Vistoria',
        icon: IconUserPin,
        href: '/apps/inspections/schedule',
        permissions: ['field_services.view_schedule'],
      },
      {
        id: uniqueId(),
        title: 'CRM',
        icon: IconPoint,
        permissions: ['core.view_board', 'resolve_crm.view_lead'],
        children: [
          {
            id: uniqueId(),
            title: 'Quadros',
            icon: IconPoint,
            href: '/apps/kanban/',
            permissions: ['core.view_board'],
          },
          {
            id: uniqueId(),
            title: 'Leads',
            icon: IconUser,
            href: '/apps/leads',
            permissions: ['resolve_crm.view_lead'],
          },
        ],
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Serviço de Campo',
    icon: IconUserPin,
    href: '/apps/inspections/schedule',
    permissions: ['field_services.view_schedule'],
    children: [
      {
        id: uniqueId(),
        title: 'Agendamentos',
        icon: IconPoint,
        href: '/apps/inspections/schedule',
        permissions: ['field_services.view_schedule'],
      },
    ],
  },

  {
    id: uniqueId(),
    title: 'Financeiro',
    icon: IconCurrencyDollar,
    href: '/apps/invoice',
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
          title: 'Solic. de Pagamento',
          icon: IconPoint,
          href: '/apps/financial-record',
          permissions: ['financial.view_financialrecord'],
          children: [
            {
              id: uniqueId(),
              title: 'Solicitações',
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
    ],
  },
  {
    id: uniqueId(),
    title: 'Solic. Financiamento',
    icon: IconBuildingBank,
    href: '/apps/funding-request',
    // permissions: ['contracts.view_payment',],
    children: [
        {
          id: uniqueId(),
          title: 'Solicitações Sicoob',
          icon: IconPoint,
          href: '/apps/funding-request',
          // permissions: ['financial.view_payment'],
        },
    ],
  },
  {
    id: uniqueId(),
    title: 'Engenharia',
    icon: IconTools,
    permissions: ['resolve_crm.view_project'],
    href: '/apps/project',
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
    title: 'Config. Sistema',
    icon: IconSettings,
    permissions: ['accounts.view_user', 'accounts.view_squad', 'accounts.view_branch', 'accounts.view_department', 'accounts.view_role', 'core.view_documenttype'],
    children: [
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
    ],
  },
];
export default Menuitems;

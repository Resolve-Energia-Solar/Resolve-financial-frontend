import { uniqueId } from 'lodash';

import {
  IconBoxMultiple,
  IconCalendar,
  IconClockQuestion,
  IconCurrencyDollar,
  IconFileDescription,
  IconStar,
  IconLayoutKanban,
  IconChartLine,
  IconBox,
  IconShoppingCart,
  IconUser,
  IconUsers,
  IconBuilding,
  IconVector,
  IconUserScan,
  IconTools,
  IconHomeQuestion,
  IconMailFast,
  IconUserDollar,
  IconPoint,
  IconUserPin,
} from '@tabler/icons-react';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

import { permission } from 'process';
import { id } from 'date-fns/locale';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'CRM',
    icon: WorkOutlineOutlinedIcon,
    href: '/',
    children: [
      { id: uniqueId(), title: 'Kanban', icon: IconLayoutKanban, href: '/apps/kanban/' },
      { id: uniqueId(), title: 'Leads', icon: AccountCircleOutlinedIcon, href: '/apps/leads', permissions: ['resolve_crm.view_lead'] },
    ],
    chip: 'Novo',
    chipColor: 'secondary',
    permissions: ['core.view_board'],
  },
  {
    id: uniqueId(),
    title: 'Serviços de Campo',
    icon: MapOutlinedIcon,
    href: '/',
    children: [
      {
        id: uniqueId(),
        // title: 'Ordem de Serviço',
        // icon: IconPoint,
        title: 'Agendamentos',
        icon: CalendarMonthOutlinedIcon,
        href: '/apps/inspections/schedule',
      }
    ],
    permissions: ['field_services.view_schedule'],
  },
  // {
  //   id: uniqueId(),
  //   title: 'Leads',
  //   icon: IconUser,
  //   href: '/apps/leads',
  //   permissions: ['resolve_crm.view_lead'],
  // },
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
        icon: PaymentsOutlinedIcon,
        href: '/apps/invoice',
        permissions: ['financial.view_payment']
      },
      {
        id: uniqueId(),
        title: 'Parcelas',
        icon: IconPoint,
        href: '/apps/invoice/installments',
        permissions: ['financial.view_payment']
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
      }
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

import { uniqueId } from 'lodash';

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
  IconCurrencyDollar,
  IconTrendingUp,
  IconLayoutKanban,
  IconBriefcase2,
  IconMapRoute,
  IconId,
  IconCalendarStar,
  IconCash,
  IconWallet,
  IconReportMoney,
  IconPigMoney,
  IconPaperclip,
  IconRuler,
  IconFileArrowRight,
  IconUserDollar,
  IconHomeQuestion
} from '@tabler/icons-react';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';


import { permission } from 'process';
import { id } from 'date-fns/locale';

const Menuitems = [
 {
    id: uniqueId(),
    title: 'CRM',
    icon: IconBriefcase2,
    href: '/',
    children: [
      { id: uniqueId(), title: 'Kanban', icon: IconLayoutKanban, href: '/apps/kanban/', permissions: ['core.view_board'] },
      { id: uniqueId(), title: 'Leads', icon: IconId, href: '/apps/leads', permissions: ['resolve_crm.view_lead'] },
    ],
  },
  // {
  //   id: uniqueId(),
  //   title: 'Comercial',
  //   icon: IconTrendingUp,
  //   href: '/apps/commercial/sale',
  //   permissions: ['resolve_crm.view_sale', 'resolve_crm.view_lead', 'core.view_board', 'field_services.view_schedule'],
  //   children: [
      {
        id: uniqueId(),
        title: 'Vendas',
        icon: IconShoppingCart,
        href: '/apps/commercial/sale',
        permissions: ['resolve_crm.view_sale'],
      },
  //     {
  //       id: uniqueId(),
  //       title: 'Vistoria',
  //       icon: IconUserPin,
  //       href: '/apps/inspections/schedule',
  //       permissions: ['field_services.view_schedule'],
  //     },
  //   ],
  // },
  {
    id: uniqueId(),
    title: 'Serviços de Campo',
    icon: IconMapRoute,
    href: '/',
    children: [
      {
        id: uniqueId(),
        title: 'Agendamentos',
        icon: IconCalendarStar,
        href: '/apps/inspections/schedule',
      },
    ],
    permissions: ['field_services.view_schedule'],
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
        icon: IconCash,
        href: '/apps/invoice',
        permissions: ['financial.view_payment'],
      },
      {
        id: uniqueId(),
        title: 'Parcelas',
        icon: IconWallet,
        href: '/apps/invoice/installments',
        permissions: ['financial.view_payment'],
      },
      {
        id: uniqueId(),
        title: 'Solicitação de Pagamento',
        icon: IconReportMoney,
        href: '/apps/financial-record',
        permissions: ['financial.view_financialrecord'],
      },
      {
        id: uniqueId(),
        title: 'Anexos',
        icon: IconPaperclip,
        href: '/apps/financial-record/attachments',
        permissions: ['financial.view_financialrecord_attachment'],
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
          icon: IconPigMoney,
          href: '/apps/funding-request',
          // permissions: ['financial.view_payment'],
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
        icon: IconRuler,
        href: '/apps/project',
        permissions: ['resolve_crm.view_project'],
      },
      {
        id: uniqueId(),
        title: 'Solicitações',
        icon: IconFileArrowRight,
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

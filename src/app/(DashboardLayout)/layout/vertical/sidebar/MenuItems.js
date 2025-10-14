import { IconReportMoney } from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Solic. de Pagamento',
    icon: IconReportMoney,
    href: '/apps/financial-record',
    permissions: ['financial.view_financialrecord'],
  },
];
export default Menuitems;

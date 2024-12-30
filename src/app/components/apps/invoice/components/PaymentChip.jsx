import { Chip } from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';

const PaymentChip = ({ paymentType }) => {
  const getChipProps = (paymentType) => {
    switch (paymentType) {
      case 'C':
        return { label: 'Crédito', color: 'primary', icon: <CreditCardIcon /> };
      case 'D':
        return { label: 'Débito', color: 'secondary', icon: <AttachMoneyIcon /> };
      case 'B':
        return { label: 'Boleto', color: 'warning', icon: <ReceiptIcon /> };
      case 'F':
        return { label: 'Financiamento', color: 'success', icon: <AccountBalanceIcon /> };
      case 'PI':
        return { label: 'Parcelamento Interno', color: 'info', icon: <PaymentsIcon /> };
      case 'P':
        return { label: 'Pix', color: 'info', icon: <PaymentsIcon /> };
      default:
        return { label: paymentType };
    }
  };

  const { label, color, icon } = getChipProps(paymentType);

  return <Chip label={label} color={color} icon={icon} />;
};

export default PaymentChip;

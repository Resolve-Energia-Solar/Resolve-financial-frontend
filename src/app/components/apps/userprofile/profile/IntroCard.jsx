import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChildCard from '../../../../components/shared/ChildCard';
import { IconBriefcase, IconAt, IconMail, IconMapPin } from '@tabler/icons-react';
import { capitalizeWords } from '@/utils/capitalizeWords';

const IntroCard = ({ user }) => {
  const address = user?.addresses?.[0];
  const employeeData = user?.employee_data;
  const minLength = 2;

  return (
    <ChildCard>
      <Typography fontWeight={600} variant="h4" mb={2}>
        Introdução
      </Typography>
      <Typography color="textSecondary" variant="subtitle2" mb={2}>
        Olá, eu sou <b>{capitalizeWords(user?.complete_name, minLength)}</b>. Trabalho como <b>{capitalizeWords(employeeData?.role, minLength)}</b> no setor <b>{capitalizeWords(employeeData?.department, minLength)}</b>.
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconBriefcase size="21" />
        <Typography variant="h6">{capitalizeWords(employeeData?.role, minLength)}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">
          <a href={`mailto:${user?.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {user?.email}
          </a>
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconAt size="21" />
        <Typography variant="h6">{user?.username}</Typography>
      </Stack>
      {address && (
        <Stack direction="row" gap={2} alignItems="center" mb={1}>
          <IconMapPin size="21" />
          <Typography variant="h6">{capitalizeWords(address.str, minLength)}</Typography>
        </Stack>
      )}
    </ChildCard>
  );
};

export default IntroCard;
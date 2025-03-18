import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChildCard from '../../../../components/shared/ChildCard';
import {
  IconAt,
  IconBriefcase,
  IconCake,
  IconCalendar,
  IconGenderMale,
  IconGenderFemale,
  IconGenderBigender,
  IconHome,
  IconMapPin,
  IconMail,
  IconUserCircle,
  IconUser,
} from '@tabler/icons-react';
import { capitalizeWords } from '@/utils/capitalizeWords';
import { useSelector } from 'react-redux';
import { formatDate } from '@/utils/dateUtils';

const IntroCard = ({ user }) => {
  const loggedUser = useSelector((state) => state.user?.user);
  const isOwner = user?.id === loggedUser?.id;
  const address = user?.addresses?.[0];
  const employeeData = user?.employee_data || {};
  const minLength = 2;

  // Valores padrão para exibição
  const completeName = user?.complete_name ? capitalizeWords(user.complete_name, minLength) : 'Usuário';
  const role = employeeData?.role ? capitalizeWords(employeeData.role, minLength) : 'Cargo não informado';
  const department = employeeData?.department ? capitalizeWords(employeeData.department, minLength) : 'Departamento não informado';
  const email = user?.email || 'E-mail não informado';

  const formatDateWithoutYear = (date) => {
    if (!date) return 'Não informado';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' });
  };

  // Dentro do componente, supondo que a variável "isOwner" já esteja definida:
  const formattedBirthDate = user.birth_date
    ? (isOwner ? formatDate(user.birth_date) : formatDateWithoutYear(user.birth_date))
    : 'Não informado';
  return (
    <ChildCard>
      {/* Seção Pública */}
      <Typography fontWeight={600} variant="h4" mb={2}>
        Introdução
      </Typography>
      <Typography color="textSecondary" variant="subtitle2" mb={2}>
        Olá, eu sou <b>{completeName}</b>. Trabalho como <b>{role}</b> no setor <b>{department}</b>.
      </Typography>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconUserCircle size="21" />
        <Typography variant="h6">{completeName}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconBriefcase size="21" />
        <Typography variant="h6">{role}</Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">
          <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {email}
          </a>
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconHome size="21" />
        <Typography variant="h6">
          Unidade: {employeeData.branch || 'Não informado'}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconUser size="21" />
        <Typography variant="h6">
          Gestor: {employeeData.user_manager || 'Não informado'}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconCalendar size="21" />
        <Typography variant="h6">
          Data de admissão: {formatDate(employeeData.hire_date) || 'Não informado'}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconCake size="21" />
        <Typography variant="h6">
          Data de nascimento: {formattedBirthDate}
        </Typography>
      </Stack>
      {/* Informações sensíveis visíveis apenas ao proprietário */}
      {isOwner && (
        <>
          {address && address.str && (
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <IconMapPin size="30" />
              <Typography variant="h6">{capitalizeWords(address.str, minLength)}</Typography>
            </Stack>
          )}
          <Stack direction="row" gap={2} alignItems="center" mb={3}>
            <IconBriefcase size="21" />
            <Typography variant="h6">
              Tipo de contrato:{' '}
              {employeeData.contract_type === 'P'
                ? 'PJ'
                : employeeData.contract_type === 'C'
                  ? 'CLT'
                  : 'Não informado'}
            </Typography>
          </Stack>
          {employeeData.resignation_date && (
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <IconCalendar size="21" />
              <Typography variant="h6">
                Data de desligamento: {formatDate(employeeData.resignation_date)}
              </Typography>
            </Stack>
          )}
          {user.gender === 'M' ? (
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <IconGenderMale size="21" />
              <Typography variant="h6">
                Gênero: Masculino
              </Typography>
            </Stack>
          ) : user.gender === 'F' ? (
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <IconGenderFemale size="21" />
              <Typography variant="h6">
                Gênero: Feminino
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" gap={2} alignItems="center" mb={3}>
              <IconGenderBigender size="21" />
              <Typography variant="h6">
                Gênero: Não Informado
              </Typography>
            </Stack>
          )}
        </>
      )}
    </ChildCard>
  );
};

export default IntroCard;

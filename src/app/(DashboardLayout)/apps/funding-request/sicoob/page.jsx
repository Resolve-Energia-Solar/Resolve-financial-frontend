// src/app/…/Sicoob.jsx
'use client';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CreateFundingRequest from '@/app/components/apps/funding-request/CreateFundingRequest';
import DetailsFundingRequest from '@/app/components/apps/funding-request/DetailsFundingRequest';
import BlankCard from '@/app/components/shared/BlankCard';
import SideDrawer from '@/app/components/shared/SideDrawer';
import AttachmentDrawer from '../../attachment/AttachmentDrawer';
import Comment from '@/app/components/apps/comment';
import requestSicoob from '@/services/requestSicoobService';
import attachmentService from '@/services/attachmentService';
import userService from '@/services/userService';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { enqueueSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  TablePagination,
} from '@mui/material';
import { useEffect, useState } from 'react';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Solicitações de Financiamento' }];

export default function Sicoob() {
  const user = useSelector((state) => state.user?.user);

  // estados
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState();
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [openSideDrawerCreate, setOpenSideDrawerCreate] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataManaging, setFormDataManaging] = useState({});
  const [rFormData, setRFormData] = useState({ occupation: '' });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [disabledManaging, setDisabledManaging] = useState(true);
  const [value, setValue] = useState(0);
  const [loadingUser, setLoadingUser] = useState(false);

  // paginação
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const payloadClear = {
    complete_name: '',
    email: '',
    first_document: '',
    person_type: '',
    gender: '',
    birth_date: '',
  };

  // hook de formatação
  const { formattedValue: formattedMonthlyIncome, handleValueChange: handleMonthlyIncomeChange } =
    useCurrencyFormatter(rFormData.monthly_income, (val) =>
      setRFormData((prev) => ({ ...prev, monthly_income: val })),
    );
  const { formattedValue: formattedProjectValue, handleValueChange: handleProjectValueChange } =
    useCurrencyFormatter(rFormData.project_value, (val) =>
      setRFormData((prev) => ({ ...prev, project_value: val })),
    );

  // fetch
  const fetchRequestSicoob = async () => {
    try {
      const res = await requestSicoob.index({
        page: page + 1,
        limit,
        expand: [
          'customer',
          'managing_partner',
          'requested_by.phone_numbers',
          'requested_by.employee.branch',
        ],
        fields: [
          '*',
          'customer.complete_name',
          'customer.person_type',
          'customer.email',
          'customer.first_document',
          'customer.gender',
          'customer.birth_date',
          'managing_partner.complete_name',
          'managing_partner.person_type',
          'managing_partner.email',
          'managing_partner.first_document',
          'managing_partner.gender',
          'managing_partner.birth_date',
          'requested_by.complete_name',
          'requested_by.phone_numbers.area_code',
          'requested_by.phone_numbers.phone_number',
          'requested_by.employee.branch.name',
          'requested_by.employee.branch.id',
        ],
        format: 'json',
      });
      setRows(res.results);
      setCount(res.meta.pagination.total_count);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRequestSicoob();
  }, [page, limit]);

  const handleAddAttachment = (attachment) => setAttachments((prev) => [...prev, attachment]);
  const handleChangeTab = (_, v) => setValue(v);
  const handleChangePage = (_, p) => setPage(p);
  const handleChangeRowsPerPage = (e) => {
    setLimit(+e.target.value);
    setPage(0);
  };

  // formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'person_type') {
      setFormData(payloadClear);
      setDisabled(false);
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };
  useEffect(() => {
    const { person_type, first_document } = formData;
    const needsLookup =
      (person_type === 'PF' && first_document?.length === 11) ||
      (person_type === 'PJ' && first_document?.length === 14);
    if (!needsLookup) return;
    setLoadingUser(true);
    userService
      .index({
        first_document__icontains: first_document,
        fields: ['id', 'first_document', 'complete_name', 'email', 'gender', 'birth_date'],
      })
      .then((r) => r.results)
      .then((found) => {
        if (!found.length) {
          enqueueSnackbar('Nenhum registro encontrado. Complete o cadastro.', {
            variant: 'warning',
          });
          setDisabled(false);
        } else {
          setFormData((p) => ({ ...p, ...found[0] }));
        }
      })
      .finally(() => setLoadingUser(false));
  }, [formData.first_document, formData.person_type]);

  // managing partner
  const handleChangeManaging = async (e) => {
    const { name, value } = e.target;
    if (name === 'person_type') {
      setFormDataManaging(payloadClear);
      setDisabledManaging(false);
    }
    if (name === 'first_document' && value.length >= 11) {
      const found = await userService
        .index({
          first_document__icontains: value,
          fields: ['id', 'first_document', 'complete_name', 'email', 'gender', 'birth_date'],
        })
        .then((r) => r.results);
      if (!found.length) {
        enqueueSnackbar('Nenhum registro encontrado. Complete o cadastro.', { variant: 'warning' });
        setDisabledManaging(false);
      } else {
        setFormDataManaging((p) => ({ ...p, ...found[0] }));
      }
    }
    setFormDataManaging((p) => ({ ...p, [name]: value }));
  };

  // rFormData: occupation + numéricos
  const handleChangeRFormData = (e) => {
    const { name, value } = e.target;
    setRFormData((p) => ({ ...p, [name]: value }));
  };

  // submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const custBody = {
        complete_name: formData.complete_name,
        email: formData.email,
        first_document: formData.first_document,
        person_type: formData.person_type,
        ...(formData.person_type === 'PF' && {
          gender: formData.gender,
          birth_date: formData.birth_date,
        }),
        user_types: [2],
      };
      const newCustomer = await userService.upInsert(formData.id ?? null, custBody);

      let newManaging = null;
      if (formData.person_type === 'PJ') {
        const mp = {
          complete_name: formDataManaging.complete_name,
          email: formDataManaging.email,
          first_document: formDataManaging.first_document,
          person_type: formDataManaging.person_type,
          gender: formDataManaging.gender,
          birth_date: formDataManaging.birth_date,
          user_types: [2],
        };
        newManaging = await userService.upInsert(formDataManaging.id ?? null, mp);
      }

      const payload = {
        occupation: rFormData.occupation,
        monthly_income: rFormData.monthly_income,
        project_value: rFormData.project_value,
        customer: newCustomer.id,
        managing_partner: newManaging?.id ?? null,
        requested_by: user.id,
        branch: user?.employee?.branch || null,
      };
      if (payload.project_value == null) {
        enqueueSnackbar('Valor do projeto inválido.', { variant: 'error' });
        setLoading(false);
        return;
      }

      const { id: recId } = await requestSicoob.create(payload);
      await Promise.all(
        attachments.map(({ file, description }) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('description', description);
          fd.append('object_id', recId);
          fd.append('content_type', 121);
          return attachmentService.create(fd);
        }),
      );

      setOpenSideDrawerCreate(false);
      fetchRequestSicoob();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(`Erro ao salvar: ${err?.message || err}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (status, id) => {
    try {
      await requestSicoob.update(id, { status });
      fetchRequestSicoob();
      enqueueSnackbar('Salvo com sucesso', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(`Erro ao salvar: ${err}`, { variant: 'error' });
    }
  };

  const getStatus = (s) => {
    switch (s) {
      case 'A':
        return <Chip label="Aprovado" color="success" />;
      case 'P':
        return <Chip label="Em análise" color="warning" />;
      case 'R':
        return <Chip label="Reprovado" color="error" />;
      case 'PA':
        return <Chip label="Pré-Aprovado" color="success" />;
      default:
        return <Chip label="Pendente" color="warning" />;
    }
  };

  const itemSelected = (r) => {
    setRow(r);
    setOpenSideDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenSideDrawerCreate(false);
    setFormData({});
    setFormDataManaging({});
    setRFormData({ occupation: '' });
    setAttachments([]);
    setDisabled(true);
    setDisabledManaging(true);
  };

  return (
    <Box>
      <Breadcrumb items={BCrumb} />

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => setOpenSideDrawerCreate(true)}>Nova Solicitação</Button>
      </Box>

      <BlankCard>
        {/* tabela… */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* cabeçalhos… */}
                <TableCell>
                  <Typography variant="h6">Contratante</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Natureza</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Valor do Projeto</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Sócio Adm.</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Solicitante</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Unidade</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} hover onClick={() => itemSelected(r)}>
                  <TableCell>{r.customer.complete_name}</TableCell>
                  <TableCell>{r.customer.person_type}</TableCell>
                  <TableCell>
                    {r.project_value != null && `R$ ${r.project_value.toLocaleString('pt-BR')}`}
                  </TableCell>
                  <TableCell>{r.managing_partner?.complete_name || 'Não Possui'}</TableCell>
                  <TableCell>{r.requested_by?.complete_name}</TableCell>
                  <TableCell>{r.requested_by?.employee?.branch?.name}</TableCell>
                  <TableCell>{getStatus(r.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </BlankCard>

      <SideDrawer open={openSideDrawer} onClose={() => setOpenSideDrawer(false)} title="Detalhes">
        {row && (
          <>
            <Tabs value={value} onChange={handleChangeTab}>
              <Tab label="Solicitação" value={0} />
              <Tab label="Comentários" value={1} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <DetailsFundingRequest data={row} handleChangeStatus={handleChangeStatus} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Comment appLabel="contracts" model="sicoobrequest" objectId={row.id} />
            </TabPanel>
          </>
        )}
      </SideDrawer>

      <SideDrawer open={openSideDrawerCreate} onClose={onCloseDrawer} title="Nova Solicitação">
        <CreateFundingRequest
          formData={formData}
          handleChange={handleChange}
          formDataManaging={formDataManaging}
          handleChangeManaging={handleChangeManaging}
          rFormData={rFormData}
          handleChangeRFormData={handleChangeRFormData}
          formattedMonthlyIncome={formattedMonthlyIncome}
          onMonthlyIncomeChange={handleMonthlyIncomeChange}
          formattedProjectValue={formattedProjectValue}
          onProjectValueChange={handleProjectValueChange}
          disabled={disabled}
          disabledManaging={disabledManaging}
          loadingUser={loadingUser}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
            <AttachmentDrawer
              objectId={null}
              attachments={attachments}
              onAddAttachment={handleAddAttachment}
              appLabel="contracts"
              model="sicoobrequest"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Criar'}
            </Button>
          </Stack>
        </CreateFundingRequest>
      </SideDrawer>
    </Box>
  );
}

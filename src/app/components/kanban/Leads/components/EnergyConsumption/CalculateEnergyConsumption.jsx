'use client';
import {
    Grid,
    Typography,
    Box,
    useTheme,
    MenuItem,
    InputAdornment,
    TextField,
    CircularProgress,
    Dialog,
    DialogContent,
} from '@mui/material';

import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import Button from "@mui/material/Button";
import useProposalForm from '@/hooks/proposal/useProposalForm';
import { useSelector } from 'react-redux';
import { removeProductFromLead, selectProductsByLead } from '@/store/products/customProducts';
import { useDispatch } from 'react-redux';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { Switch } from '@mui/material';
import { months } from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 

function EnergyConsumptionCalc({ leadId = null, onRefresh = null, onClose = null }) {
    const router = useRouter();
    const theme = useTheme();
    const [lead, setLead] = useState(null);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [mediumConsumptionResult, setMediumConsumptionResult] = useState("");

    const {
        formData,
        setFormData,
        handleChange,
        handleSave,
        formErrors,
        loading: formLoading,
        success,
    } = useProposalForm();

  const customProducts = useSelector(selectProductsByLead(leadId));

  formData.commercial_products_ids = customProducts.map((product) => product.id);
  formData.lead_id ? null : (formData.lead_id = leadId);
  formData.status ? null : (formData.status = 'P');
  user?.user ? (formData.created_by_id = user.user.id) : null;

  const discard_proposal = () => {
    dispatch(
      removeProductFromLead({ leadId, productIds: customProducts.map((product) => product.id) }),
    );
    handleChange('due_date', null);
    handleChange('value', null);
    handleChange('proposal_description', '');
  };

  useEffect(() => {
    if (success) {
      enqueueSnackbar('Proposta gerada com sucesso', { variant: 'success' });
      discard_proposal();
    }
  }, [success]);

  useEffect(() => {
    const fetchLead = async () => {
      setLoadingLeads(true);
      try {
        const data = await leadService.find(leadId);
        setLead(data);
        console.log(data);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      } finally {
        setLoadingLeads(false);
      }
    };
    fetchLead();
  }, []);

  const handleSaveForm = async () => {
    const response = await handleSave();
    if (response) {
      enqueueSnackbar('Proposta atualizada com sucesso', { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } else {
      enqueueSnackbar('Erro ao atualizar proposta', { variant: 'error' });
      console.log('Form Errors:', formErrors);
    }
  };

    const handleInputChange = (e) => {
        setFormData({ ...formData, medimum_consumption: e.target.value });
    };

    const handleFieldClick = () => {
        setOpenDialog(true);
    }

    // medium calc logic
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [averageConsuption, setAverageConsuption] = useState(null);

    const handleStartDateChange = (date) => setStartDate(date);
    const handleEndDateChange = (date) => setEndDate(date);

    const generateMonths = () => {
        if (startDate && endDate) {
            const months = [];
            let current = new Date(startDate);

            while (current <= endDate) {
                months.push(new Date(current));
                current.setMonth(current.getMonth() + 1);
            }

            return months;
        }

        return [];
    }

    const handleMonthInputChange = (month, value) => {
        setInputValues({ ...inputValues, [month]: value });
    };

    const calculateAverage = () => {
        const values = Object.values(inputValues);
        if (values.length === 0) return;
        const total = values.reduce((acc, value) => acc + parseFloat(value || 0), 0);
        const average = total / values.length;
        setAverageConsuption(average);
    }

    const months = generateMonths();



    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >

                    <Grid container spacing={0}>
                        <Grid
                            item
                            xs={12}
                            sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}
                        >
                            <Grid item xs={12} sm={4}>
                                <Typography variant="h6" sx={{ color: "#000000", fontWeight: "700", fontSize: "18px" }}>Calcular consumo energético</Typography>
                            </Grid>


                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
                                <Grid item xs={12} sx={{ mt: "24px" }} >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            border: "2px solid",
                                            borderStyle: "dashed",
                                            borderColor: theme.palette.primary.main,
                                            borderRadius: 1,
                                            p: 4,
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.main,
                                                borderColor: "#FFFFFF",
                                                "& .MuiTypography-root": { color: "#FFFFFF" },
                                                "& .MuiSvgIcon-root": { color: "#FFFFFF" },
                                            },
                                        }}
                                        onClick={() => console.log("Uploading file")}
                                    >
                                        <BackupOutlinedIcon sx={{ fontSize: "36px" }} />
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 1 }}>
                                            <Typography sx={{ fontSize: '14px', fontWeight: "400", color: "#0B0B0B" }}>
                                                Carregar conta de luz
                                            </Typography>
                                            <Typography sx={{ fontSize: '14px', fontWeight: "600", color: theme.palette.primary.main }}>
                                                Upload
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '14px', fontWeight: "400", color: "#6D6D6D" }}>
                                            Tamanho máximo do arquivo 10 MB
                                        </Typography>

                                    </Button>
                                </Grid>

                            </Grid>

                            <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
                                <Grid item xs={12} sx={{ mt: 2, mb: 0 }}>
                                    <Typography sx={{ color: "#000000", fontWeight: "400", fontSize: "18px" }}>Consumo energético</Typography>
                                </Grid>
                            </Grid>

                            <Grid container rowSpacing={0} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mt: 0 }} >
                                <Grid item xs={3}>
                                    <CustomFormLabel
                                        htmlFor="medimum_consumption"
                                        sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                                    >
                                        Consumo médio mensal
                                    </CustomFormLabel>
                                    <TextField
                                        name="medimum_consumption"
                                        value={formData.medimum_consumption}
                                        onClick={handleFieldClick}
                                        onChange={handleInputChange}
                                        fullWidth
                                        disabled={openDialog}
                                        InputProps={{
                                            sx: {
                                                input: {
                                                    color: "#7E92A2",
                                                    fontWeight: "400",
                                                    fontSize: "12px",
                                                    opacity: 1,
                                                },
                                            },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Box sx={{ color: "#7E92A2", fontWeight: "400", fontSize: "12px" }}>
                                                        kWh
                                                    </Box>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                <Grid item xs={3}>
                  <CustomFormLabel
                    htmlFor="consumer_unity"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Unidade consumidora
                  </CustomFormLabel>
                  <TextField
                    name="consumer_unity"
                    value={formData.medium_energy_val}
                    onChange={(e) => handleChange('consumer_unity', e.target.value)}
                    fullWidth
                    // placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          color: '#7E92A2',
                          fontWeight: '400',
                          fontSize: '12px',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <CustomFormLabel
                    htmlFor="meter_number"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Número do medidor
                  </CustomFormLabel>
                  <TextField
                    name="meter_number"
                    value={formData.meter_number}
                    onChange={(e) => handleChange('meter_number', e.target.value)}
                    fullWidth
                    // placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          color: '#7E92A2',
                          fontWeight: '400',
                          fontSize: '12px',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="dealership"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Concessionária
                  </CustomFormLabel>
                  <TextField
                    select
                    name="dealership"
                    value={formData.dealership}
                    onChange={(e) => handleChange('dealership', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="enel">ENEL</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={2}>
                  <CustomFormLabel
                    htmlFor="power_phase"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Fase energética
                  </CustomFormLabel>
                  <TextField
                    select
                    name="power_phase"
                    value={formData.power_phase}
                    onChange={(e) => handleChange('power_phase', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="bi">Bifásica</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={5}>
                  <CustomFormLabel
                    htmlFor="kwh_value"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Valor do kWh
                  </CustomFormLabel>
                  <TextField
                    name="kwh_value"
                    value={formData.medium_energy_val}
                    onChange={(e) => handleChange('kwh_value', e.target.value)}
                    fullWidth
                    // placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          color: '#7E92A2',
                          fontWeight: '400',
                          fontSize: '12px',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={5}>
                  <CustomFormLabel
                    htmlFor="electricity_bill"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Valor da Conta de Energia
                  </CustomFormLabel>
                  <TextField
                    name="electricity_bill"
                    value={formData.electricity_bill}
                    onChange={(e) => handleChange('electricity_bill', e.target.value)}
                    fullWidth
                    // placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          color: '#7E92A2',
                          fontWeight: '400',
                          fontSize: '12px',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="public_lighting_charge"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Valor da Iluminação Pública
                  </CustomFormLabel>
                  <TextField
                    name="public_lighting_charge"
                    value={formData.public_lighting_charge}
                    onChange={(e) => handleChange('public_lighting_charge', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: '#7E92A2', fontWeight: '400', fontSize: '12px' }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="availability_charge"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Valor da Disponibilidade
                  </CustomFormLabel>
                  <TextField
                    name="availability_charge"
                    value={formData.availability_charge}
                    onChange={(e) => handleChange('availability_charge', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: '#7E92A2', fontWeight: '400', fontSize: '12px' }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="b_wire_value"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Valor do TUSD Fio B
                  </CustomFormLabel>
                  <TextField
                    name="b_wire_value"
                    value={formData.b_wire_value}
                    onChange={(e) => handleChange('b_wire_value', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: '#7E92A2', fontWeight: '400', fontSize: '12px' }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ alignItems: 'flex-end', justifyContent: 'center' }}
              >
                <Grid item xs={1.5}>
                  <CustomFormLabel
                    htmlFor="shadowing"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Sombreamento
                  </CustomFormLabel>

                                    <Switch
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                        color="primary"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#FDCB02',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#FDCB02',
                                            },
                                            '& .MuiSwitch-track': {
                                                backgroundColor: '#ccc',
                                            },
                                        }}
                                    />
                                    {/* <Typography sx={{ color: '#7E92A2', fontSize: '14px', fontWeight: 400 }}>
                                        {checked ? 'Sim' : 'Não'}
                                    </Typography> */}
                </Grid>

                                <Grid item xs={2.5}>
                                    <CustomFormLabel htmlFor="roof_type" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>
                                        Tipo de estrutura
                                    </CustomFormLabel>
                                    <TextField
                                        select
                                        name="roof_type"
                                        value={formData.roof_type}
                                        onChange={(e) => handleChange('roof_type', e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="solo">Estrutura de solo</MenuItem>
                                        <MenuItem value="laje">Estrutura de laje</MenuItem>
                                        <MenuItem value="colonial">Telha colonial</MenuItem>
                                        <MenuItem value="fibrocimento">Telha fibrocimento</MenuItem>
                                        <MenuItem value="ecológica">Telha ecológica</MenuItem>
                                        <MenuItem value="metálica">Telha metálica</MenuItem>

                                    </TextField>
                                </Grid>

                <Grid item xs={3}>
                  <CustomFormLabel
                    htmlFor="estimated_generation"
                    sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}
                  >
                    Geração de energia estimada
                  </CustomFormLabel>
                  <TextField
                    name="estimated_generation"
                    value={formData.estimated_generation}
                    onChange={(e) => handleChange('estimated_generation', e.target.value)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <RotateLeftOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': { backgroundColor: '#333' },
                                            px: 3,
                                        }}
                                        endIcon={<BoltOutlinedIcon sx={{ ml: 1 }} />}
                                    >
                                        <Typography variant="body1">Calcular geração de energia estimada</Typography>
                                    </Button>
                                </Grid>

                                <Grid item xs={1}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: theme.palette.primary.Button,
                                                color: '#303030',
                                                px: 3
                                            }}
                                            onClick={handleSaveForm}
                                            disabled={formLoading}
                                            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                                        >
                                            <Typography variant="body1" color="#303030">
                                                {formLoading ? 'Salvando proposta...' : 'Salvar'}
                                            </Typography>
                                        </Button>

                                    </Box>
                                </Grid>

                            </Grid>


                            <Dialog
                                open={openDialog}
                                onClose={() => setOpenDialog(false)}
                                PaperProps={{
                                    sx: {
                                        borderRadius: '20px',
                                        padding: '24px',
                                        gap: '24px',
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                    }
                                }}
                            >
                                {/* <DialogTitle>Histórico de Consumo</DialogTitle> */}
                                <DialogContent>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography sx={{ color: "#000000", fontWeight: "700", fontSize: "18px" }}>Histórico de Consumo</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
                                                <Grid item xs={12} sx={{mb: 2}}>
                                                    <Typography sx={{ color: "#000000", fontWeight: "700", fontSize: "16px" }}>Período</Typography>
                                                </Grid>
                                                <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                                    <Grid item xs={5}>
                                                        <DatePicker
                                                            value={startDate}
                                                            onChange={handleStartDateChange}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    fullWidth
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        startAdornment: (
                                                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.main }}>
                                                                                <CalendarTodayIcon sx={{ fontSize: 25 }} /> 
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                            format="dd/MM/yyyy"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <Typography sx={{ color: "#ADADAD", fontWeight: "400", fontSize: "16px" }}>à</Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <DatePicker
                                                            value={endDate}
                                                            onChange={handleEndDateChange}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    fullWidth
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        startAdornment: (
                                                                            <InputAdornment position="start" sx={{ color: theme.palette.primary.main }}>
                                                                                <CalendarTodayIcon sx={{ fontSize: 25 }} /> 
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                            format="dd/MM/yyyy"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {months.length > 0 && (
                                                    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 2 }}>
                                                        <Grid container sx={{ justifyContent: "center" }}>
                                                            {months.map((month, index) => {
                                                                const monthLabel = month.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                                                                return (
                                                                    <Grid item columnSpacing={0} xs={12} key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
                                                                            <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                                                                                <CustomFormLabel
                                                                                    htmlFor="estimated_generation"
                                                                                    sx={{
                                                                                        color: "#7E8388",
                                                                                        fontWeight: "700",
                                                                                        fontSize: "14px",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "flex-start",
                                                                                        mb: 3
                                                                                    }}
                                                                                >
                                                                                    {monthLabel}
                                                                                </CustomFormLabel>
                                                                            </Grid>
                                                                            <Grid item xs={8} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                                                                <TextField
                                                                                    value={inputValues[monthLabel]}
                                                                                    onChange={(e) => handleMonthInputChange(monthLabel, e.target.value)}
                                                                                    type="number"
                                                                                    InputProps={{
                                                                                        sx: {
                                                                                            input: {
                                                                                                color: "#7E92A2",
                                                                                                fontWeight: "400",
                                                                                                fontSize: "12px",
                                                                                                opacity: 1,
                                                                                                width: "265px"
                                                                                            },
                                                                                        },
                                                                                        endAdornment: (
                                                                                            <InputAdornment position="end">
                                                                                                <Box>
                                                                                                    <Typography sx={{ color: "#7E92A2", fontWeight: "400", fontSize: "16px" }}>kWh</Typography>
                                                                                                </Box>
                                                                                            </InputAdornment>
                                                                                        ),
                                                                                    }}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                );
                                                            })}
                                                        </Grid>
                                                    </Grid>
                                                )}

                                            </Grid>


                                        </Grid>
                                    </LocalizationProvider>
                                </DialogContent>
                            </Dialog>

                        </Grid>

                    </Grid>

                </Box>
            </Grid>
        </Grid>
    );
}

export default EnergyConsumptionCalc;

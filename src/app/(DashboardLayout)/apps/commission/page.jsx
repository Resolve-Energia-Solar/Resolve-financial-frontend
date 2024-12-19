'use client'
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { Tab, Typography } from '@mui/material';
import TabPanel from '@/app/components/apps/commission/TabPainel';
import { useEffect, useState } from 'react';
import Sale from '@/app/components/apps/commission/Sale';
import Commission from '@/app/components/apps/commission/Commission';
import Releases from '@/app/components/apps/commission/Releases';
import Debtor from '@/app/components/apps/commission/Debtor';
import commissionService from '@/services/commissionService';
import saleService from '@/services/saleService';
import { ThreeMp } from '@mui/icons-material';
import ThemeColors from '@/utils/theme/ThemeColors';
import theme from '@/utils/theme';


function createData(id, statcommi, name, datac, statvistoria, statusdoc, statusfinanceiro, unidade, especpagam, valprojeto) {
  return { id, statcommi, name, datac, statvistoria, statusdoc, statusfinanceiro, unidade, especpagam, valprojeto };
}

const rows = [
  createData(1, 'Finalizado', 'Maximus', '26/12/2023', 'Aprovado', 'Finalizado', 'Liquidado', 'Umarizal', 'Sol Agora', 26456.00),
  createData(2, 'Bloqueaado', 'Alpha', '10/01/2024', 'Pendente', 'Em andamento', 'Em aberto', 'Belém', 'Sol Agora', 12345.00),
  createData(3, 'Finalizado', 'Beta', '15/01/2024', 'Aprovado', 'Finalizado', 'Liquidado', 'Ananindeua', 'Sol Agora', 18567.00),
  createData(4, 'Bloqueado', 'Gamma', '20/01/2024', 'Aguardando', 'Em andamento', 'Em aberto', 'Marituba', 'Sol Agora', 22890.00),
  createData(5, 'Finalizado', 'Delta', '25/01/2024', 'Aprovado', 'Finalizado', 'Liquidado', 'Santarém', 'Sol Agora', 30123.00),
  createData(6, 'Bloqueado', 'Epsilon', '05/02/2024', 'Pendente', 'Em andamento', 'Em aberto', 'Castanhal', 'Sol Agora', 14670.00),
  createData(7, 'Finalizado', 'Zeta', '10/02/2024', 'Aprovado', 'Finalizado', 'Liquidado', 'Marabá', 'Sol Agora', 25340.00),
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function commission() {

  const [value, setValue] = useState(0);
  const [sale, setSale] = useState([])
  const [comissions, setComissions] = useState([])

  useEffect(() => {

    const fectchSaleAll = async () => {
      const saleData = await saleService.getSales({ ordering: 'asc' })
      setSale(saleData.results)
    }

    const fectchComissionAll = async () => {
      const commissionData = await commissionService.getCommissiomAll()
      setComissions(commissionData.results)
    }

    fectchComissionAll()
    fectchSaleAll()
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <Box sx={{ p: 2, alignItems: 'center'}}>

      <Box sx={{ p: 2, boxShadow: 2, borderRadius: '10px', backgroundColor: theme.palette.secondary.main, padding: '25px', width: '96%', margin: 'auto'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab sx={{ color: theme.palette.secondary.contrastText }} label="Vendas"  {...a11yProps(0)} />
          <Tab sx={{ color: theme.palette.secondary.contrastText }} label="Comissão"{...a11yProps(1)} />
          <Tab sx={{ color: theme.palette.secondary.contrastText }} label="Lançamentos" {...a11yProps(2)} />
          <Tab sx={{ color: theme.palette.secondary.contrastText }} label="Saldo devedor" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0} >
        <Sale data={sale} />
      </TabPanel>

      <TabPanel value={value} index={1} >
        <Commission data={comissions} />
      </TabPanel>

      <TabPanel value={value} index={2} >
        <Releases data={comissions} />
      </TabPanel>

      <TabPanel value={value} index={3} >
        <Debtor data={rows} />

      </TabPanel>
    </Box>

  )
}

export default commission;
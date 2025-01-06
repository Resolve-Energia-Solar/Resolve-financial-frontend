import { Box } from "@mui/system";
import Header from "./Header";
import { Button, Menu, MenuItem, Option, Paper, Select, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const steps = [
    {
        label: 'Anexar documentos',
        description: `Garanta que todos os documentos necessários para o avanço do projeto do cliente estejam anexados`,
    },
    {
        label: 'Vincular Vistoria',
        description: `Apenas uma vistoria pode ser vincula`,
    },
    {
        label: 'Alterar Status',
        description:
            'Altere o Status da documentação',
    }
];

export default function Contract({ data }) {

    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState();

    useEffect(() => {
        if (data.objectId) {
            setActiveStep(4)
        }
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return <>
        <Header data={data} />
        <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4">Atividades para conclusão da Tarefa</Typography>
            </Box>
            <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step >
                        <StepLabel>
                            Validar documentos
                        </StepLabel>
                        <StepContent>
                            <Typography>
                                Garanta que todos os documentos necessários para o avanço do projeto do cliente estejam anexados
                            </Typography>
                            <Box sx={{ marginBlock: 6 }}>

                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Continuar
                                </Button>

                            </Box>
                        </StepContent>
                    </Step>

                    <Step >
                        <StepLabel>
                            Vincular Vistoria
                        </StepLabel>
                        <StepContent>
                            <Typography>
                                Apenas uma vistoria pode ser vincula
                            </Typography>
                            <Box sx={{ marginBlock: 6 }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Continuar
                                </Button>
                                <Button
                                    disabled={1 === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Voltar
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>

                    <Step >
                        <StepLabel optional={<Typography variant="caption">Última Etapa</Typography>}>
                            Alterar Status
                        </StepLabel>
                        <StepContent>
                            <Typography>
                                Altere o Status da documentação
                            </Typography>
                            <Box sx={{ marginBlock: 6 }}>
                                <Select value={''} fullWidth>
                                    <MenuItem value={1}>Pendente</MenuItem>
                                    <MenuItem value={2}>Em andamento</MenuItem>
                                    <MenuItem value={3}>Concluído</MenuItem>
                                </Select>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Concluir
                                </Button>
                                <Button
                                    disabled={1 === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Voltar
                                </Button>
                            </Box>
                        </StepContent>
                    </Step>

                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>Todas as etapas foram concluídas.</Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    </>
}
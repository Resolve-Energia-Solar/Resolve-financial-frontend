import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import processService from '@/services/processService';
import { useSnackbar } from 'notistack';
import UserBadge from '../apps/users/userBadge';
import { useSelector } from 'react-redux';

function getLevel(step, stepsMap, memo = {}) {
    if (memo[step.step_id]) return memo[step.step_id];
    if (!step.dependencies || step.dependencies.length === 0) {
        memo[step.step_id] = 0;
        return 0;
    }
    let maxLevel = 0;
    step.dependencies.forEach(depId => {
        const dep = stepsMap[depId];
        if (dep) {
            const depLevel = getLevel(dep, stepsMap, memo);
            if (depLevel > maxLevel) {
                maxLevel = depLevel;
            }
        }
    });
    memo[step.step_id] = maxLevel + 1;
    return maxLevel + 1;
}

// Função que interpola de verde para vermelho com base no progresso (0 a 1)
function interpolateColor(progress) {
    const r = Math.round(76 + (244 - 76) * progress);
    const g = Math.round(175 + (67 - 175) * progress);
    const b = Math.round(80 + (54 - 80) * progress);
    return `rgb(${r}, ${g}, ${b})`;
}

function ProcessMap({ processId }) {
    const [processData, setProcessData] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(null);
    const user = useSelector((state) => state.user?.user);
    const userGroups = user?.groups || [];

    const handleNodeClick = (stepId) => {
        stepId = parseInt(stepId);
        if (isNaN(stepId) || !processData) return;

        const step = processData.steps.find(s => s.step_id === stepId);
        if (!step) return;

        if (step.is_completed) {
            enqueueSnackbar("Esta etapa já foi concluída.", { variant: 'info' });
            return;
        }

        const stepsMap = {};
        processData.steps.forEach(s => {
            stepsMap[s.step_id] = s;
        });

        const dependencies = step.dependencies || [];
        const depsCompleted = dependencies.every(depId => {
            const dep = stepsMap[depId];
            return dep && dep.is_completed;
        });
        if (!depsCompleted) {
            enqueueSnackbar("Esta etapa não pode ser concluída porque uma ou mais dependências ainda não foram finalizadas.", { variant: 'info' });
            return;
        }

        if (!userGroups.some(groupId => (step.allowed_groups || []).includes(groupId))) {
            enqueueSnackbar("Você não possui permissão para concluir esta etapa.", { variant: 'info' });
            return;
        }

        setCurrentStep(step);
        setOpenModal(true);
    };

    const handleConfirmCompletion = () => {
        if (currentStep) {

            if (!user) {
                enqueueSnackbar("Usuário não encontrado", { variant: 'error' });
                return;
            }

            const requestBody = {
                user_id: user.id,
            };

            processService.completeStep(processId, currentStep.step_id, requestBody)
                .then(() => {
                    enqueueSnackbar(`Etapa '${currentStep.step.name}' concluída com sucesso!`, { variant: 'success' });
                    setOpenModal(false);
                    setProcessData(prev => {
                        const updatedSteps = prev.steps.map(step =>
                            step.step_id === currentStep.step_id ? { ...step, is_completed: true, completion_date: new Date() } : step
                        );
                        return { ...prev, steps: updatedSteps };
                    });
                })
                .catch(error => {
                    enqueueSnackbar(`Erro ao concluir a etapa: ${error}`, { variant: 'error' });
                });
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        try {
            const fetchProcessData = async () => {
                const data = await processService.find(processId);
                setProcessData(data);
            };
            fetchProcessData();
        }
        catch (error) {
            console.error('Erro ao buscar dados do processo:', error);
            enqueueSnackbar(`Erro ao buscar dados do processo: ${error}`, { variant: 'error' });
        }
    }, [processId]);

    useEffect(() => {
        if (!processData) return;

        const diameter = 80;
        const strokeWidth = 6;
        const radius = (diameter - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const verticalSpacing = 200;
        const horizontalSpacing = 100;
        const baseX = 0;

        const stepsMap = {};
        processData.steps.forEach(step => {
            stepsMap[step.step_id] = step;
        });

        const levelMapping = {};
        const levels = {};
        let maxLevel = 0;
        processData.steps.forEach(step => {
            const level = getLevel(step, stepsMap);
            levelMapping[step.step_id] = level;
            if (!levels[level]) levels[level] = [];
            levels[level].push(step);
            if (level > maxLevel) maxLevel = level;
        });

        function renderNodeContent(step) {
            const allDepsFinished = (step.dependencies.length === 0) ||
                step.dependencies.every(depId => {
                    const dep = stepsMap[depId];
                    return dep && dep.is_completed;
                });

            let progress = 0;
            let prazoMs = 0;
            let latestDate = 0;

            if (step.dependencies.length > 0) {
                step.dependencies.forEach(depId => {
                    const dep = stepsMap[depId];
                    if (dep && dep.completion_date) {
                        const t = new Date(dep.completion_date).getTime();
                        if (t > latestDate) latestDate = t;
                    }
                });
                prazoMs = step.deadline_days * 24 * 60 * 60 * 1000;
            } else {
                latestDate = new Date(processData.data_criacao).getTime();
                prazoMs = step.deadline_days * 24 * 60 * 60 * 1000;
            }

            let borderColor;
            if (step.is_completed && step.completion_date) {
                // Se a tarefa estiver concluída, congelamos o progresso na data de conclusão
                const completionTime = new Date(step.completion_date).getTime();
                progress = (completionTime - latestDate) / prazoMs;
                // Se concluída dentro do prazo, forçamos o verde
                if (progress <= 1) {
                    borderColor = 'green';
                } else {
                    borderColor = interpolateColor(progress);
                }
            } else if (allDepsFinished && step.dependencies.length > 0) {
                const now = new Date().getTime();
                progress = (now - latestDate) / prazoMs;
                borderColor = interpolateColor(progress);
            } else {
                progress = 0;
                borderColor = 'gray';
            }

            // Garantir que progress esteja entre 0 e 1
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            let icon;
            if (step.is_completed) {
                icon = <CheckCircleIcon style={{ color: 'green', fontSize: 32 }} />;
            } else if (allDepsFinished) {
                icon = <AccessTimeIcon style={{ color: 'orange', fontSize: 32 }} />;
            } else {
                icon = <LockIcon style={{ color: 'gray', fontSize: 32 }} />;
            }

            const tooltipTitle = (
                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid item xs={8}>
                        <Typography variant="body1">
                            <strong>Descrição:</strong> {step.description || "Sem descrição"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Prazo:</strong> {step.deadline_days} dias
                        </Typography>
                        <Typography variant="body1">
                            <strong>Concluído:</strong> {step.is_completed ? 'Sim' : 'Não'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Data Conclusão:</strong> {step.completion_date ? new Date(step.completion_date).toLocaleString('pt-BR') : 'Pendente'}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <UserBadge userId={step.user_id} showEmail={false} backgroundColor={"#FFFFFF"} />
                    </Grid>
                </Grid>
            );

            return (
                <Tooltip
                    title={tooltipTitle}
                    arrow
                    placement="top"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                minWidth: 520,
                                minHeight: 120,
                                fontSize: "1.1rem",
                                padding: "16px",
                                backgroundColor: "rgba(97, 97, 97, 0.95)",
                                "& .MuiTooltip-arrow": {
                                    color: "rgba(97, 97, 97, 0.95)"
                                }
                            }
                        }
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: diameter, height: diameter }}>
                            <svg
                                style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
                                width={diameter}
                                height={diameter}
                            >
                                <circle
                                    cx={diameter / 2}
                                    cy={diameter / 2}
                                    r={radius}
                                    stroke="#eee"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                                <circle
                                    cx={diameter / 2}
                                    cy={diameter / 2}
                                    r={radius}
                                    stroke={borderColor}
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - progress)}
                                />
                            </svg>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: diameter,
                                    height: diameter,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {icon}
                            </div>
                        </div>
                        <Typography variant="h6" style={{ marginTop: 4, textAlign: 'center' }}>
                            {step.step.name}
                        </Typography>
                    </div>
                </Tooltip>
            );
        }

        const levelPositions = {};
        const newNodes = [];
        for (let level = 0; level <= maxLevel; level++) {
            const stepsNoNivel = levels[level];
            if (!stepsNoNivel) continue;

            let prevCenterX = 0;
            if (level > 0 && levelPositions[level - 1]) {
                const { minX, maxX } = levelPositions[level - 1];
                prevCenterX = (minX + maxX) / 2;
            }

            const count = stepsNoNivel.length;
            const totalWidth = count * diameter + (count - 1) * horizontalSpacing;
            let startX = level === 0 ? baseX : prevCenterX - totalWidth / 2;

            let minX = Infinity, maxX = -Infinity;
            stepsNoNivel.forEach((step, idx) => {
                const xPos = startX + idx * (diameter + horizontalSpacing);
                const yPos = level * verticalSpacing;
                if (xPos < minX) minX = xPos;
                if (xPos + diameter > maxX) maxX = xPos + diameter;
                newNodes.push({
                    id: step.id.toString(),
                    data: { label: renderNodeContent(step) },
                    position: { x: xPos, y: yPos },
                    onClick: () => handleNodeClick(step),
                    style: { width: diameter + 70, height: diameter + 70, border: 'none', background: 'none' }
                });
            });
            levelPositions[level] = { minX, maxX };
        }

        const newEdges = [];
        processData.steps.forEach(step => {
            step.dependencies.forEach(dep => {
                newEdges.push({
                    id: `e${dep}-${step.step_id}`,
                    source: dep.toString(),
                    target: step.id.toString(),
                    animated: true
                });
            });
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [processData]);

    if (!processData) return <div>Carregando...</div>;

    return (
        <Box style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={(event, node) => handleNodeClick(node.id)}
                fitView>
                <Controls />
                <Background />
            </ReactFlow>

            {/* Modal de confirmação */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Conclusão</DialogTitle>
                <DialogContent>
                    <Typography>Você deseja marcar a etapa "{currentStep?.name}" como concluída?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Cancelar</Button>
                    <Button onClick={handleConfirmCompletion} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ProcessMap;

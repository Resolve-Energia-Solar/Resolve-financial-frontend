import React from 'react';
import {
    Grid,
    Typography,
    TextField,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Box,
    Button,
} from '@mui/material';
import { AttachFile, Delete, Visibility, Add, DeleteOutlined as DeleteOutlinedIcon } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

const UnitiesCardComponent = ({
    title,
    formData,
    onChange,
    documents,
    handleFileUpload,
    handleRemoveDocument,
    discardCard,
}) => {
    return (
        <BlankCard sx={{ borderRadius: '20px', boxShadow: 3, px: 4 }}>
            <Grid
                container
                alignItems={'center'}
                spacing={0}
                justifyContent={'space-between'}
                sx={{ minHeight: 300, p: 3 }}
            >

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Grid item xs={0.5}>
                        <img
                            src={'/images/svgs/solar-panel-icon-with-circle.png'}
                            alt={'solar panel icon'}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 0,
                                mr: 1,
                            }}
                        />
                    </Grid>

                    <Grid item xs={11.5} >
                        <Typography sx={{ fontWeight: '700', fontSize: "14px" }}>{title}</Typography>
                    </Grid>
                </Grid>


                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={2}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>CEP</CustomFormLabel>
                        <TextField
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={(e) => onChange('zip_code', e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Logradouro</CustomFormLabel>
                        <TextField
                            name="street"
                            value={formData.street}
                            onChange={(e) => onChange('street', e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Nº</CustomFormLabel>
                        <TextField
                            name="number"
                            value={formData.number}
                            onChange={(e) => onChange('number', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Complemento</CustomFormLabel>
                        <TextField
                            name="complement"
                            value={formData.complement}
                            onChange={(e) => onChange('complement', e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Bairro</CustomFormLabel>
                        <TextField
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={(e) => onChange('neighborhood', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Cidade</CustomFormLabel>
                        <TextField
                            name="city"
                            value={formData.city}
                            onChange={(e) => onChange('city', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <CustomFormLabel sx={{ color: '#092C4C', fontWeight: '700', fontSize: '14px' }}>Estado</CustomFormLabel>
                        <TextField
                            name="state"
                            value={formData.state}
                            onChange={(e) => onChange('state', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>


                <Grid container spacing={2} sx={{ mt: 3 }}>

                    <Grid item xs={12}>
                        <Typography sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>
                            Conta de Luz
                        </Typography>
                    </Grid>

                    {documents.map((doc, index) => (
                        <Grid item xs={12} key={index}>
                            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '10px', border: '1px solid #E0E0E0' }}>
                                <AttachFile sx={{ color: '#FF3D00', mr: 2 }} />
                                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                                    <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>{doc.name}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#7E8388' }}>{doc.size}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton sx={{ color: '#7E8388' }} onClick={() => handleRemoveDocument(index)}>
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>


                <Grid item xs={12}>
                    <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                    <label htmlFor="file-upload">
                        <Button startIcon={<Add />} component="span" sx={{ fontSize: '14px', textTransform: 'none' }}>
                            Anexar documento
                        </Button>
                    </label>
                </Grid>

     
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="error" sx={{ px: 3 }} onClick={discardCard}>
                        <Typography variant="body1" sx={{ mr: 1 }}>Excluir</Typography>
                        <DeleteOutlinedIcon />
                    </Button>
                </Grid>
            </Grid>
        </BlankCard>
    );
};

export default UnitiesCardComponent;

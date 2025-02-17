'use client';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { formatDateTime, formatDate, formatTime } from '@/utils/inspectionFormatDate';
import { useEffect, useState } from 'react';
import answerService from '@/services/answerService';

const AnswerForm = ({ answerData }) => {
  console.log('answerData ->', answerData);

  const [form_fields, setFormFields] = useState([]);
  const [formInfo, setFormInfo] = useState(answerData?.results[0]?.form);
  const [answers, setAnswers] = useState(answerData?.results[0]?.answers);
  const [answersFiles, setAnswersFiles] = useState([]);

  const answerFromField = (fieldName) => {
    if (!answers) return null;
    return answers[fieldName];
  };

  const normalizeValue = (value, isMultiple) => {
    if (isMultiple) {
      if (Array.isArray(value)) {
        return value;
      } else if (value != null) {
        return [value];
      } else {
        return [];
      }
    }
    return value || '';
  };

  useEffect(() => {
    try {
      if (answerData) {
        setFormFields(JSON.parse(answerData?.results[0]?.form?.fields));
      }
    } catch (error) {
      console.error('Erro ao buscar campos do formulário', error);
    }
  }, [answerData]);

  useEffect(() => {
    const fetchAnswersFiles = async () => {
      try {
        if (answerData?.results[0]?.id) {
          const files = await answerService.getAnswerFormFiles(answerData?.results[0]?.id, {
            limit: 50,
          });
          setAnswersFiles(files.results);
        }
      } catch (error) {
        console.error('Erro ao buscar arquivos do formulário', error);
      }
    };

    fetchAnswersFiles();
  }, [answerData]);

  console.log('answersFiles ->', answersFiles);

  return (
    <Paper variant="outlined" sx={{ marginTop: 2 }}>
      <Box p={3} display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" sx={{ marginBottom: '15px' }}>
          Resposta do Serviço
        </Typography>
        <Divider />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          my={1}
        >
          {formInfo && (
            <Typography variant="h5">
              # {formInfo.id} - {formInfo.name}
            </Typography>
          )}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2">Respondido em: </Typography>
            <Chip
              size="small"
              color="secondary"
              variant="outlined"
              label={formatDateTime(answerData?.results[0]?.created_at)}
            ></Chip>
          </Box>
        </Stack>
        <Divider />
        <Box mt={1}>
          {form_fields.map((field) => {
            switch (field.type) {
              case 'text':
              case 'ariaText':
              case 'email':
              case 'number':
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    p={2}
                    key={field.id}
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {answerFromField(`${field.type}-${field.id}`) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'select':
                const rawValue = answerFromField(`${field.type}-${field.id}`);
                const normalizedValue = normalizeValue(rawValue, field.multiple);

                if (field.multiple) {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      p={2}
                      key={field.id}
                      sx={{ alignItems: 'center', width: '100%' }}
                    >
                      <Typography variant="h5">{field.label}:</Typography>
                      <CustomSelect
                        id={`${field.type}-${field.id}`}
                        name={`${field.type}-${field.id}`}
                        variant="standard"
                        disabled
                        value={normalizedValue}
                        multiple
                        width="100%"
                      >
                        {field.options.map((option) => (
                          <MenuItem key={option.id} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </Grid>
                  );
                }
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    p={2}
                    key={field.id}
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography variant="h5">{field.label}:</Typography>
                    <CustomSelect
                      id={`${field.type}-${field.id}`}
                      name={`${field.type}-${field.id}`}
                      variant="standard"
                      disabled
                      value={normalizedValue}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </Grid>
                );

              case 'date':
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    p={2}
                    key={field.id}
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {formatDate(answerFromField(`${field.type}-${field.id}`)) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'time':
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    p={2}
                    key={field.id}
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {formatTime(answerFromField(`${field.type}-${field.id}`)) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'file':
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    p={2}
                    key={field.id}
                    sx={{ alignItems: 'center', width: '100%' }}
                  >
                    <Typography variant="h5">{field.label}:</Typography>
                    {answersFiles.map((file) =>
                      file.field_id === `${field.type}-${field.id}`
                        ? (() => {
                            const url = file.file;
                            const urlSplitted = url.split('?')[0].split('.');
                            const ext = urlSplitted[urlSplitted.length - 1];

                            switch (ext.toLowerCase()) {
                              case 'jpg':
                              case 'jpeg':
                              case 'png':
                                return (
                                  <Box
                                    component="img"
                                    sx={{
                                      maxWidth: { xs: 350, md: 250 },
                                    }}
                                    alt={file.file}
                                    src={url}
                                    key={file.id}
                                  />
                                );
                              case 'pdf':
                                return (
                                  <iframe
                                    key={file.id}
                                    src={url}
                                    style={{ width: '100%', height: '500px' }}
                                    title={file.file}
                                  >
                                    Este browser não suporta PDFs.
                                  </iframe>
                                );
                              case 'txt':
                                return (
                                  <Link key={file.id} href={url} color="primary" target="_blank">
                                    Abrir arquivo de texto
                                  </Link>
                                );
                              case 'mp4':
                              case 'webm':
                              case 'ogg':
                                return (
                                  <video key={file.id} width="100%" height="auto" controls>
                                    <source src={url} type={`video/${ext}`} />
                                    Seu navegador não suporta vídeos.
                                  </video>
                                );
                              default:
                                return <p key={file.id}>Formato de arquivo não suportado.</p>;
                            }
                          })()
                        : null,
                    )}
                  </Grid>
                );
              default:
                return null;
            }
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default AnswerForm;

import React, { useRef, useState, useEffect } from 'react';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import {
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { formatDateTime, formatDate, formatTime } from '@/utils/inspectionFormatDate';
import answerService from '@/services/answerService';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import './LightboxOverride.css';


const AnswerForm = ({ answerData }) => {
  const sliderRef = useRef(null);
  const [form_fields, setFormFields] = useState([]);
  const [formInfo, setFormInfo] = useState(answerData?.results[0]?.form);
  const [answers, setAnswers] = useState(answerData?.results[0]?.answers);
  const [answersFiles, setAnswersFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [convertedHeicMap, setConvertedHeicMap] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleThumbnailClick = (idx) => {
    setCurrentIndex(idx);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(idx);
    }
  };

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

  console.log('answersFiles', answersFiles);
  console.log('answers', answers);
  console.log('form_fields', form_fields);

  const validImageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'bmp',
    'tiff',
    'tif',
    'svg',
    'heic',
    'raw',
    'cr2',
    'nef',
    'arw',
    'heic',
  ];
  const validVideoExtensions = ['mp4', 'avi', 'mov', 'webm', 'mpeg', 'mpg', 'ogg'];

  const visualFiles = answersFiles.filter((file) => {
    const ext = file.file.split('?')[0].split('.').pop().toLowerCase();
    return validImageExtensions.includes(ext) || validVideoExtensions.includes(ext);
  });

  const getFieldLabel = (fieldId) => {
    const field = form_fields.find((field) => `${field.type}-${field.id}` === fieldId);
    return field ? field.label : '';
  };


  const renderFile = (file) => {
    const ext = file.file.split('?')[0].split('.').pop().toLowerCase();
    if (ext === 'heic') {
      return (
        <>
          <Box
            component="img"
            src="https://placehold.co/600x400"
            alt="Visualização não suportada"
            sx={{
              height: '50vh',
              width: 'auto',
              maxWidth: { xs: 350, md: 250 },
              objectFit: 'contain',
              margin: 'auto',
            }}
          />
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', mt: 1 }}
            color="warning.main"
          >
            Imagem .HEIC não pode ser exibida.
          </Typography>
          <Box textAlign="center" mt={1}>
            <Link
              href={file.file}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              underline="hover"
            >
              Baixar imagem
            </Link>
          </Box>
        </>
      );
    }

    // outras extensões
    if (validImageExtensions.includes(ext)) {
      return (
        <Box
          component="img"
          src={file.file}
          onClick={() => {
            setLightboxIndex(idx);
            setLightboxOpen(true);
          }}
          sx={{
            cursor: 'zoom-in',
            height: '50vh',
            width: 'auto',
            maxWidth: { xs: 350, md: 250 },
            objectFit: 'contain',
            margin: 'auto',
          }}
        />
      );
    }

    if (validVideoExtensions.includes(ext)) {
      return (
        <video
          src={file.file}
          controls
          style={{
            height: '50vh',
            maxWidth: '100%',
            objectFit: 'contain',
            margin: 'auto',
          }}
        />
      );
    }

    if (ext === 'pdf') {
      return (
        <iframe
          src={file.file}
          style={{ width: '100%', height: '500px' }}
          title={file.file}
        >
          Este browser não suporta PDFs.
        </iframe>
      );
    }

    return (
      <Box textAlign="center">
        <Link
          href={file.file}
          color="primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Baixar arquivo ({ext})
        </Link>
      </Box>
    );
  };


  return (
    <Paper variant="outlined" sx={{ marginTop: 2, overflow: 'visible', position: 'relative' }}>
      <Box p={3} display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" sx={{ marginBottom: '15px' }}>
          Resposta do Serviço
        </Typography>
        <Divider />
        {visualFiles.length > 0 && (
          <Box mt={2} sx={{ position: 'relative' }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Mídia
            </Typography>
            <Slider
              ref={sliderRef}
              autoplay={false}
              arrows
              swipeToSlide
              beforeChange={(oldIndex, newIndex) => setCurrentIndex(newIndex)}
              prevArrow={
                <Box className="slick-prev">
                  <ArrowBack sx={{ fontSize: '2rem', color: 'black' }} />
                </Box>
              }
              nextArrow={
                <Box className="slick-next">
                  <ArrowForward sx={{ fontSize: '2rem', color: 'black' }} />
                </Box>
              }
            >
              {visualFiles.map((file, idx) => {
                const ext = file.file
                  .split('?')[0]
                  .split('.')
                  .pop()
                  .toLowerCase();

                // 1) .HEIC: placeholder + aviso + link
                if (ext === 'heic') {
                  return (
                    <Box key={file.id} textAlign="center">
                      <Box
                        component="img"
                        src="/placeholder/default-image.svg"
                        alt="Formato não suportado"
                        sx={{
                          height: '50vh',
                          width: 'auto',
                          maxWidth: { xs: 350, md: 250 },
                          objectFit: 'contain',
                          margin: 'auto',
                        }}
                      />
                      <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                        Imagem .HEIC não suportada.
                      </Typography>
                      <Box mt={1}>
                        <Link
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Baixar imagem
                        </Link>
                      </Box>
                    </Box>
                  );
                }

                // 2) Imagem comum
                if (validImageExtensions.includes(ext)) {
                  return (
                    <Box key={file.id} textAlign="center">
                      <Box
                        component="img"
                        src={file.file}
                        alt=""
                        onClick={() => {
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                        sx={{
                          cursor: 'zoom-in',
                          height: '50vh',
                          width: 'auto',
                          maxWidth: { xs: 350, md: 250 },
                          objectFit: 'contain',
                          margin: 'auto',
                        }}
                      />

                      <Box mt={1}>
                        <Link
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Baixar imagem
                        </Link>
                      </Box>
                    </Box>
                  );
                }

                // 3) Vídeo
                if (validVideoExtensions.includes(ext)) {
                  return (
                    <Box key={file.id} textAlign="center">
                      <video
                        src={file.file}
                        controls
                        style={{
                          height: '50vh',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          margin: 'auto',
                        }}
                      />
                    </Box>
                  );
                }

                // 4) PDF
                if (ext === 'pdf') {
                  return (
                    <Box key={file.id} textAlign="center">
                      <iframe
                        src={file.file}
                        style={{ width: '100%', height: '500px' }}
                        title="PDF"
                      />
                    </Box>
                  );
                }

                // 5) Qualquer outro
                return (
                  <Box key={file.id} textAlign="center">
                    <Link
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Baixar arquivo ({ext})
                    </Link>
                  </Box>
                );
              })}
            </Slider>
            <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2, pb: 1 }}>
              {visualFiles.map((file, idx) => {
                const ext = file.file
                  .split('?')[0]
                  .split('.')
                  .pop()
                  .toLowerCase();

                // placeholder nos thumbs de HEIC
                const thumbSrc =
                  ext === 'heic' ? 'https://placehold.co/600x400/FFC107/000000?text=N%C3%A3o+suportado' : file.file;

                return (
                  <Box
                    key={file.id}
                    onClick={() => handleThumbnailClick(idx)}
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 1,
                      border:
                        idx === currentIndex
                          ? '2px solid blue'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {validImageExtensions.includes(ext) ? (
                      <Box
                        component="img"
                        src={thumbSrc}
                        alt=""
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : validVideoExtensions.includes(ext) ? (
                      <Box
                        component="video"
                        src={file.file}
                        muted
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      <Box p={3} display="flex" flexDirection="column" gap={1}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          my={1}
        >
          {formInfo && <Typography variant="h5">{formInfo.name}</Typography>}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2">Respondido em:</Typography>
            <Chip
              size="small"
              color="secondary"
              variant="outlined"
              label={formatDateTime(answerData?.results[0]?.created_at)}
            />
          </Box>
        </Stack>
        <Divider />
        <Grid container spacing={2} mt={1}>
          {form_fields.map((field) => {
            switch (field.type) {
              case 'text':
              case 'ariaText':
              case 'email':
              case 'number':
                return (
                  <Grid item xs={12} md={6} p={2} key={field.id}>
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {answerFromField(`${field.type}-${field.id}`) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'select': {
                const fieldKey = `${field.type}-${field.id}`;
                const rawValue = answerFromField(fieldKey);
                const normalizedValue = normalizeValue(rawValue, field.multiple);

                return (
                  <Grid item xs={12} md={6} p={2} key={field.id}>
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {field.multiple
                        ? (normalizedValue || [])
                          .map(
                            (val) => field.options.find((opt) => opt.value === val)?.label || val,
                          )
                          .join(', ')
                        : field.options.find((opt) => opt.value === normalizedValue)?.label ||
                        normalizedValue ||
                        'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              }

              case 'date':
                return (
                  <Grid item xs={12} md={6} p={2} key={field.id}>
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {formatDate(answerFromField(`${field.type}-${field.id}`)) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'time':
                return (
                  <Grid item xs={12} md={6} p={2} key={field.id}>
                    <Typography variant="h5">{field.label}:</Typography>
                    <Typography variant="body1">
                      {formatTime(answerFromField(`${field.type}-${field.id}`)) || 'Sem resposta'}
                    </Typography>
                  </Grid>
                );
              case 'file': {
                const fieldKey = `${field.type}-${field.id}`;
                const filesForField = answersFiles.filter((file) => file.field_id === fieldKey);
                if (filesForField.length === 0) return null;

                return (
                  <Grid item xs={12} md={6} p={2} key={field.id}>
                    <Typography variant="h5">{field.label}:</Typography>
                    {filesForField.map((file) => (
                      <Box key={file.id} mt={1}>
                        <Link href={file.file} target="_blank" rel="noopener noreferrer" color="primary">
                          Baixar arquivo
                        </Link>
                      </Box>
                    ))}
                  </Grid>
                );
              }
              default:
                return null;
            }
          })}
        </Grid>
      </Box>
      {
        lightboxOpen && (
          <Lightbox
            mainSrc={visualFiles[lightboxIndex].file}
            nextSrc={visualFiles[(lightboxIndex + 1) % visualFiles.length].file}
            prevSrc={visualFiles[(lightboxIndex + visualFiles.length - 1) % visualFiles.length].file}
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() =>
              setLightboxIndex((lightboxIndex + visualFiles.length - 1) % visualFiles.length)
            }
            onMoveNextRequest={() =>
              setLightboxIndex((lightboxIndex + 1) % visualFiles.length)
            }
          />
        )
      }
    </Paper>
  );
};

export default AnswerForm;

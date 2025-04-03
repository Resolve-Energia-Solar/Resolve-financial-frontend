import React, { useRef, useState, useEffect } from 'react'; // Importando useRef
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import {
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatDateTime, formatDate, formatTime } from '@/utils/inspectionFormatDate';
import answerService from '@/services/answerService';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const AnswerForm = ({ answerData }) => {
  const sliderRef = useRef(null);  // Remover tipagem para JavaScript
  const [form_fields, setFormFields] = useState([]);
  const [formInfo, setFormInfo] = useState(answerData?.results[0]?.form);
  const [answers, setAnswers] = useState(answerData?.results[0]?.answers);
  const [answersFiles, setAnswersFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para mudar o slide com base no clique na miniatura
  const handleThumbnailClick = (idx) => {
    setCurrentIndex(idx);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(idx);  // Muda para o slide correspondente ao clicar na miniatura
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

  // Filtra todas as imagens (jpg, jpeg, png)
  const imageFiles = answersFiles.filter((file) => {
    const ext = file.file.split('?')[0].split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png'].includes(ext);
  });

  // Função para obter o rótulo do campo a partir do field_id
  const getFieldLabel = (fieldId) => {
    const field = form_fields.find(
      (field) => `${field.type}-${field.id}` === fieldId
    );
    return field ? field.label : '';
  };

  return (
    <Paper variant="outlined" sx={{ marginTop: 2, overflow: 'visible', position: 'relative' }}>
      <Box p={3} display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" sx={{ marginBottom: '15px' }}>
          Resposta do Serviço
        </Typography>
        <Divider />
        {imageFiles.length > 0 && (
          <Box mt={2} sx={{ position: 'relative' }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Imagens
            </Typography>
            <Slider
              ref={sliderRef}  // Referência do Slider
              autoPlay={false}
              arrows
              swipeToSlide
              selectedItem={currentIndex}  // Conectando o índice atual ao Slider
              beforeChange={(oldIndex, newIndex) => setCurrentIndex(newIndex)}  // Atualiza o estado ao mudar o slide
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
              {imageFiles.map((file) => {
                const label = getFieldLabel(file.field_id);
                return (
                  <Box key={file.id} textAlign="center">
                    <Box
                      component="img"
                      src={file.file}
                      alt={file.file}
                      sx={{
                        height: '50vh',
                        width: 'auto',
                        maxWidth: { xs: 350, md: 250 },
                        objectFit: 'contain',
                        margin: 'auto',
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Slider>

            {/* Barra de thumbnails com rolagem horizontal */}
            <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2, pb: 1 }}>
              {imageFiles.map((file, idx) => (
                <Box
                  key={file.id}
                  onClick={() => handleThumbnailClick(idx)}  // Atualiza o estado e navega para o slide correspondente
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 1,
                    border: idx === currentIndex ? '2px solid blue' : '2px solid transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={file.file}
                    alt={file.file}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AnswerForm;

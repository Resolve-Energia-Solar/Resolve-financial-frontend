import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Container, Grid, Button, Typography } from '@mui/material';
import './Signature.css';

const EmailSignature = ({ user }) => {
  const captureRef = useRef(null);
  const [isIncomplete, setIsIncomplete] = useState(false);

  const mainPhone = user.phone_numbers.find((phone) => phone.is_main) || user.phone_numbers[0];
  console.log('mainPhone', mainPhone);

  const checkIncompleteData = () => {
    if (
      !user.complete_name ||
      !user.email ||
      !mainPhone ||
      !mainPhone.area_code ||
      !mainPhone.phone_number ||
      !user.employee?.role?.name ||
      !user.employee?.branch?.address?.complete_address
    ) {
      setIsIncomplete(true);
    } else {
      setIsIncomplete(false);
    }
  };

  const generateAndDownload = () => {
    html2canvas(captureRef.current).then((canvas) => {
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${user.complete_name} - Assinatura do E-mail.png`;
      link.click();
    });
  };

  const displayName =
    user.complete_name.length > 24
      ? `${user.complete_name.split(' ')[0]} ${user.complete_name.split(' ').pop()}`
      : user.complete_name;

  React.useEffect(() => {
    checkIncompleteData();
  }, [user]);

  return (
    <Container>
      {isIncomplete && (
        <Grid container justifyContent="center" mt={2}>
          <Grid item>
            <Typography color="error" variant="body1">
              O cadastro está incompleto. Favor verificar as informações do usuário.
            </Typography>
          </Grid>
        </Grid>
      )}

      {!isIncomplete && (
        <Grid container justifyContent="center">
          <div className="row justify-content-center" id="capture-container">
            <div ref={captureRef} id="capture">
              <img
                src="/images/backgrounds/signature_template.png"
                alt="Canva da Assinatura"
              />
              <div id="user-info">
                <h1 id="username">{displayName}</h1>
                <h2>{user.employee.role.name}</h2>
                <h3 id="telephone">
                  ({mainPhone?.area_code}) {mainPhone?.phone_number.slice(0, 5)}-
                  {mainPhone?.phone_number.slice(5)}
                </h3>
                <h3 id="instagram">@resolveenergiasolar</h3>
                <h3 id="email">{user.email}</h3>
                <h3 id="address">{user.employee.branch.address.complete_address}</h3>
              </div>
            </div>
          </div>
        </Grid>
      )}

      <Grid container justifyContent="center" spacing={2} mt={2}>
        <Grid item>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={generateAndDownload}
            disabled={isIncomplete}
          >
            Baixar Assinatura
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            href="mailto:chamados.ti@resolvenergiasolar.com"
          >
            Algum erro? Contate a TI.
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="info"
            size="small"
            href="https://support.microsoft.com/pt-br/office/criar-e-adicionar-uma-assinatura-de-email-no-outlook-8ee5d4f4-68fd-464a-a1c1-0e1c80bb27f2"
            target="_blank"
          >
            Como adicionar ao meu e-mail?
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmailSignature;

import { Box, Button, Grid } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { relative } from "path";
import React, { useState } from "react";

export default function ProposalLayout({ formData }) {

  // const [openEditProposal, setOpenEditProposal] = useState();

  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const dataImg = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });

    const imgProperties = pdf.getImageProperties(dataImg);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;


    pdf.addImage(dataImg, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(dataImg, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save("proposta.pdf")

  }

  return (
    <Grid container>
      <Grid container xs={12} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", mb: 2 }}>
        <Grid item xs={2.3}>
          <Box className="mt-6 flex justify-center">
            <Button
              variant="contained"
              onClick={handleDownloadPdf}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Baixar PDF
            </Button>

          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box>
            <Button
              variant="contained"
              onClick={handleDownloadPdf}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Alterar proposta
            </Button>

          </Box>
        </Grid>

      </Grid>
      <Grid container ref={printRef} sx={{ position: "relative" }}>

        <Grid item xs={12} sx={{ position: "relative" }}>
          <Box sx={{ position: "relative" }}>
            <img
              src="/images/proposal/proposal_cover_background.png"
              alt="header yellow bar"
              style={{ width: "100%", height: "auto" }}
            />

            {/* Text over the first image */}
            <Box
              sx={{
                position: "absolute",
                top: "50%", 
                left: "50%",
                transform: "translate(-50%, -50%)", 
                color: "white", 
                fontSize: "24px",
                fontWeight: "bold", 
              }}
            >
              <Image
                src="/images/logos/resolve-logo.png"
                alt="logo"
                height={60}
                width={180}
                priority
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ position: "relative" }}>
            <img
              src="/images/proposal/bottom_border.png"
              alt="header yellow bar"
              style={{
                position: "absolute",
                bottom: 0, 
                left: 0,
                width: "100%",
                height: "auto",
                // zIndex: -1,
              }}
            />
          </Box>
        </Grid>

        {/* <Grid item xs={12}>
            <Box>
              <img
                src="/images/proposal/proposal_cover_background.png"
                alt="header yellow bar"
                sx={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <img
                src="/images/proposal/bottom_border.png"
                alt="header yellow bar"
                sx={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>*/}
      </Grid>
    </Grid>
  );
}

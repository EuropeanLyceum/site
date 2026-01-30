"use client";

import Image from "next/image";
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQSection = ({
                      options = [],
                      title = "FAQ (поширені запитання)",
                      image,
                      imageAlt = "FAQ Image",
                    }) => {
  return (
      <Box sx={{ py: { xs: 5, md: 8 } }}>
        <Grid
            container
            spacing={6}
            alignItems="center"
            mx="auto"
        >
          {/* Image column */}
          {image && (
              <Grid
                  item
                  size={{xs: 0, md: 5}}
                  sx={{
                    display: { xs: "none", md: "block" },
                    pl: "-20px"
                  }}
              >
                <Box className={"ImageContainerBird"}>
                  <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      className={"ImageBird"}
                  />
                </Box>
              </Grid>
          )}

          {/* FAQ column */}
          <Grid item size={{xs: 12, md: 7}}>
            <Typography
                variant="h3"
                sx={{
                  fontFamily: "Montserrat Alternates",
                  color: "#182BA1",
                  mb: 4,
                }}
            >
              {title}
            </Typography>

            {options.map((item, index) => (
                <Accordion
                    key={index}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      backgroundColor: "#F8F8F8",
                      "&:before": { display: "none" },
                      m: 2
                    }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        sx={{
                          fontFamily: "Montserrat Alternates",
                          fontWeight: 500,
                          color: "#FF5700",
                        }}
                    >
                      {item.label}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography
                        sx={{
                          fontFamily: "Montserrat Alternates",
                          color: "#6B7280",
                          lineHeight: 1.6,
                        }}
                    >
                      {item.text}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
            ))}
          </Grid>
        </Grid>
      </Box>
  );
};

export default FAQSection;
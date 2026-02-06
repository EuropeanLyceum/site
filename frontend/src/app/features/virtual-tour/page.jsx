'use client';

import VirtualTour from "@/components/Home/VirtualTour/VirtualTour.js";
import { Box } from "@mui/material";

export default function VirtualTourPage() {
  return (
      // Прибираємо зайвий паддінг зверху, бо у нас в VirtualTour вже є Hero-секція з відступами
      <Box
          component="main"
          sx={{
            minHeight: "100vh",
            background: "#F8FAFC" // Світлий фон, як і в інших секціях ліцею
          }}
      >
        <VirtualTour />
      </Box>
  );
}
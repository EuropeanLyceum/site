import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { TranslationProvider } from "@/contexts/TranslationProvider";
import {Box} from "@mui/material";

const montserratAlternates = Montserrat_Alternates({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "European Lyceum LMR",
  description: "Офіційний сайт Академічного ліцею 'Європейський' Лубенської міської ради (Academic European lyceum LMR). Новини та інформація про ліцей.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  keywords: ['академічний ліцей європейський лубни', 'школа 6 лубни', 'європейський ліцей', 'лубни освіта', 'academic lyceum european', 'european lyceum'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={montserratAlternates.className}>
        <TranslationProvider>
          <Box className="pageWrapper">
            <Header />
            <Box>{children}</Box>
            <Footer />
          </Box>
        </TranslationProvider>
      </body>
    </html>
  );
}

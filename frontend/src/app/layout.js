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
  title: "Академічний ліцей «Європейський» ЛМР",
  description: "Офіційний сайт Академічного ліцею 'Європейський' Лубенської міської ради (Academic European lyceum LMR). Новини та інформація про ліцей.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  keywords: ['академічний ліцей європейський лубни', 'академічний ліцей європейський лубни сайт',
    'школа 6 лубни', 'школа 6 лубни сайт', 'європейський ліцей сайт', 'академічний ліцей європейський сайт',
    'європейський ліцей', 'лубни освіта', 'academic lyceum european', 'european lyceum',
    'academic lyceum european site', 'european lyceum site'],
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

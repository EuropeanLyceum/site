import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { TranslationProvider } from "@/contexts/TranslationProvider";

const montserratAlternates = Montserrat_Alternates({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "European Lyceum",
  description: "European Lyceum site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={montserratAlternates.className}>
        <TranslationProvider>
          <div className="pageWrapper">
            <Header />
            <main className="mainContent">{children}</main>
            <Footer />
          </div>
        </TranslationProvider>
      </body>
    </html>
  );
}

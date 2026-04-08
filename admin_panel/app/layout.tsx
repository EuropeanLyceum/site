import type { Metadata } from "next";
import Providers from '@/components/layout/Providers';
import { Montserrat_Alternates } from 'next/font/google';

const montserrat = Montserrat_Alternates({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '700'],
    display: 'swap',
});

export const metadata = {
    title: "European Lyceum Admin",
    description: "European Lyceum Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body className={montserrat.className}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
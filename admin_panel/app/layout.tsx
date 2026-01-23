import Providers from '@/components/layout/Providers';

// Temporarily disable Google Fonts during Docker build (no network access)
// const { Montserrat_Alternates } = require('next/font/google');
// const montserratAlternates = Montserrat_Alternates({
//   subsets: ['latin', 'cyrillic'],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-montserrat-alternates',
//   display: 'swap',
//   fallback: ['system-ui', 'arial'],
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import './globals.css';

export const metadata = {
  title: 'Veto — A senate campaign for the rest of us.',
  description:
    'Veto is the campaign of Alex Reyna for U.S. Senate, 2026. Independent. Evidence-led. Unafraid.',
  themeColor: '#0A0A0A',
  openGraph: {
    title: 'Veto — A senate campaign for the rest of us.',
    description:
      'Alex Reyna for U.S. Senate, 2026. Independent. Evidence-led. Unafraid.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="is-loading">{children}</body>
    </html>
  );
}

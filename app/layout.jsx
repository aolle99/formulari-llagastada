import './globals.css';

export const metadata = {
  title: 'La Llagastada 2026 — Inscripcions',
  description: 'Inscripcions a la Festa Major d\'Estiu d\'Esparreguera. Colla de Diables — 30è aniversari.',
  themeColor: '#FF5C00',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}

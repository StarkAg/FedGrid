import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fedgrid',
  description: 'Utility / Operator Monitoring View - Live Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

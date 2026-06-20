import './globals.css';

export const metadata = {
  title: 'Rotary Connect',
  description: 'Community health and volunteering portal for Rotary Connect',
  icons: {
    icon: '/rotary-logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

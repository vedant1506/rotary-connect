import './globals.css';
import Chatbot from '../components/Chatbot';

export const metadata = {
  title: 'ROTARY CLUB VISNAGAR',
  description: 'Community health and volunteering portal for Rotary Connect',
  icons: {
    icon: '/logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}


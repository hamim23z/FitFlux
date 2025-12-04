import './globals.css';
import MuiThemeProvider from './MuiThemeProvider';
import Providers from './providers';
import Navbar from './components/Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FitFlux',
  description: 'Personalized fitness platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <MuiThemeProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
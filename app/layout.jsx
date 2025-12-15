import "./globals.css";
import MuiThemeProvider from "./MuiThemeProvider";
import Providers from "./providers";
import Navbar from "./components/navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FitFlux - Optimize Your Fitness Journey",
  description:
    "Your very own personalized fitness platform. Tailor it your way to ensure you train smarter. Workouts, meal prep, and plenty more available. ",
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

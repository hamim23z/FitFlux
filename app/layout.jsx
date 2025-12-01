"use client";
import Providers from "./providers";
import Navbar from "./components/navbar";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./globals.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f7f7f9" },
  },
  shape: { borderRadius: 12 },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
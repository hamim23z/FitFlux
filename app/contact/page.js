"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  TextField,
  Snackbar,
} from "@mui/material";

import Link from "next/link";
import Image from "next/image";
import AppAppBar from "../home-page/components/AppAppBar";
import Footer from "../home-page/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

export default function Contact() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSendMessage = async () => {
    try {
      await addDoc(collection(db, "contactForm"), {
        firstName,
        lastName,
        email,
        feedback,
        timestamp: new Date(),
      });

      setSnackbarOpen(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setFeedback("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppTheme>
        <AppAppBar />

        <Box
          sx={{
            minHeight: { xs: "90vh", sm: "95vh" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "center" },
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              maxWidth: "1000px",
              width: "100%",
              color: "#111",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: "900",
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                textAlign: "center",
                marginTop: { xs: "200px", md: "50px" },
              }}
            >
              get in touch with us.
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{ paddingTop: "40px", justifyContent: "center" }}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="filled"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    "& .MuiInputLabel-root": { color: "black" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                    "& .MuiFilledInput-input": { color: "black" },
                    opacity: 1,
                    color: "#111",
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="filled"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    "& .MuiInputLabel-root": { color: "black" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                    "& .MuiFilledInput-input": { color: "black" },
                    opacity: 1,
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email Address"
              variant="filled"
              value={email}
              onChange={handleEmailChange}
              sx={{
                backgroundColor: "white",
                mt: 2,
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "black" },
                "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                "& .MuiFilledInput-input": { color: "black" },
                opacity: 1,
              }}
              required
              type="email"
              error={Boolean(emailError)}
              helperText={emailError}
            />

            <TextField
              fullWidth
              label="Message goes here"
              variant="filled"
              multiline
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{
                backgroundColor: "white",
                mt: 2,
                borderRadius: 1,
                "& .MuiInputLabel-root": { color: "black" },
                "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                "& .MuiFilledInput-input": { color: "black" },
                opacity: 1,
              }}
              required
            />

            <Button
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 900,
                color: "white",
                mt: 3,
                border: "1px solid primary",
              }}
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Your message has been sent. Someone from our team will reach out to you soon!"
        />

        <Footer></Footer>
      </AppTheme>
    </>
  );
}

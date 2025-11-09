"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import Navbar from "../components/navbar";

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
    setSnackbarOpen(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setFeedback("");
  };

  return (
    <Box>
      <Navbar />

      <Box
        sx={{
          minHeight: { xs: "90vh", sm: "95vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "center" },
          overflow: "auto",
          px: 2,
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
              fontWeight: "900",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              textAlign: "center",
              marginTop: { xs: "50px", md: "50px" },
              mb: 4,
            }}
          >
            Get in touch with us
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{ paddingTop: "40px", justifyContent: "center" }}
          >
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 900,
              mt: 3,
              px: 4,
              py: 1.5,
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

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'grey.900',
          color: 'grey.300',
          textAlign: 'center',
          py: 3,
          mt: 4,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} FitFlux. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

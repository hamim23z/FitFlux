"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Snackbar } from "@mui/material";
import { supabase } from "../lib/supabaseClient";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
      {"Copyright © "}
      <Link color="text.secondary" href="/">
        FitFlux
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("newsletter")
        .insert([{ email_address: email }]);

      if (error) throw error;

      setSnackbarOpen(true);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error.message);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderTop: "2px solid",
        borderColor: "divider",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 4, sm: 6 },
          py: { xs: 6, sm: 8 },
          textAlign: { sm: "center", md: "left" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            justifyContent: "space-between",
            gap: { xs: 4, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: { xs: "100%", sm: "auto" },
              maxWidth: { sm: "400px" },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              FitFlux
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Personalized fitness guidance that adapts to your life. Track
              workouts, optimize meals, and achieve sustainable results.
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              Subscribe for weekly fitness tips and updates. No spam ever!
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mt: 1 }}
            >
              <TextField
                id="email-newsletter"
                value={email}
                onChange={handleEmailChange}
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Your email address"
                sx={{ maxWidth: { sm: "250px" } }}
                error={Boolean(emailError)}
                helperText={emailError}
              />
              <Button
                onClick={handleSubscribe}
                variant="contained"
                color="primary"
                size="medium"
                sx={{ flexShrink: 0 }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2500}
            onClose={handleSnackbarClose}
            message="Subscribed successfully!"
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: { xs: 4, sm: 8 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                minWidth: "120px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", mb: 0.5 }}
              >
                Product
              </Typography>
              <Link
                color="text.secondary"
                variant="body2"
                href="/meal-optimizer"
              >
                Meal Optimizer
              </Link>
              <Link
                color="text.secondary"
                variant="body2"
                href="/workout-tracker"
              >
                Workout Tracker
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                minWidth: "120px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", mb: 0.5 }}
              >
                Company
              </Typography>
              <Link color="text.secondary" variant="body2" href="/about-us">
                About Us
              </Link>
              <Link color="text.secondary" variant="body2" href="/contact">
                Contact
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                minWidth: "120px",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "medium", mb: 0.5 }}
              >
                Legal
              </Typography>
              <Link color="text.secondary" variant="body2" href="/terms">
                Terms
              </Link>
              <Link color="text.secondary" variant="body2" href="/privacy">
                Privacy
              </Link>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: { xs: 4, sm: 6 },
            width: "100%",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <div>
            <Link color="text.secondary" variant="body2" href="/privacy">
              Privacy Policy
            </Link>
            <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
              &nbsp;•&nbsp;
            </Typography>
            <Link color="text.secondary" variant="body2" href="/terms">
              Terms of Service
            </Link>
            <Copyright />
          </div>
        </Box>
      </Container>
    </Box>
  );
}
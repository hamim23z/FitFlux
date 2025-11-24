"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "grey.500", mt: 1 }}>
      {"Copyright © "}
      <Link color="grey.400" href="/" sx={{ '&:hover': { color: 'white' } }}>
        FitFlux
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) return;

    // TODO: Connect to backend newsletter API
    alert("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <Box
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        mt: 'auto',
        width: '100%',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 4, sm: 6 },
          py: { xs: 6, sm: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
            justifyContent: "space-between",
            gap: { xs: 4, sm: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: 1,
              maxWidth: { sm: "450px" },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white", mb: 1 }}
            >
              FitFlux
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.400", mb: 2 }}
            >
              Personalized fitness guidance that adapts to your life. Track workouts, 
              optimize meals, and achieve sustainable results.
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ fontWeight: 600, color: "white" }}
            >
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.400", mb: 1 }}>
              Subscribe for weekly fitness tips and updates. No spam ever!
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 1 }}>
              <TextField
                id="email-newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                variant="outlined"
                fullWidth
                placeholder="Your email address"
                sx={{ maxWidth: { sm: "250px" } }}
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
              <Typography variant="body2" sx={{ fontWeight: "medium", mb: 0.5, color: "white" }}>
                Product
              </Typography>
              <Link color="grey.400" variant="body2" href="/dashboard" sx={{ '&:hover': { color: 'white' } }}>
                Dashboard
              </Link>
              <Link color="grey.400" variant="body2" href="/meal-optimizer" sx={{ '&:hover': { color: 'white' } }}>
                Meal Optimizer
              </Link>
              <Link color="grey.400" variant="body2" href="/workout-tracker" sx={{ '&:hover': { color: 'white' } }}>
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
              <Typography variant="body2" sx={{ fontWeight: "medium", mb: 0.5, color: "white" }}>
                Company
              </Typography>
              <Link color="grey.400" variant="body2" href="/about-us" sx={{ '&:hover': { color: 'white' } }}>
                About Us
              </Link>
              <Link color="grey.400" variant="body2" href="/contact" sx={{ '&:hover': { color: 'white' } }}>
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
              <Typography variant="body2" sx={{ fontWeight: "medium", mb: 0.5, color: "white" }}>
                Legal
              </Typography>
              <Link color="grey.400" variant="body2" href="/terms" sx={{ '&:hover': { color: 'white' } }}>
                Terms
              </Link>
              <Link color="grey.400" variant="body2" href="/privacy" sx={{ '&:hover': { color: 'white' } }}>
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
            borderColor: "grey.800",
          }}
        >
          <div>
            <Link color="grey.400" variant="body2" href="/privacy" sx={{ '&:hover': { color: 'white' } }}>
              Privacy Policy
            </Link>
            <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5, color: "grey.500" }}>
              &nbsp;•&nbsp;
            </Typography>
            <Link color="grey.400" variant="body2" href="/terms" sx={{ '&:hover': { color: 'white' } }}>
              Terms of Service
            </Link>
            <Copyright />
          </div>
        </Box>
      </Container>
    </Box>
  );
}
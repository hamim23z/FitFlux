"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CssBaseline,
  Box,
  Card,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { GitHub } from "@mui/icons-material";
import DiscordIcon from "../components/discord_icon";
import Navbar from "../components/navbar";
import { signIn } from "next-auth/react";
import Footer from "../components/Footer"

export default function SignInPage() {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // validation state
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // ui state
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return valid;
  };

  //changed this mainly. this is when a user clicks the sign in with ... button
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      console.error("Login error:", res.error);
    } else {
      window.location.href = "/";
    }
  };

  //the actual sign in
  const handleOAuthSignin = async (provider) => {
    setIsLoading(true);
    setFormError("");
    try {
      await signIn(provider.toLowerCase(), { callbackUrl: "/" });
    } catch (err) {
      setFormError(`Failed to sign in with ${provider}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Navbar />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
          p: { xs: 2, sm: 3 },
          background: "radial-gradient(circle at center, #03162B, #051220)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            mx: "auto",
            my: { xs: 4, sm: 6 },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4 },
              boxShadow:
                "hsla(220, 30%, 5%, 0.2) 0px 5px 15px, hsla(220, 25%, 10%, 0.2) 0px 15px 35px -5px",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 2,
                color: "text.primary",
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            {/* FORM */}
            <Stack gap={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleOAuthSignin("Google")}
                disabled={isLoading}
                sx={{ height: 48 }}
              >
                Sign in with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                onClick={() => handleOAuthSignin("GitHub")}
                disabled={isLoading}
                sx={{ height: 48 }}
              >
                Sign in with GitHub
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<DiscordIcon />}
                onClick={() => handleOAuthSignin("Discord")}
                disabled={isLoading}
                sx={{ height: 48 }}
              >
                Sign in with Discord
              </Button>

              <Typography
                sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}
              >
                Don't have an account?{" "}
                <Button component={Link} href="/sign-up" size="small">
                  Sign up here
                </Button>
              </Typography>
            </Stack>
          </Card>
        </Box>
        <Footer/>
      </Box>
    </>
  );
}

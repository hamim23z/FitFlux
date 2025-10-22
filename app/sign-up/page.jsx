'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CssBaseline,
  Box,
  Card,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

export default function SignUpPage() {
  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // validation state
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  // ui state
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.trim().length === 0) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      valid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    setFormError('');

    try {
      // TODO: replace with your real sign-up API (or Stack auth)
      // await fetch('/api/auth/sign-up', { method: 'POST', body: JSON.stringify({ email, password, name }) })
      await new Promise((r) => setTimeout(r, 900));
      // e.g. router.push('/profile')
      alert('Test/Placeholder for backend');
    } catch (err) {
      setFormError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider) => {
    setIsLoading(true);
    setFormError('');
    try {
      // TODO: replace with your real OAuth flow
      await new Promise((r) => setTimeout(r, 700));
      alert(`✅ Mock ${provider} sign up. Wire to your OAuth backend!`);
    } catch (err) {
      setFormError(`Failed to sign up with ${provider}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          background: 'radial-gradient(circle at center, #03162B, #051220)',
          color: '#fff',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto', my: { xs: 4, sm: 6 } }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 3, sm: 4 },
              boxShadow:
                'hsla(220, 30%, 5%, 0.2) 0px 5px 15px, hsla(220, 25%, 10%, 0.2) 0px 15px 35px -5px',
              borderRadius: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
              Sign Up
            </Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            {/* FORM */}
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Stack spacing={2.5}>
                {/* Full Name */}
                <FormControl>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <TextField
                    id="name"
                    name="fullName"
                    placeholder="Jon Snow"
                    required
                    fullWidth
                    autoComplete="off"
                    error={nameError}
                    helperText={nameErrorMessage}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </FormControl>

                {/* Email */}
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    fullWidth
                    autoComplete="email"
                    error={emailError}
                    helperText={emailErrorMessage}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </FormControl>

                {/* Password */}
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••"
                    required
                    fullWidth
                    autoComplete="new-password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </FormControl>

                <FormControlLabel
                  control={<Checkbox disabled={isLoading} />}
                  label="I want to receive updates via email."
                />

                <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ height: 48 }}>
                  {isLoading ? <CircularProgress size={24} /> : 'Sign up'}
                </Button>
              </Stack>
            </Box>

            {/* OAuth and footer */}
            <Divider sx={{ my: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>or</Typography>
            </Divider>

            <Stack gap={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleOAuthSignup('Google')}
                disabled={isLoading}
                sx={{ height: 48 }}
              >
                Sign up with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleOAuthSignup('Microsoft')}
                disabled={isLoading}
                sx={{ height: 48 }}
              >
                Sign up with Microsoft
              </Button>

              <Typography sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                Already have an account?{' '}
                <Button component={Link} href="/sign-in" size="small">
                  Sign in here
                </Button>
              </Typography>
            </Stack>
          </Card>
        </Box>
      </Box>
    </>
  );
}

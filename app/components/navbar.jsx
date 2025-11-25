'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';

export default function Navbar() {
  // TODO: Replace with real auth state (NextAuth, Supabase, etc.)
  const isAuthenticated = false; // change to true to test signed-in behavior

  const router = useRouter();
  const pathname = usePathname();

  // If the user is signed in and on the home page, redirect to meal planner
  useEffect(() => {
    if (isAuthenticated && pathname === '/') {
      router.replace('/meal');
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo — always points to home (/) */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            FitFlux
          </Typography>
        </Link>

        {/* Right side navigation */}
        <Stack direction="row" spacing={2}>
          {isAuthenticated ? (
            <>
              {/* Signed-in users see everything */}
              <Button component={Link} href="/dashboard" color="inherit">
                Dashboard
              </Button>
              <Button component={Link} href="/meal" color="inherit">
                Meal Optimizer
              </Button>
              <Button component={Link} href="/workout-planner" color="inherit">
                Workout Tracker
              </Button>
              <Button component={Link} href="/about-us" color="inherit">
                About Us
              </Button>
              <Button component={Link} href="/contact" color="inherit">
                Contact
              </Button>
              <Button
                onClick={() =>
                  alert('Sign out functionality goes here — connect to your auth/backend')
                }
                color="inherit"
                variant="outlined"
                sx={{ borderColor: 'white' }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              {/* Signed-out users can still see About + Contact */}
              <Button component={Link} href="/about-us" color="inherit">
                About Us
              </Button>
              <Button component={Link} href="/contact" color="inherit">
                Contact
              </Button>

              {/* Auth buttons for signed-out users */}
              <Button component={Link} href="/sign-in" color="inherit">
                Sign In
              </Button>
              <Button
                component={Link}
                href="/sign-up"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: 'white' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

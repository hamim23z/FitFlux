'use client';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
            FitFlux
          </Typography>
        </Link>
        <Stack direction="row" spacing={2}>
          <Button component={Link} href="/dashboard" color="inherit">Dashboard</Button>
          <Button component={Link} href="/meal" color="inherit">Meal Optimizer</Button>

          <Button component={Link} href="/workout-planner" color="inherit">Workout Tracker</Button>
          <Button component={Link} href="/about-us" color="inherit">About Us</Button>
          <Button component={Link} href="/contact" color="inherit">Contact</Button>
          <Button component={Link} href="/sign-in" color="inherit">Sign In</Button>
          <Button component={Link} href="/sign-up" color="inherit" variant="outlined" sx={{ borderColor: 'white' }}>
            Sign Up
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}


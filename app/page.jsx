'use client';

import Navbar from './components/navbar';

import {
  Typography,
  Box,
  Button,
  Container,
  Stack,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <Box>
      {/* Shared Navbar */}
      <Navbar />

      {/* Hero */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 10,
          textAlign: 'center',
          backgroundImage:
            'linear-gradient(180deg, rgba(25,118,210,0.1), rgba(25,118,210,0))',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Optimize Your Fitness Journey
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            FitFlux helps you balance workouts, meals, and lifestyle goals — tailored to your schedule and resources.
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button variant="contained" size="large" component={Link} href="/dashboard">
              Get Started
            </Button>
            <Button variant="outlined" size="large">Learn More</Button>
          </Stack>
        </Container>
      </Box>

      {/* Highlights */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: 'bold', mb: 5 }}
        >
          What FitFlux Offers
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: 'Personalized Dashboard',
              desc: 'Track calories, workouts, and progress in one place.',
            },
            {
              title: 'Meal Optimizer',
              desc: 'Get meal plans from your ingredients and prep time.',
            },
            {
              title: 'Workout Calendar',
              desc: 'Stay accountable with weekly tracking.',
            },
            {
              title: 'Notes & Goals',
              desc: 'Log weekly improvements and insights.',
            },
          ].map((feature, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  textAlign: 'center',
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'grey.900',
          color: 'grey.300',
          textAlign: 'center',
          py: 3,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} FitFlux. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

'use client';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

export default function AboutUsPage() {
  const values = [
    {
      title: 'Personalization',
      desc: 'Every user is unique. We adapt to your progress, constraints, and lifestyle to create plans that truly fit you.',
    },
    {
      title: 'Transparency',
      desc: 'We explain every adjustment and recommendation, so you always understand why changes are made.',
    },
    {
      title: 'Accessibility',
      desc: 'Powerful fitness guidance should be available to everyone, regardless of budget or technical expertise.',
    },
    {
      title: 'Empowerment',
      desc: 'We give you the tools and insights to take control of your health and make informed decisions.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
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
            About FitFlux
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Empowering you to live your healthiest and strongest life through personalized, adaptive fitness guidance.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: 'bold', mb: 5 }}
        >
          Our Mission
        </Typography>
        <Box sx={{ maxWidth: '900px', mx: 'auto', mb: 6 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            At FitFlux, we believe fitness should adapt to your life — not the other way around. 
            Our mission is to help you live your healthiest and strongest life by providing personalized 
            fitness guidance that works with your real-world constraints and goals.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            We bridge the gap between rigid workout templates and basic calorie trackers by creating 
            a platform that truly understands you. FitFlux adapts your training and nutrition plans based 
            on your actual progress, adherence patterns, and lifestyle constraints — adjusting weekly targets 
            for calories, sets, and loads with clear explanations for every change.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our intelligent meal optimizer balances your macros within your budget and prep-time limits, 
            generating grocery lists and recipe suggestions from ingredients you already have. We combine 
            data-driven adaptation, Bayesian calorie estimation, and optimization modeling to deliver a 
            responsive experience that's both powerful and easy to use.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            FitFlux emphasizes explainability and practical usability, making personalized fitness guidance 
            accessible and actionable for everyone. We're here to support your journey, adapt to your needs, 
            and help you achieve sustainable results that last.
          </Typography>
        </Box>
      </Container>

      {/* Values Section */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: 'bold', mb: 5 }}
        >
          Our Values
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
          }}
        >
          {values.map((value, i) => (
            <Card
              key={i}
              sx={{
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

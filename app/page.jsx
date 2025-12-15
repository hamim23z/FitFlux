"use client";
import Footer from "./components/Footer";
import {
  Typography,
  Box,
  Button,
  Container,
  Stack,
} from "@mui/material";
import Link from "next/link";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";

export default function LandingPage() {
  const features = [
    {
      title: "Dashboard Power",
      desc: "Track calories, workouts, and progress in one place.",
      icon: <FlashOnIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
    {
      title: "Meal Optimizer",
      desc: "Get meal plans from your ingredients and prep time.",
      icon: <RestaurantIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
    {
      title: "Workout Calendar",
      desc: "Stay accountable with weekly tracking.",
      icon: <CalendarMonthIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
    {
      title: "Notes & Goals",
      desc: "Log weekly improvements and insights.",
      icon: <NoteAltIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
    {
      title: "Workout Catalog",
      desc: "Access hundreds of exercises with video guides.",
      icon: <MenuBookIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
    {
      title: "Team Support",
      desc: "Get help and connect with our fitness community.",
      icon: <GroupsIcon style={{ fontSize: 50, color: "#FFF" }} />,
      gradient: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
    },
  ];

  return (
    <Box>
      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 64px;
        }

        .feature-card {
          min-height: 220px;
          border-radius: 16px;
          padding: 32px;
          color: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .feature-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(13, 71, 161, 0.3);
        }

        .feature-icon {
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .feature-desc {
          font-size: 1rem;
          opacity: 0.95;
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
          pt: { xs: 12, md: 18 },
          pb: { xs: 10, md: 15 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background blobs */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: "bold",
                fontSize: "1rem",
                letterSpacing: 3,
                mb: 2,
              }}
            >
              Optimize your fitness journey
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                color: "white",
                fontSize: { xs: "3rem", md: "6rem" },
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
              }}
            >
              Train
              <br />
              <Box
                component="span"
                sx={{
                  color: "#64b5f6",
                }}
              >
                Smarter
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 6,
                color: "rgba(255,255,255,0.9)",
                maxWidth: "700px",
                mx: "auto",
                fontWeight: 500,
              }}
            >
              FitFlux helps you balance workouts, meals, and lifestyle goals -
              tailored to your schedule and resources
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              spacing={2}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/sign-up"
                sx={{
                  bgcolor: "white",
                  color: "#1565c0",
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  "&:hover": {
                    bgcolor: "#64b5f6",
                    color: "#000",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/about-us"
                sx={{
                  borderColor: "white",
                  color: "white",
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Learn more
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features Section*/}
      <Container sx={{ py: 12 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 2,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          What FitFlux offers
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 8,
            textAlign: "center",
            color: "text.secondary",
            fontWeight: 400,
          }}
        >
          Everything you need to transform your fitness journey
        </Typography>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card"
              style={{ background: feature.gradient }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-desc">{feature.desc}</div>
            </div>
          ))}
        </div>
      </Container>

      {/* Join Now */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, mb: 2, color: "white" }}
          >
            YOUR MOVE
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: "white", opacity: 0.9 }}>
            Stop waiting. Start training.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/sign-up"
            sx={{
              bgcolor: "white",
              color: "#1565c0",
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              "&:hover": {
                bgcolor: "#64b5f6",
                color: "#000",
                transform: "scale(1.05)",
              },
            }}
          >
            Join Now
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

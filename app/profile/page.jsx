"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "../components/footer";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Stack,
  Divider,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    fitness_goal: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user");
      
      if (response.ok) {
        const data = await response.json();

        if (data && !data.error) {
          const profileData = {
            name: data.name || session?.user?.name || "",
            email: data.email || session?.user?.email || "",
            height: data.height?.toString() || "",
            weight: data.weight?.toString() || "",
            fitness_goal: data.fitness_goal || "",
          };
          setProfile(profileData);
          setOriginalProfile(profileData);
          setLoading(false);
          return;
        }
      }

      console.log("API failed, using session data");
      const fallbackProfile = {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        height: "",
        weight: "",
        fitness_goal: "",
      };
      setProfile(fallbackProfile);
      setOriginalProfile(fallbackProfile);
      setLoading(false);

    } catch (err) {
      console.error("Error fetching profile:", err);
      const fallbackProfile = {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        height: "",
        weight: "",
        fitness_goal: "",
      };
      setProfile(fallbackProfile);
      setOriginalProfile(fallbackProfile);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setOriginalProfile({ ...profile });
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfile({ ...originalProfile });
    setEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 8, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Box>
      <style jsx>{`
        .profile-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 32px;
          margin-top: 32px;
        }

        .profile-card {
          grid-column: 1;
        }

        .profile-details {
          grid-column: 2;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 24px;
        }

        .info-grid-full {
          grid-column: 1 / -1;
        }

        @media (max-width: 960px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }

          .profile-card {
            grid-column: 1;
          }

          .profile-details {
            grid-column: 1;
          }
        }

        @media (max-width: 600px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .info-grid-full {
            grid-column: 1;
          }
        }
      `}</style>

      <Container maxWidth="lg" sx={{ py: 8, minHeight: "80vh" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          My Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            Profile updated successfully!
          </Alert>
        )}

        <div className="profile-grid">
          {/* Left Column - Profile Card */}
          <div className="profile-card">
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
              <Avatar
                src={session.user.image}
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {!session.user.image && (profile.name ? profile.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 60 }} />)}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {profile.name || "No Name Set"}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {profile.email}
              </Typography>

              {!editing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    fullWidth
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    fullWidth
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "left" }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Member Since
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {new Date().toLocaleDateString()}
                </Typography>

                {profile.fitness_goal && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Fitness Goal
                    </Typography>
                    <Typography variant="body2">
                      {profile.fitness_goal}
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>
          </div>

          {/* Right Column - Profile Details */}
          <div className="profile-details">
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Personal Information
                </Typography>
                {!editing && (
                  <IconButton color="primary" onClick={() => setEditing(true)}>
                    <EditIcon />
                  </IconButton>
                )}
              </Box>

              <div className="info-grid">
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: "action.active" }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
                  }}
                />
              </div>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Fitness Information
              </Typography>

              <div className="info-grid">
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={profile.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <FitnessCenterIcon sx={{ mr: 1, color: "action.active" }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Weight (lbs)"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  disabled={!editing}
                  InputProps={{
                    startAdornment: <FitnessCenterIcon sx={{ mr: 1, color: "action.active" }} />,
                  }}
                />

                <TextField
                  className="info-grid-full"
                  fullWidth
                  label="Fitness Goal"
                  value={profile.fitness_goal}
                  onChange={(e) => handleInputChange("fitness_goal", e.target.value)}
                  disabled={!editing}
                  placeholder="e.g., Lose weight, Build muscle, Stay healthy"
                />
              </div>
            </Paper>
          </div>
        </div>
      </Container>
      <Footer />
    </Box>
  );
}
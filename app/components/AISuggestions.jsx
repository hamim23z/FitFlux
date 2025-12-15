"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SaveIcon from "@mui/icons-material/Save";

export default function AISuggestions({ open, onClose, muscleGroups }) {
  const [experience, setExperience] = useState("beginner");
  const [goal, setGoal] = useState("build muscle");
  const [equipment, setEquipment] = useState("gym");
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [workoutMeta, setWorkoutMeta] = useState(null);
  const [error, setError] = useState(null);

  const handleMuscleToggle = (muscle) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  const handleGeneratePlan = async () => {
    if (selectedMuscles.length === 0) {
      setError("Please select at least one muscle group");
      return;
    }

    setLoading(true);
    setError(null);
    setWorkoutPlan(null);
    setWorkoutMeta(null);

    try {
      const response = await fetch("/api/openai/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          experience,
          goal,
          muscleGroups: selectedMuscles,
          equipment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout plan");
      }

      const data = await response.json();
      setWorkoutPlan(data.plan);
      setWorkoutMeta(data.meta);
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDashboard = () => {
    if (!workoutPlan || !workoutMeta) return;

    // Save workout plan to localStorage
    localStorage.setItem("fitflux_workoutPlan", JSON.stringify(workoutPlan));
    
    // Save metadata
    localStorage.setItem("fitflux_workoutMeta", JSON.stringify(workoutMeta));

    // Calculate and save workout stats for dashboard
    const workoutStats = {
      totalExercises: workoutMeta.totalExercises,
      totalSets: workoutMeta.totalSets,
      muscleGroups: workoutMeta.muscleGroups,
      goal: workoutMeta.goal,
      experience: workoutMeta.experience,
      lastGenerated: workoutMeta.generatedAt,
    };
    
    localStorage.setItem("fitflux_workoutStats", JSON.stringify(workoutStats));

    // Increment workouts completed
    const currentCompleted = parseInt(localStorage.getItem("fitflux_workoutsCompleted") || "0");
    localStorage.setItem("fitflux_workoutsCompleted", String(currentCompleted + 1));

    alert("Workout plan saved to dashboard!");
  };

  const handleClose = () => {
    setWorkoutPlan(null);
    setWorkoutMeta(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            AI Workout Suggestions
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!workoutPlan ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about your fitness level and goals to get personalized
              workout recommendations
            </Typography>

            <Stack spacing={3}>
              {/* Experience Level */}
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  label="Experience Level"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              {/* Goal */}
              <FormControl fullWidth>
                <InputLabel>Fitness Goal</InputLabel>
                <Select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  label="Fitness Goal"
                >
                  <MenuItem value="build muscle">Build Muscle</MenuItem>
                  <MenuItem value="fat loss">Fat Loss</MenuItem>
                  <MenuItem value="strength">Strength</MenuItem>
                  <MenuItem value="endurance">Endurance</MenuItem>
                </Select>
              </FormControl>

              {/* Equipment */}
              <FormControl fullWidth>
                <InputLabel>Available Equipment</InputLabel>
                <Select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  label="Available Equipment"
                >
                  <MenuItem value="gym">Full Gym</MenuItem>
                  <MenuItem value="home dumbbells">Home (Dumbbells)</MenuItem>
                  <MenuItem value="bodyweight">Bodyweight Only</MenuItem>
                </Select>
              </FormControl>

              {/* Muscle Groups */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Select Muscle Groups
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {muscleGroups.map((muscle) => (
                    <Chip
                      key={muscle}
                      label={muscle}
                      onClick={() => handleMuscleToggle(muscle)}
                      color={selectedMuscles.includes(muscle) ? "primary" : "default"}
                      variant={selectedMuscles.includes(muscle) ? "filled" : "outlined"}
                      icon={<FitnessCenterIcon />}
                    />
                  ))}
                </Box>
              </Box>

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              {/* Generate Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleGeneratePlan}
                disabled={loading || selectedMuscles.length === 0}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {loading ? "Generating..." : "Generate Workout Plan"}
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              {workoutPlan.overview}
            </Typography>

            <Stack spacing={3}>
              {workoutPlan.workouts?.map((workout, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                    {workout.muscle_group}
                  </Typography>

                  {/* Warm-up */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      Warm-up
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workout.warmup}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Exercises */}
                  <Stack spacing={2}>
                    {workout.exercises?.map((ex, exIdx) => (
                      <Box key={exIdx}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {exIdx + 1}. {ex.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ex.sets} sets × {ex.reps} reps • Rest: {ex.rest}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Cooldown */}
                  {workout.cooldown && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                          Cooldown
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {workout.cooldown}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SaveIcon />}
                onClick={handleSaveToDashboard}
                sx={{ fontWeight: "bold" }}
              >
                Save to Dashboard
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setWorkoutPlan(null);
                  setWorkoutMeta(null);
                }}
              >
                Generate New Plan
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

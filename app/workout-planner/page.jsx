"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../components/Footer";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Chip,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function WorkoutTracker() {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const lastInputRef = useRef(null);

  const muscleGroups = [
    { name: "Chest", color: "#e57373" },
    { name: "Back", color: "#64b5f6" },
    { name: "Shoulders", color: "#81c784" },
    { name: "Arms", color: "#ffb74d" },
    { name: "Legs", color: "#ba68c8" },
    { name: "Core", color: "#4db6ac" },
    { name: "Hips", color: "#2042a1ff" },
  ];

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      const { data, error } = await supabase
        .from("exercise_catalog")
        .select("*");
      if (error) {
        console.error("Error:", error);
        setLoading(false);
        return;
      }

      const grouped = {};
      data.forEach((ex) => {
        const muscle = ex.muscle_group || "Other";
        if (!grouped[muscle]) grouped[muscle] = [];
        grouped[muscle].push({
          id: ex.exercise_name,
          name: ex.exercise_name,
          desc: ex.desc,
          force: ex.force,
          equipment: ex.equipment ? ex.equipment.split(",") : [],
          level: ex.level,
          execution: ex.execution,
          mechanics: ex.mechanics,
        });
      });
      setExercises(grouped);
      setLoading(false);
    }
    fetchExercises();
  }, []);

  useEffect(() => {
    if (lastInputRef.current) lastInputRef.current.focus();
  }, [workoutLog.length]);

  const addSetToLog = () => {
    if (!selectedExercise) return;
    const newSet = {
      id: Date.now(),
      exerciseName: selectedExercise.name,
      reps: "",
      weight: "",
    };
    setWorkoutLog([...workoutLog, newSet]);
  };

  const copyPreviousSet = (exerciseName, currentSetId) => {
    const exerciseSets = workoutLog.filter(
      (set) => set.exerciseName === exerciseName
    );
    const currentIndex = exerciseSets.findIndex(
      (set) => set.id === currentSetId
    );
    if (currentIndex === 0) return;

    const previousSet = exerciseSets[currentIndex - 1];
    setWorkoutLog(
      workoutLog.map((set) =>
        set.id === currentSetId
          ? { ...set, reps: previousSet.reps, weight: previousSet.weight }
          : set
      )
    );
  };

  const updateSet = (id, field, value) => {
    const numValue = parseFloat(value);
    if (value !== "" && numValue < 0) return;
    setWorkoutLog(
      workoutLog.map((set) =>
        set.id === id ? { ...set, [field]: value } : set
      )
    );
  };

  const removeSet = (id) => {
    setWorkoutLog(workoutLog.filter((set) => set.id !== id));
  };

  const isBodyweightExercise = (exercise) =>
    exercise?.equipment?.includes("Bodyweight");

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "default";
    }
  };
  const totalSets = workoutLog.length;
  const uniqueExercises = new Set(workoutLog.map((set) => set.exerciseName))
    .size;
  const totalReps = workoutLog.reduce(
    (sum, set) => sum + (parseInt(set.reps) || 0),
    0
  );
  const totalVolume = workoutLog.reduce(
    (sum, set) => sum + (parseInt(set.reps) || 0) * (parseInt(set.weight) || 0),
    0
  );

  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{ py: 6, pb: workoutLog.length > 0 ? 16 : 6 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Workout Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select a muscle group, choose exercises, and track your sets and reps.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Muscle Groups
              </Typography>
              <Stack spacing={1}>
                {muscleGroups.map((muscle) => (
                  <Button
                    key={muscle.name}
                    variant={
                      selectedMuscle === muscle.name ? "contained" : "outlined"
                    }
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      borderColor: muscle.color,
                      color:
                        selectedMuscle === muscle.name ? "#fff" : muscle.color,
                      bgcolor:
                        selectedMuscle === muscle.name
                          ? muscle.color
                          : "transparent",
                      "&:hover": {
                        bgcolor:
                          selectedMuscle === muscle.name
                            ? muscle.color
                            : `${muscle.color}20`,
                      },
                    }}
                    onClick={() => {
                      setSelectedMuscle(muscle.name);
                      setSelectedExercise(null);
                    }}
                  >
                    {muscle.name}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {selectedMuscle
                  ? `${selectedMuscle} Exercises`
                  : "Select a Muscle Group"}
              </Typography>

              {loading ? (
                <Typography>Loading exercises...</Typography>
              ) : selectedMuscle && exercises[selectedMuscle]?.length > 0 ? (
                <Grid container spacing={2}>
                  {exercises[selectedMuscle].map((exercise) => (
                    <Grid item xs={12} key={exercise.id}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          border:
                            selectedExercise?.id === exercise.id
                              ? "2px solid"
                              : "1px solid",
                          borderColor:
                            selectedExercise?.id === exercise.id
                              ? "primary.main"
                              : "divider",
                          bgcolor:
                            selectedExercise?.id === exercise.id
                              ? "primary.50"
                              : "background.paper",
                          "&:hover": {
                            boxShadow: 3,
                            bgcolor:
                              selectedExercise?.id === exercise.id
                                ? "primary.50"
                                : "grey.50",
                          },
                          transition: "all 0.2s",
                        }}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "medium", mb: 0.5 }}
                              >
                                {exercise.name}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                flexWrap="wrap"
                              >
                                <Chip
                                  label={exercise.level}
                                  size="small"
                                  color={getDifficultyColor(exercise.level)}
                                  sx={{ height: 20, fontSize: "0.7rem" }}
                                />
                                {exercise.equipment.map((eq) => (
                                  <Chip
                                    key={eq}
                                    label={eq}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: "0.7rem" }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                            <IconButton size="small" color="primary">
                              <PlayArrowIcon />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <FitnessCenterIcon
                    sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                  />
                  <Typography
                    color="text.secondary"
                    variant="h6"
                    sx={{ mb: 1 }}
                  >
                    Get Started
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Choose a muscle group to see available exercises
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, position: "sticky", top: 20 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Exercise Details
              </Typography>
              {selectedExercise ? (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    {selectedExercise.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {selectedExercise.desc}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={addSetToLog}
                    sx={{ mb: 2 }}
                  >
                    Add Set
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold" }}
                  >
                    Today's Sets
                  </Typography>

                  {workoutLog.filter(
                    (set) => set.exerciseName === selectedExercise.name
                  ).length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        No sets logged yet. Click "Add Set" to start!
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {workoutLog
                        .filter(
                          (set) => set.exerciseName === selectedExercise.name
                        )
                        .map((set, localIndex) => (
                          <Paper
                            key={set.id}
                            variant="outlined"
                            sx={{ p: 1.5 }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                sx={{ minWidth: 30, fontWeight: "bold" }}
                              >
                                Set {localIndex + 1}
                              </Typography>
                              <TextField
                                size="small"
                                label="Reps"
                                type="number"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSet(set.id, "reps", e.target.value)
                                }
                                inputRef={
                                  workoutLog[workoutLog.length - 1]?.id ===
                                  set.id
                                    ? lastInputRef
                                    : null
                                }
                                inputProps={{ min: 0 }}
                                sx={{ width: 70 }}
                              />
                              {!isBodyweightExercise(selectedExercise) && (
                                <>
                                  <TextField
                                    size="small"
                                    label="Weight"
                                    type="number"
                                    value={set.weight}
                                    onChange={(e) =>
                                      updateSet(
                                        set.id,
                                        "weight",
                                        e.target.value
                                      )
                                    }
                                    inputProps={{ min: 0 }}
                                    sx={{ width: 80 }}
                                  />
                                  <Typography variant="caption">lbs</Typography>
                                </>
                              )}
                              {localIndex > 0 && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    copyPreviousSet(
                                      selectedExercise.name,
                                      set.id
                                    )
                                  }
                                  title="Copy previous set"
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeSet(set.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Paper>
                        ))}
                    </Stack>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 60, color: "grey.300", mb: 2 }}
                  />
                  <Typography color="text.secondary" variant="body2">
                    Select an exercise to view details and log sets
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {workoutLog.length > 0 && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <Container maxWidth="xl">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Sets
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {totalSets}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Exercises
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {uniqueExercises}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Reps
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {totalReps}
                  </Typography>
                </Box>
                {totalVolume > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Volume
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {totalVolume.toLocaleString()} lbs
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={() => alert("Workout saved! (Connect to backend)")}
              >
                Finish Workout
              </Button>
            </Stack>
          </Container>
        </Paper>
      )}
      <Footer />
    </Box>
  );
}

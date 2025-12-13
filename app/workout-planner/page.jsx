"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Footer from "../components/footer";
import ExerciseList from "../components/ExerciseList";
import ExerciseDetails from "../components/ExerciseDetails";
import AISuggestions from "../components/AISuggestions";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function WorkoutTracker() {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

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
          id: ex.id,
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "220px 1fr 380px",
            },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 2, borderRadius: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Muscle Groups
            </Typography>
            
            {/* AI Suggestions Button */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<AutoAwesomeIcon />}
              onClick={() => setAiDialogOpen(true)}
              sx={{
                mb: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                },
              }}
            >
              AI Suggestions
            </Button>

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

          {/* Exercise List */}
          <ExerciseList
            selectedMuscle={selectedMuscle}
            exercises={exercises}
            loading={loading}
            selectedExercise={selectedExercise}
            onSelectExercise={setSelectedExercise}
          />

          {/* Exercise Details */}
          <ExerciseDetails
            selectedExercise={selectedExercise}
            workoutLog={workoutLog}
            onAddSet={addSetToLog}
            onUpdateSet={updateSet}
            onRemoveSet={removeSet}
            onCopyPreviousSet={copyPreviousSet}
          />
        </Box>
      </Container>

      <AISuggestions
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        muscleGroups={muscleGroups.map(m => m.name)}
      />

      {/* Workout Summary Bar */}
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
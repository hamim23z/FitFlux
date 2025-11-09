
'use client';

import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function WorkoutTracker() {
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutLog, setWorkoutLog] = useState([]);

  // Muscle groups
  const muscleGroups = [
    { name: 'Chest', color: '#e57373' },
    { name: 'Back', color: '#64b5f6' },
    { name: 'Shoulders', color: '#81c784' },
    { name: 'Arms', color: '#ffb74d' },
    { name: 'Legs', color: '#ba68c8' },
    { name: 'Core', color: '#4db6ac' },
  ];

  // Sample exercises (you'll replace with real data/API later)
  const exercises = {
    Chest: [
      { id: 1, name: 'Bench Press', videoUrl: 'https://example.com/bench-press' },
      { id: 2, name: 'Push-ups', videoUrl: 'https://example.com/pushups' },
      { id: 3, name: 'Dumbbell Flyes', videoUrl: 'https://example.com/flyes' },
    ],
    Back: [
      { id: 4, name: 'Pull-ups', videoUrl: 'https://example.com/pullups' },
      { id: 5, name: 'Barbell Rows', videoUrl: 'https://example.com/rows' },
      { id: 6, name: 'Lat Pulldowns', videoUrl: 'https://example.com/lat-pulldown' },
    ],
    Shoulders: [
      { id: 7, name: 'Overhead Press', videoUrl: 'https://example.com/ohp' },
      { id: 8, name: 'Lateral Raises', videoUrl: 'https://example.com/lateral' },
      { id: 9, name: 'Face Pulls', videoUrl: 'https://example.com/face-pulls' },
    ],
    Arms: [
      { id: 10, name: 'Bicep Curls', videoUrl: 'https://example.com/curls' },
      { id: 11, name: 'Tricep Dips', videoUrl: 'https://example.com/dips' },
      { id: 12, name: 'Hammer Curls', videoUrl: 'https://example.com/hammer' },
    ],
    Legs: [
      { id: 13, name: 'Squats', videoUrl: 'https://example.com/squats' },
      { id: 14, name: 'Deadlifts', videoUrl: 'https://example.com/deadlifts' },
      { id: 15, name: 'Leg Press', videoUrl: 'https://example.com/leg-press' },
    ],
    Core: [
      { id: 16, name: 'Planks', videoUrl: 'https://example.com/planks' },
      { id: 17, name: 'Crunches', videoUrl: 'https://example.com/crunches' },
      { id: 18, name: 'Russian Twists', videoUrl: 'https://example.com/twists' },
    ],
  };

  const addSetToLog = () => {
    if (!selectedExercise) return;
    
    const newSet = {
      id: Date.now(),
      exerciseName: selectedExercise.name,
      sets: '',
      reps: '',
      weight: '',
    };
    setWorkoutLog([...workoutLog, newSet]);
  };

  const updateSet = (id, field, value) => {
    setWorkoutLog(workoutLog.map(set => 
      set.id === id ? { ...set, [field]: value } : set
    ));
  };

  const removeSet = (id) => {
    setWorkoutLog(workoutLog.filter(set => set.id !== id));
  };

  return (
    <Box>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Workout Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select a muscle group, choose exercises, and track your sets and reps.
        </Typography>

        <Grid container spacing={3}>
          {/* Left Panel - Muscle Groups */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Muscle Groups
              </Typography>
              <Stack spacing={1}>
                {muscleGroups.map((muscle) => (
                  <Button
                    key={muscle.name}
                    variant={selectedMuscle === muscle.name ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: muscle.color,
                      color: selectedMuscle === muscle.name ? '#fff' : muscle.color,
                      bgcolor: selectedMuscle === muscle.name ? muscle.color : 'transparent',
                      '&:hover': {
                        bgcolor: selectedMuscle === muscle.name ? muscle.color : `${muscle.color}20`,
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

          {/* Middle Panel - Exercises */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                {selectedMuscle ? `${selectedMuscle} Exercises` : 'Select a Muscle Group'}
              </Typography>
              
              {selectedMuscle ? (
                <Grid container spacing={2}>
                  {exercises[selectedMuscle]?.map((exercise) => (
                    <Grid item xs={12} key={exercise.id}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedExercise?.id === exercise.id ? '2px solid' : '1px solid',
                          borderColor: selectedExercise?.id === exercise.id ? 'primary.main' : 'divider',
                          '&:hover': {
                            boxShadow: 3,
                          },
                        }}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {exercise.name}
                            </Typography>
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
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    Choose a muscle group to see available exercises
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Panel - Video & Tracking */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Exercise Details
              </Typography>
              
              {selectedExercise ? (
                <Box>
                  {/* Video Placeholder */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      bgcolor: 'grey.200',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Stack alignItems="center" spacing={1}>
                      <PlayArrowIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                      <Typography color="text.secondary" variant="body2">
                        Video: {selectedExercise.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        (Video player placeholder)
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {selectedExercise.name}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={addSetToLog}
                    sx={{ mb: 2 }}
                  >
                    Log Set
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Today's Sets
                  </Typography>
                  
                  <Stack spacing={1.5}>
                    {workoutLog
                      .filter(set => set.exerciseName === selectedExercise.name)
                      .map((set) => (
                        <Paper key={set.id} variant="outlined" sx={{ p: 1.5 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                              size="small"
                              label="Reps"
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateSet(set.id, 'reps', e.target.value)}
                              sx={{ width: 70 }}
                            />
                            <TextField
                              size="small"
                              label="Weight"
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateSet(set.id, 'weight', e.target.value)}
                              sx={{ width: 80 }}
                            />
                            <Typography variant="caption">lbs</Typography>
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
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Select an exercise to view details and log sets
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Workout Summary */}
        {workoutLog.length > 0 && (
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Workout Summary
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(
                workoutLog.reduce((acc, set) => {
                  if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
                  acc[set.exerciseName].push(set);
                  return acc;
                }, {})
              ).map(([exerciseName, sets]) => (
                <Grid item xs={12} sm={6} md={4} key={exerciseName}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {exerciseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sets.length} set{sets.length > 1 ? 's' : ''} completed
                      </Typography>
                      {sets.map((set, idx) => (
                        <Typography key={set.id} variant="caption" display="block">
                          Set {idx + 1}: {set.reps || '?'} reps @ {set.weight || '?'} lbs
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
      <Footer/>
    </Box>
  );
}
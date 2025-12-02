import { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DialogCard from "./DialogComponent";

export default function ExerciseDetails({
  selectedExercise,
  workoutLog,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onCopyPreviousSet,
}) {
  const lastInputRef = useRef(null);

  useEffect(() => {
    if (lastInputRef.current) lastInputRef.current.focus();
  }, [workoutLog.length]);

  const isBodyweightExercise = (exercise) =>
    exercise?.equipment?.includes("Body Weight");

  const exerciseSets = selectedExercise
    ? workoutLog.filter((set) => set.exerciseName === selectedExercise.name)
    : [];

  console.log(selectedExercise);

  //for the dialog when users click the video button
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Paper sx={{ p: 2, borderRadius: 3, position: "sticky", top: 20 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Exercise Details
      </Typography>
      {selectedExercise ? (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            {selectedExercise.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedExercise.desc}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={onAddSet}
            >
              Add Set
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              onClick={handleOpen}
              sx={{ minWidth: 120 }}
            >
              Video
            </Button>
          </Stack>

          {/**for the dialog when people click video */}
          <DialogCard
            open={open}
            handleClose={handleClose}
            data={selectedExercise}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            Today's Sets
          </Typography>

          {exerciseSets.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No sets logged yet. Click "Add Set" to start!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {exerciseSets.map((set, localIndex) => (
                <Paper key={set.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
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
                        onUpdateSet(set.id, "reps", e.target.value)
                      }
                      inputRef={
                        workoutLog[workoutLog.length - 1]?.id === set.id
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
                            onUpdateSet(set.id, "weight", e.target.value)
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
                          onCopyPreviousSet(selectedExercise.name, set.id)
                        }
                        title="Copy previous set"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveSet(set.id)}
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
          <CheckCircleIcon sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
          <Typography color="text.secondary" variant="body2">
            Select an exercise to view details and log sets
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Stack,
  Chip,
  Paper,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function ExerciseList({
  selectedMuscle,
  exercises,
  loading,
  selectedExercise,
  onSelectExercise,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState([]);

  const getDifficultyColor = (difficulty) => {
    const level = parseInt(difficulty);
    if (level === 1) return "success";
    if (level === 2) return "info";
    if (level === 3) return "warning";
    if (level >= 4) return "error";
    return "default";
  };

  const getFilteredExercises = () => {
    if (!selectedMuscle || !exercises[selectedMuscle]) return [];

    let filtered = exercises[selectedMuscle];

    if (searchQuery) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (equipmentFilter.length > 0) {
      filtered = filtered.filter((ex) =>
        ex.equipment.some((eq) => equipmentFilter.includes(eq))
      );
    }

    if (difficultyFilter.length > 0) {
      filtered = filtered.filter((ex) =>
        difficultyFilter.includes(ex.level?.toString())
      );
    }

    return filtered;
  };

  const filteredExercises = getFilteredExercises();

  const handleEquipmentFilter = (event, newFilters) => {
    setEquipmentFilter(newFilters);
  };

  const handleDifficultyFilter = (event, newFilters) => {
    setDifficultyFilter(newFilters);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3, minHeight: 400 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        {selectedMuscle
          ? `${selectedMuscle} Exercises`
          : "Select a Muscle Group"}
      </Typography>

      {selectedMuscle && (
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 150 }}
            />

            <ToggleButtonGroup
              value={equipmentFilter}
              onChange={handleEquipmentFilter}
              size="small"
            >
              <ToggleButton value="Barbell" sx={{ px: 1 }}>
                BB
              </ToggleButton>
              <ToggleButton value="Dumbbell" sx={{ px: 1 }}>
                DB
              </ToggleButton>
              <ToggleButton value="Cable" sx={{ px: 1 }}>
                Cable
              </ToggleButton>
              <ToggleButton value="Body Weight" sx={{ px: 1 }}>
                BW
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={difficultyFilter}
              onChange={handleDifficultyFilter}
              size="small"
            >
              <ToggleButton value="1">1</ToggleButton>
              <ToggleButton value="2">2</ToggleButton>
              <ToggleButton value="3">3</ToggleButton>
              <ToggleButton value="4">4</ToggleButton>
              <ToggleButton value="5">5</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
      )}

      {loading ? (
        <Typography>Loading exercises...</Typography>
      ) : selectedMuscle ? (
        <Box
          sx={{
            maxHeight: 500,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.100",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.400",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "grey.500",
              },
            },
          }}
        >
          {filteredExercises.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1,
              }}
            >
              {filteredExercises.map((exercise) => (
                <Card
                  key={exercise.id}
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
                      boxShadow: 2,
                      bgcolor:
                        selectedExercise?.id === exercise.id
                          ? "primary.50"
                          : "grey.50",
                    },
                    transition: "all 0.2s",
                    height: "100%",
                    minHeight: 70,
                  }}
                  onClick={() => onSelectExercise(exercise)}
                >
                  <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          wordWrap: "break-word",
                          lineHeight: 1.2,
                          fontSize: "0.8rem",
                          minHeight: 28,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {exercise.name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                      >
                        <Chip
                          label={exercise.level}
                          size="small"
                          color={getDifficultyColor(exercise.level)}
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                        {exercise.equipment.length > 0 && (
                          <Chip
                            label={
                              exercise.equipment[0].length > 10
                                ? exercise.equipment[0].substring(0, 10)
                                : exercise.equipment[0]
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: "0.65rem",
                              "& .MuiChip-label": { px: 0.75 },
                            }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No exercises match your filters. Try adjusting your search or
                filters.
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <FitnessCenterIcon
            sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
          />
          <Typography color="text.secondary" variant="h6" sx={{ mb: 1 }}>
            Get Started
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Choose a muscle group to see available exercises
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
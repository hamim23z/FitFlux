
"use client";
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Stack,
  Chip,
  InputAdornment,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "./footer";

export default function MealOptimizerView({
  onSubmit,
  isSubmitting,
  register,
  goal,
  handleGoalChange,
  ingredientInput,
  setIngredientInput,
  addIngredient,
  removeIngredient,
  ingredients,
  plan,
  apiErrors = [],
  onSave,
}) {
  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h3" fontWeight={700}>
            Meal Optimizer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Design a meal plan that matches your goals, time, and pantry.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: 4,
                bgcolor: "background.paper",
              }}
            >
              <form onSubmit={onSubmit}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Your Info
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="Weight"
                      type="number"
                      {...register("weight")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">lbs</InputAdornment>
                        ),
                      }}
                      helperText="Enter your weight in lbs"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="Age"
                      type="number"
                      {...register("age")}
                      helperText="Enter your age"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="Height"
                      type="number"
                      {...register("height")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">cm</InputAdornment>
                        ),
                      }}
                      helperText="Enter your height in cm"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="Prep Time Limit"
                      type="number"
                      {...register("prepTime")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">min</InputAdornment>
                        ),
                      }}
                      helperText="1–180 minutes"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      select
                      fullWidth
                      label="Gender"
                      defaultValue="male"
                      {...register("gender")}
                      helperText='Must be "male" or "female"'
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}
                    >
                      Goal
                    </Typography>

                    <ToggleButtonGroup
                      value={goal}
                      exclusive
                      onChange={handleGoalChange}
                      size="small"
                      color="primary"
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <ToggleButton value="lose">Lose Weight</ToggleButton>
                      <ToggleButton value="maintain">Maintain</ToggleButton>
                      <ToggleButton value="gain">Build Muscle</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Ingredients You Have
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add foods you usually keep at home.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    fullWidth
                    label="Add Ingredient"
                    placeholder="e.g. chicken breast, oats, spinach"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIngredient();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addIngredient}
                  >
                    Add
                  </Button>
                </Stack>

                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                  {ingredients.map((i) => (
                    <Chip
                      key={i}
                      label={i}
                      onDelete={() => removeIngredient(i)}
                      deleteIcon={<DeleteIcon />}
                    />
                  ))}
                </Stack>

                {apiErrors.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Alert severity="error">
                      <Stack spacing={0.5}>
                        {apiErrors.map((e, idx) => (
                          <Typography key={idx} variant="body2">
                            • {e}
                          </Typography>
                        ))}
                      </Stack>
                    </Alert>
                  </Box>
                )}

                <Box textAlign="center" sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ px: 5, borderRadius: 999 }}
                  >
                    {isSubmitting ? "Generating your plan..." : "Generate Meal Plan"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={4}>
              <Card
                sx={{
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    Plan Preview
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Personalized plan based on your inputs
                  </Typography>
                </Box>

                <CardContent>
                  {plan ? (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        Daily Calories (est.)
                      </Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                        {plan.estimated_total_calories ?? 0} kcal
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {plan.summary}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Meals:
                      </Typography>

                      {plan.meals?.map((m, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <strong>{m.name}:</strong> {m.description}
                          </Typography>
                        </Box>
                      ))}

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, borderRadius: 999 }}
                        onClick={onSave}
                      >
                        Save to Dashboard
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Fill out your info on the left and click "Generate Meal Plan".
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
                  maxHeight: 520,
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    Meal Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Ingredients, recipe, and nutrients for each meal
                  </Typography>
                </Box>

                <CardContent>
                  {plan ? (
                    <>
                      {plan.meals?.map((m, idx) => (
                        <Box key={idx} sx={{ mb: 3 }}>
                          <Typography variant="h6">{m.name}</Typography>

                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            Ingredients:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {Array.isArray(m.ingredients) ? m.ingredients.join(", ") : "—"}
                          </Typography>

                          <Typography variant="subtitle2">Instructions:</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {m.instructions || "—"}
                          </Typography>

                          <Typography variant="subtitle2">Macros (approx.):</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {m.calories ?? 0} kcal • P {m.protein_g ?? 0}g • C {m.carbs_g ?? 0}g • F{" "}
                            {m.fats_g ?? 0}g • Prep {m.prep_time_minutes ?? 0} min
                          </Typography>

                          <Divider sx={{ mt: 2 }} />
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No meal details available yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

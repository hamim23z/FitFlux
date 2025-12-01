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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "../footer";

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
  result,
  nutrition,
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

        <Grid container spacing={4} justifyContent="center" alignItems="center">
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
                      fullWidth
                      label="Prep Time Limit"
                      type="number"
                      {...register("prepTime")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">min</InputAdornment>
                        ),
                      }}
                    />
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
                    >
                      <ToggleButton value="Lose">Lose Weight</ToggleButton>
                      <ToggleButton value="Maintain">Maintain</ToggleButton>
                      <ToggleButton value="Gain">Build Muscle</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Ingredients You Have
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Add foods you usually keep at home.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    fullWidth
                    required
                    label="Add Ingredient"
                    placeholder="e.g. chicken breast, oats, spinach"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addIngredient()}
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

                <Box textAlign="center" sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ px: 5, borderRadius: 999 }}
                  >
                    {isSubmitting
                      ? "Generating your plan..."
                      : "Generate Meal Plan"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/**main component for plan preview and the meal details */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
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

                <CardContent sx={{ flexGrow: 1 }}>
                  {result ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Daily Calories
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {result.calories ?? 0} kcal
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Macros (approx.)
                          </Typography>
                          <Typography variant="body1">
                            Protein:{" "}
                            <strong>{result.macros?.protein ?? 0} g</strong> |
                            Carbs:{" "}
                            <strong>{result.macros?.carbs ?? 0} g</strong> |
                            Fats: <strong>{result.macros?.fats ?? 0} g</strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            Goal: <strong>{result.goal ?? "—"}</strong>
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Sample Day of Meals:
                      </Typography>

                      {["breakfast", "lunch", "dinner"].map((mealKey) => {
                        const meal = result?.meals?.[mealKey];
                        if (!meal) return null;
                        return (
                          <Box key={mealKey} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>
                                {mealKey.charAt(0).toUpperCase() +
                                  mealKey.slice(1)}
                                :
                              </strong>{" "}
                              {meal.recipe_name ?? "—"}
                            </Typography>
                          </Box>
                        );
                      })}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Fill out your info on the left and click "Generate Meal
                      Plan".
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/**the new meail details card */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
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

                <CardContent sx={{ flexGrow: 1 }}>
                  {result ? (
                    <>
                      {["breakfast", "lunch", "dinner"].map((mealKey) => {
                        const meal = result?.meals?.[mealKey];
                        if (!meal) return null;

                        console.log(meal);
                        return (
                          <Box key={mealKey} sx={{ mb: 3 }}>
                            <Typography variant="h6">
                              {mealKey.charAt(0).toUpperCase() +
                                mealKey.slice(1)}
                            </Typography>

                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              Ingredients:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {meal.ingredients || "No ingredients available"}
                            </Typography>

                            <Typography variant="subtitle2">
                              Instructions:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {meal.instructions || "No instructions available"}
                            </Typography>

                            <Typography variant="subtitle2">
                              Nutrients (approx.):
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              All Nutrition:{" "}
                              {meal.nutrition?.slice(0, 600) + "." ||
                                "No nutrition info"}
                            </Typography>

                            <Divider sx={{ mt: 2 }} />
                          </Box>
                        );
                      })}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No meal details available yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

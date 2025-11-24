'use client';

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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from './navbar';
import Footer from './Footer';

export default function MealOptimizerView({
  onSubmit,
  isSubmitting,
  register,
  goal,
  dietPrefs,
  restrictions,
  handleGoalChange,
  ingredientInput,
  setIngredientInput,
  addIngredient,
  removeIngredient,
  ingredients,
  result,
}) {
  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            Meal Optimizer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Design a meal plan that matches your goals, time, and kitchen. Adjust your inputs and see a personalized preview update.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: 4,
                bgcolor: 'background.paper',
              }}
            >
              <form onSubmit={onSubmit}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Your Info
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Weight"
                      type="number"
                      {...register('weight')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">lbs</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      {...register('age')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Free Time (weekly)"
                      type="number"
                      {...register('freeTime')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">hrs</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Prep Time Limit"
                      type="number"
                      {...register('prepTime')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">min</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Goal
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      What are you aiming for right now?
                    </Typography>
                    <ToggleButtonGroup
                      value={goal}
                      exclusive
                      onChange={handleGoalChange}
                      size="small"
                      color="primary"
                    >
                      <ToggleButton value="lose">Lose Weight</ToggleButton>
                      <ToggleButton value="maintain">Maintain</ToggleButton>
                      <ToggleButton value="gain">Build Muscle</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      Dietary Style
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dietPrefs?.vegetarian || false}
                            {...register('dietPrefs.vegetarian')}
                          />
                        }
                        label="Vegetarian"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dietPrefs?.vegan || false}
                            {...register('dietPrefs.vegan')}
                          />
                        }
                        label="Vegan"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={dietPrefs?.pescatarian || false}
                            {...register('dietPrefs.pescatarian')}
                          />
                        }
                        label="Pescatarian"
                      />
                    </FormGroup>

                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Restrictions
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restrictions?.dairyFree || false}
                            {...register('restrictions.dairyFree')}
                          />
                        }
                        label="Dairy-free"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restrictions?.glutenFree || false}
                            {...register('restrictions.glutenFree')}
                          />
                        }
                        label="Gluten-free"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restrictions?.nutFree || false}
                            {...register('restrictions.nutFree')}
                          />
                        }
                        label="Nut-free"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Ingredients You Have( We should add a dataset or json that contians a lot of foods and if an input is not in the dataset then we return an error msg)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add foods you usually keep at home. The plan will prioritize these.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    fullWidth
                    label="Add Ingredient"
                    placeholder="e.g. chicken breast, oats, spinach"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addIngredient}
                    sx={{ whiteSpace: 'nowrap' }}
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
                      sx={{ mb: 1 }}
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
                    {isSubmitting ? 'Generating your plan...' : 'Generate Meal Plan'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card
              sx={{
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  Plan Preview
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  This is how The plan should be summerized, Backend call to Api/ Using Ai to generate based on user input
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
                          {result.calories} kcal
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
                          Protein:{' '}
                          <strong>{result.macros.protein} g</strong> &nbsp;|&nbsp;
                          Carbs: <strong>{result.macros.carbs} g</strong> &nbsp;|&nbsp;
                          Fats: <strong>{result.macros.fats} g</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Goal: <strong>{result.goal}</strong>
                        </Typography>
                      </Grid>
                    </Grid>

                    {(result.prefs.length > 0 ||
                      result.restrictions.length > 0) && (
                      <Box sx={{ mt: 2 }}>
                        {result.prefs.length > 0 && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            Dietary style:&nbsp;
                            <strong>{result.prefs.join(', ')}</strong>
                          </Typography>
                        )}
                        {result.restrictions.length > 0 && (
                          <Typography variant="body2">
                            Restrictions:&nbsp;
                            <strong>{result.restrictions.join(', ')}</strong>
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Sample Day
                    </Typography>
                    <Typography variant="body2">
                      <strong>Breakfast:</strong> {result.sampleDay.breakfast}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Lunch:</strong> {result.sampleDay.lunch}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Dinner:</strong> {result.sampleDay.dinner}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 2 }}
                    >
                      This is a placeholder for backend.
                    </Typography>
                  </>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      py: 6,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No plan yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fill out your info on the left and click
                      &nbsp;<strong>Generate Meal Plan</strong> to see a preview here.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

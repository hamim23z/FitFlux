import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import Link from 'next/link';

function pct(current, target) {
  return Math.min(100, Math.round((current / target) * 100 || 0));
}

export default function DashboardView({
  summary,
  todayWorkout,
  todayNutrition,
  insights,
  workoutLabel = "Week 1",
}) {
  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your adaptive overview. See how your training and nutrition are tracking
          and what FitFlux is adjusting for you this week.
        </Typography>

        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Weekly Adherence
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                  {summary.adherence}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={summary.adherence}
                  sx={{ mt: 2, borderRadius: 999 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Based on completed sets, logged calories, and check-ins.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Daily Calorie Target
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                  {summary.calorieTarget}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    &nbsp;kcal
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Adjusted weekly using Bayesian weight trend estimation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Avg Weight Change
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                  {summary.avgWeightChange > 0 ? '+' : ''}
                  {summary.avgWeightChange}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    &nbsp;lb / week
                  </Typography>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Smoothed over the last 2–3 weeks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Workouts This Week
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                  {summary.workoutsCompleted}/{summary.workoutsPlanned}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct(
                    summary.workoutsCompleted,
                    summary.workoutsPlanned
                  )}
                  sx={{ mt: 2, borderRadius: 999 }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip
                    size="small"
                    label="View plan"
                    component={Link}
                    href="/workout-planner"
                    clickable
                  />
                  <Chip size="small" label="Log session" color="primary" clickable />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={600}>
                    Today&apos;s Workout
                  </Typography>
                  <Chip size="small" label={workoutLabel} />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5}>
                  {todayWorkout.map((ex) => (
                    <Box
                      key={ex.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        px: 2,
                        py: 1.2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {ex.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ex.sets} · {ex.load}
                        </Typography>
                      </Box>
                      <Button size="small" variant="outlined">
                        Log
                      </Button>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    size="small"
                    component={Link}
                    href="/workout-planner"
                    variant="text"
                  >
                    Open full program
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={600}>
                    Today&apos;s Nutrition
                  </Typography>
                  <Chip
                    size="small"
                    label="Linked to Meal Optimizer"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  {['calories', 'protein', 'carbs', 'fats'].map((key) => {
                    const label =
                      key === 'calories'
                        ? 'Calories'
                        : key.charAt(0).toUpperCase() + key.slice(1);
                    const unit = key === 'calories' ? 'kcal' : 'g';
                    const c = todayNutrition[key];
                    return (
                      <Box key={key}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            {label}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {c.current}/{c.target} {unit}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={pct(c.current, c.target)}
                          sx={{ mt: 0.5, borderRadius: 999 }}
                        />
                      </Box>
                    );
                  })}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    component={Link}
                    href="/meal"
                  >
                    Open Meal Optimizer
                  </Button>
                  <Button fullWidth size="small" variant="outlined">
                    Generate grocery list
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Insights + quick actions */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Adaptive Insights
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Generated from your adherence, weight trend, and logged
                  sessions.
                </Typography>

                <Stack spacing={1.5}>
                  {insights.map((text, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        bgcolor: 'grey.100',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body2">{text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Quick Actions
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Jump into key tools and keep your week on track.
                </Typography>

                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    href="/meal"
                  >
                    Re-run Meal Optimizer
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    href="/workout-planner"
                  >
                    Adjust Workout Volume
                  </Button>
                  <Button fullWidth variant="outlined">
                    Log Today&apos;s Weight
                  </Button>
                  <Button fullWidth variant="outlined">
                    Review Last Week&apos;s Summary
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

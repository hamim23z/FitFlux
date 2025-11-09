'use client';

import { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/navbar';

export default function MealOptimizer() {
  const [form, setForm] = useState({
    weight: '',
    age: '',
    freeTime: '',
    prepTime: '',
  });

  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState(['chicken', 'rice', 'broccoli']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addIngredient = () => {
    const v = ingredient.trim();
    if (!v || ingredients.includes(v)) return;
    setIngredients((prev) => [...prev, v]);
    setIngredient('');
  };

  const removeIngredient = (name) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    await new Promise((r) => setTimeout(r, 1000));
    setResult('backend placment.');
    setLoading(false);
  };

  return (
    <Box>
      <Navbar />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Meal Optimizer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your info and available ingredients to generate a customized meal plan.
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Weight"
                type="number"
                value={form.weight}
                onChange={handleChange('weight')}
                InputProps={{ endAdornment: <InputAdornment position="end">lbs</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={form.age}
                onChange={handleChange('age')}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Free Time (weekly)"
                type="number"
                value={form.freeTime}
                onChange={handleChange('freeTime')}
                InputProps={{ endAdornment: <InputAdornment position="end">hrs</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Prep Time Limit"
                type="number"
                value={form.prepTime}
                onChange={handleChange('prepTime')}
                InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
              />
            </Grid>
          </Grid>

       
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Add Ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            />
            <Button variant="contained" startIcon={<AddIcon />} onClick={addIngredient}>
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
            <Button variant="contained" size="large" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Meal Plan'}
            </Button>
          </Box>

        
          {result && (
            <Paper variant="outlined" sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{result}</Typography>
            </Paper>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

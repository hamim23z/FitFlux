'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import MealOptimizerView from '../components/MealOptimizerView';

export default function MealOptimizerPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      weight: '',
      age: '',
      freeTime: '',
      prepTime: '',
      goal: 'maintain',
      dietPrefs: {
        vegetarian: false,
        vegan: false,
        pescatarian: false,
      },
      restrictions: {
        dairyFree: false,
        glutenFree: false,
        nutFree: false,
      },
    },
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState(['chicken', 'rice', 'broccoli']);
  const [result, setResult] = useState(null);

  const goal = watch('goal');
  const dietPrefs = watch('dietPrefs');
  const restrictions = watch('restrictions');

  const handleGoalChange = (_e, newGoal) => {
    if (newGoal) setValue('goal', newGoal);
  };

  const addIngredient = () => {
    const v = ingredientInput.trim().toLowerCase();
    if (!v || ingredients.includes(v)) return;
    setIngredients((prev) => [...prev, v]);
    setIngredientInput('');
  };

  const removeIngredient = (name) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  const onSubmit = async (data) => {
    setResult(null);

    await new Promise((r) => setTimeout(r, 800));

    const weightNum = Number(data.weight) || 0;
    let calories = weightNum * 14;
    if (data.goal === 'lose') calories -= 400;
    if (data.goal === 'gain') calories += 300;
    calories = Math.max(1200, Math.round(calories));

    const protein = Math.max(60, Math.round(weightNum * 0.8 || 80));
    const fats = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(
      0,
      Math.round((calories - protein * 4 - fats * 9) / 4)
    );

    const activePrefs = Object.entries(data.dietPrefs || {})
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1'));

    const activeRestrictions = Object.entries(data.restrictions || {})
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1'));

    const primaryIngredient = ingredients[0] || 'chicken';
    const sideIngredient = ingredients[1] || 'rice';
    const veggieIngredient = ingredients[2] || 'broccoli';

    setResult({
      calories,
      macros: { protein, carbs, fats },
      ingredients,
      goal: data.goal,
      prefs: activePrefs,
      restrictions: activeRestrictions,
      sampleDay: {
        breakfast: `${primaryIngredient} & ${veggieIngredient} omelette with whole grains`,
        lunch: `${primaryIngredient} bowl with ${sideIngredient} and ${veggieIngredient}`,
        dinner: `${primaryIngredient} stir-fry with mixed veggies`,
      },
    });
  };

  return (
    <MealOptimizerView
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      register={register}
      goal={goal}
      dietPrefs={dietPrefs}
      restrictions={restrictions}
      handleGoalChange={handleGoalChange}
      ingredientInput={ingredientInput}
      setIngredientInput={setIngredientInput}
      addIngredient={addIngredient}
      removeIngredient={removeIngredient}
      ingredients={ingredients}
      result={result}
    />
  );
}

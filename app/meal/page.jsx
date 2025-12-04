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
      height: '',
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

    try {
      const res = await fetch('/api/meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: data.weight,
          height: data.height,
          age: data.age,
          goal: data.goal,
          ingredients,
          dietPrefs: data.dietPrefs,
          restrictions: data.restrictions,
        }),
      });
      const json = await res.json();

      if (json.error) {
        console.error('API returned error:', json.error);
        setResult(null);
        return;
      }
      setResult(json);
    } catch (err) {
      console.error('Request failed:', err);
      setResult(null);
    }
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
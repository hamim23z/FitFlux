"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import MealOptimizerView from "../components/MealOptimizerView";

export default function MealOptimizerPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      weight: "",
      age: "",
      height: "",
      prepTime: "",
      gender: "male",
      goal: "maintain",
    },
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState(["chicken", "rice", "broccoli"]);
  const [plan, setPlan] = useState(null);
  const [apiErrors, setApiErrors] = useState([]);

  const goal = watch("goal");

  const handleGoalChange = (_e, newGoal) => {
    if (newGoal) setValue("goal", newGoal);
  };

  const addIngredient = () => {
    const v = ingredientInput.trim().toLowerCase();
    if (!v || ingredients.includes(v)) return;
    setIngredients((prev) => [...prev, v]);
    setIngredientInput("");
  };

  const removeIngredient = (name) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  const buildNutritionSnapshot = (p) => {
    const meals = Array.isArray(p?.meals) ? p.meals : [];

    const sum = (k) =>
      meals.reduce((acc, m) => acc + (Number(m?.[k]) || 0), 0);

    const calories = Number(p?.estimated_total_calories) || sum("calories");
    const protein = sum("protein_g");
    const carbs = sum("carbs_g");
    const fats = sum("fats_g");

    return {
      calories: { current: calories, target: calories },
      protein: { current: protein, target: protein },
      carbs: { current: carbs, target: carbs },
      fats: { current: fats, target: fats },
      source: "meal-optimizer",
      savedAt: Date.now(),
    };
  };

  const saveToDashboard = () => {
    if (!plan) return;
    const snapshot = buildNutritionSnapshot(plan);
    localStorage.setItem("fitflux_todayNutrition", JSON.stringify(snapshot));
    localStorage.setItem("fitflux_plan", JSON.stringify(plan));
    localStorage.setItem(
      "fitflux_calorieTarget",
      String(snapshot?.calories?.target ?? 0)
    );
  };

  const onSubmit = async (data) => {
    setPlan(null);
    setApiErrors([]);

    try {
      const res = await fetch("/api/openai/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightLbs: data.weight,
          age: data.age,
          heightCm: data.height,
          gender: data.gender,
          prepTimeMinutes: data.prepTime,
          ingredients,
          goal,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setApiErrors(json?.errors || [json?.error || "Request failed"]);
        return;
      }

      setPlan(json.plan);
    } catch (err) {
      console.error("Request failed:", err);
      setApiErrors([String(err?.message || err)]);
    }
  };

  return (
    <MealOptimizerView
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      register={register}
      goal={goal}
      handleGoalChange={handleGoalChange}
      ingredientInput={ingredientInput}
      setIngredientInput={setIngredientInput}
      addIngredient={addIngredient}
      removeIngredient={removeIngredient}
      ingredients={ingredients}
      plan={plan}
      apiErrors={apiErrors}
      onSave={saveToDashboard}
    />
  );
}

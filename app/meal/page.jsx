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
  const [ingredients, setIngredients] = useState([
    "chicken",
    "rice",
    "broccoli",
  ]);

  // ✅ this will store the OpenAI plan shape: { summary, estimated_total_calories, meals: [...] }
  const [plan, setPlan] = useState(null);

  // ✅ show route validation errors nicely
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

  // ✅ Calls the OpenAI route: /api/openai/meal
  const onSubmit = async (data) => {
    setPlan(null);
    setApiErrors([]);

    try {
      const res = await fetch("/api/openai/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ✅ match your openai/meal/route.js expected keys
          weightLbs: data.weight,
          age: data.age,
          heightCm: data.height,
          gender: data.gender,
          prepTimeMinutes: data.prepTime,
          ingredients,
        }),
      });

      const json = await res.json();

      // your OpenAI route returns { errors } on 400
      if (!res.ok) {
        setApiErrors(json?.errors || [json?.error || "Request failed"]);
        return;
      }

      // your OpenAI route returns { plan }
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
    />
  );
}

'use client';
import { useState } from 'react';
import Footer from '../components/Footer';
import DashboardView from '../components/DashboardView';

export default function DashboardPage() {
  const [summary] = useState({
    adherence: 82,
    calorieTarget: 2350,
    avgWeightChange: -0.4,
    workoutsCompleted: 3,
    workoutsPlanned: 4,
  });

  const [todayWorkout] = useState([
    { name: 'Back Squat', sets: '4 x 6', load: '185 lb' },
    { name: 'Bench Press', sets: '4 x 8', load: '135 lb' },
    { name: 'Lat Pulldown', sets: '3 x 10', load: '90 lb' },
  ]);

  const [todayNutrition] = useState({
    calories: { current: 1450, target: 2350 },
    protein: { current: 95, target: 150 },
    carbs: { current: 130, target: 230 },
    fats: { current: 40, target: 70 },
  });

  const [insights] = useState([
    'Calorie target lowered by 120 kcal this week based on slower weight loss and 80% adherence.',
    'Lower body volume reduced by 10% to improve recovery after 3 consecutive high-fatigue weeks.',
    'You consistently hit 90%+ of your protein target. Strength trend is positive—keep this up.',
  ]);

  return (
    <>
      <DashboardView
        summary={summary}
        todayWorkout={todayWorkout}
        todayNutrition={todayNutrition}
        insights={insights}
      />
      <Footer />
    </>
  );
}

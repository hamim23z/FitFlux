import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      experience = "beginner",   
      goal = "build muscle",     
      muscleGroups = [],         
      equipment = "gym",        
    } = body || {};

    const prompt = `
You are FitFlux's AI Strength Coach. Create a realistic, science-based workout program.

USER:
- Experience: ${experience}
- Goal: ${goal}
- Equipment: ${equipment}
- Muscle groups to train: ${
      Array.isArray(muscleGroups) ? muscleGroups.join(", ") : muscleGroups
    }

RULES:
1. Create ONE workout for EACH muscle group listed.
2. Each workout MUST include:
   - warm-up (simple and short)
   - 4–6 exercises targeting that muscle group
   - sets and reps appropriate for ${experience}
   - rest time (60–120s depending on intensity)
3. Exercises must match the available equipment: ${equipment}.
4. Keep instructions short and simple.
5. Never provide dangerous exercises.
6. Output ONLY valid JSON in the exact shape below.

OUTPUT SHAPE:
{
  "overview": "short summary",
  "workouts": [
    {
      "muscle_group": "Chest",
      "warmup": "5 minutes incline walk",
      "exercises": [
        { "name": "Bench Press", "sets": 4, "reps": "8-12", "rest": "90s" }
      ],
      "cooldown": "light chest stretch"
    }
  ]
}
`;

    const response = await openai.responses.create({
      model: "gpt-5.2",
      input: prompt,
      text: {
        format: { type: "json_object" },
      },
    });

    const jsonText =
      response.output?.[0]?.content?.[0]?.text?.value ??
      response.output_text; 

    if (!jsonText) {
      console.error("No text in GPT response:", response);
      return NextResponse.json(
        { error: "No text returned from GPT-5.2" },
        { status: 500 }
      );
    }

    let plan;
    try {
      plan = JSON.parse(jsonText);
    } catch (err) {
      console.error("AI returned invalid JSON:", err, jsonText);
      return NextResponse.json(
        { error: "Invalid JSON from GPT-5.2", raw: jsonText },
        { status: 500 }
      );
    }


    const totalExercises = plan.workouts?.reduce(
      (sum, w) => sum + (w.exercises?.length || 0),
      0
    ) || 0;

    const totalSets = plan.workouts?.reduce(
      (sum, w) =>
        sum +
        (w.exercises?.reduce(
          (s, e) => s + (parseInt(e.sets) || 0),
          0
        ) || 0),
      0
    ) || 0;

    return NextResponse.json({
      plan,
      meta: {
        experience,
        goal,
        muscleGroups: Array.isArray(muscleGroups) ? muscleGroups : [muscleGroups],
        equipment,
        totalExercises,
        totalSets,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Workout AI Error:", error);
    return NextResponse.json(
      {
        error: "Workout Planner Failed",
        message: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

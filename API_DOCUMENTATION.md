# FitFlux API Documentation

## Overview
All API endpoints require authentication via NextAuth. Include the session cookie with requests.

---

## Authentication Endpoints

### POST `/api/auth/[...nextauth]`
NextAuth handler. Supports OAuth providers: Google, GitHub, Discord.

**Response:**
- Redirects to `/workout-planner` on successful login

---

## User Profile Endpoints

### GET `/api/users/profile`
Get or create user profile.

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "string",
    "height_cm": 180,
    "sex": "male|female|other",
    "locale": "en-US",
    "tz": "America/New_York",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
}
```

### PUT `/api/users/profile`
Update user profile.

**Body:**
```json
{
  "displayName": "string",
  "heightCm": number,
  "sex": "male|female|other",
  "locale": "en-US",
  "tz": "America/New_York"
}
```

**Response:**
```json
{
  "success": true,
  "profile": {...},
  "message": "Profile updated successfully"
}
```

---

## Body Metrics Endpoints

### GET `/api/users/metrics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
Get body metrics for date range.

**Query Parameters:**
- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "metrics": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "date": "2025-11-24",
      "weight_kg": 85.5,
      "body_fat_pct": 18.5,
      "steps": 10000,
      "created_at": "ISO8601"
    }
  ]
}
```

### POST `/api/users/metrics`
Save or update body metrics for a date.

**Body:**
```json
{
  "date": "YYYY-MM-DD",
  "weightKg": number,
  "bodyFatPct": number,
  "steps": number
}
```

**Response:**
```json
{
  "success": true,
  "metric": {...},
  "message": "Body metrics saved successfully"
}
```

---

## Nutrition Endpoints

### GET `/api/meals/foods?q=chicken&limit=20`
Search for foods in catalog.

**Query Parameters:**
- `q` (optional): Search query
- `limit` (optional): Max results (default: 20)

**Response:**
```json
{
  "success": true,
  "foods": [
    {
      "id": "uuid",
      "name": "Chicken Breast",
      "brand": "string",
      "kcals_per_100g": 165,
      "protein_per_100g": 31,
      "carbs_per_100g": 0,
      "fat_per_100g": 3.6,
      "cost_per_100g": 0.25,
      "prep_minutes": 15,
      "is_active": true,
      "created_at": "ISO8601"
    }
  ]
}
```

### POST `/api/meals/generate`
Generate personalized meal plan.

**Body:**
```json
{
  "weight": number,        // lbs
  "age": number,
  "freeTime": number,      // hrs per week
  "prepTime": number,      // minutes per meal
  "ingredients": ["chicken", "rice", "broccoli"]
}
```

**Response:**
```json
{
  "success": true,
  "mealPlan": {
    "totalCalories": 2000,
    "targetProtein": 160,
    "targetCarbs": 225,
    "targetFat": 78,
    "prepTimeMinutes": 30,
    "meals": [
      {
        "name": "Breakfast",
        "timing": "7:00 AM",
        "calorieTarget": 500,
        "suggestedRecipes": [...]
      }
    ],
    "availableIngredients": ["chicken", "rice", "broccoli"],
    "prepTimeLimit": 30
  },
  "message": "Meal plan generated successfully"
}
```

### GET `/api/nutrition/daily?date=YYYY-MM-DD`
Get daily nutrition log.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (default: today)

**Response:**
```json
{
  "success": true,
  "nutritionDay": {
    "id": "uuid",
    "user_id": "uuid",
    "date": "2025-11-24",
    "created_at": "ISO8601"
  },
  "items": [
    {
      "id": "uuid",
      "day_id": "uuid",
      "food_id": "uuid",
      "recipe_id": null,
      "grams": 150,
      "food_catalog": {
        "name": "Chicken Breast",
        "kcals_per_100g": 165,
        ...
      }
    }
  ],
  "totals": {
    "kcals": 2050,
    "protein": 180,
    "carbs": 230,
    "fat": 76
  }
}
```

### POST `/api/nutrition/daily`
Add food/recipe to daily log.

**Body:**
```json
{
  "date": "YYYY-MM-DD",
  "foodId": "uuid or null",
  "recipeId": "uuid or null",
  "grams": number
}
```

**Response:**
```json
{
  "success": true,
  "item": {...},
  "message": "Nutrition item added successfully"
}
```

---

## Workout Endpoints

### GET `/api/workouts/exercises?muscleGroup=Chest&q=bench&limit=50`
Get exercises from catalog.

**Query Parameters:**
- `muscleGroup` (optional): Filter by muscle group (e.g., "Chest", "Back", "Legs")
- `q` (optional): Search query
- `limit` (optional): Max results (default: 50)

**Response:**
```json
{
  "success": true,
  "exercises": [
    {
      "id": "uuid",
      "name": "Bench Press",
      "muscle_group": "Chest",
      "equipment": "Barbell",
      "is_active": true,
      "created_at": "ISO8601"
    }
  ]
}
```

### GET `/api/workouts/sessions?date=YYYY-MM-DD`
Get workout session for a date.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (default: today)

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "session_date": "2025-11-24",
    "notes": "string",
    "created_at": "ISO8601",
    "workout_sets": [
      {
        "id": "uuid",
        "session_id": "uuid",
        "exercise_id": "uuid",
        "set_number": 1,
        "reps": 8,
        "load_kg": 100,
        "rpe": 8,
        "exercise_catalog": {
          "name": "Bench Press",
          "muscle_group": "Chest",
          "equipment": "Barbell"
        }
      }
    ]
  }
}
```

### POST `/api/workouts/sessions`
Create/get workout session for a date.

**Body:**
```json
{
  "date": "YYYY-MM-DD",
  "notes": "optional string"
}
```

**Response:**
```json
{
  "success": true,
  "session": {...},
  "message": "Workout session created successfully"
}
```

### POST `/api/workouts/sets`
Add exercise set to session.

**Body:**
```json
{
  "sessionId": "uuid",
  "exerciseId": "uuid",
  "setNumber": number,
  "reps": number,
  "loadKg": number,
  "rpe": number  // Rate of Perceived Exertion (1-10)
}
```

**Response:**
```json
{
  "success": true,
  "set": {...},
  "message": "Workout set added successfully"
}
```

### DELETE `/api/workouts/sets?setId=uuid`
Delete a workout set.

**Query Parameters:**
- `setId` (required): ID of set to delete

**Response:**
```json
{
  "success": true,
  "message": "Workout set deleted successfully"
}
```

---

## Recommendations Endpoints

### GET `/api/recommendations?scope=nutrition&limit=10`
Get past recommendations.

**Query Parameters:**
- `scope` (optional): Filter by "training" or "nutrition"
- `limit` (optional): Max results (default: 10)

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "scope": "nutrition",
      "input_snapshot": {...},
      "plan": {...},
      "alternatives": [],
      "explanations": ["Based on your weight..."],
      "created_at": "ISO8601"
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

**400 Bad Request:**
```json
{
  "error": "Missing required fields: ...",
  "status": 400
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found",
  "status": 404
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "status": 500
}
```

---

## Usage Examples

### Example 1: Complete Meal Logging
```javascript
// 1. Get user profile
const profile = await fetch('/api/users/profile').then(r => r.json());

// 2. Get daily nutrition log
const nutrition = await fetch('/api/nutrition/daily?date=2025-11-24').then(r => r.json());

// 3. Search for food
const foods = await fetch('/api/meals/foods?q=chicken').then(r => r.json());

// 4. Add food to log
const item = await fetch('/api/nutrition/daily', {
  method: 'POST',
  body: JSON.stringify({
    date: '2025-11-24',
    foodId: foods.foods[0].id,
    grams: 150
  })
}).then(r => r.json());
```

### Example 2: Complete Workout Logging
```javascript
// 1. Get exercises by muscle group
const exercises = await fetch('/api/workouts/exercises?muscleGroup=Chest').then(r => r.json());

// 2. Create/get workout session
const session = await fetch('/api/workouts/sessions', {
  method: 'POST',
  body: JSON.stringify({
    date: '2025-11-24',
    notes: 'Upper body day'
  })
}).then(r => r.json());

// 3. Add sets to session
const set = await fetch('/api/workouts/sets', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: session.session.id,
    exerciseId: exercises.exercises[0].id,
    setNumber: 1,
    reps: 8,
    loadKg: 100,
    rpe: 8
  })
}).then(r => r.json());
```

---

## Development Notes

- All endpoints validate session before processing
- Database uses Row-Level Security (RLS) - users can only access their own data
- Timestamps are in ISO8601 format
- Weights/metrics use metric system (kg)
- Calories in kcals, macros in grams
- All times in UTC, user timezone handled client-side

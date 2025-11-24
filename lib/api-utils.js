import { getServerSession } from "next-auth";

/**
 * Verify user is authenticated
 * @returns {Promise<string>} userId or throws 401
 */
export async function verifyAuth() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user.id;
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} sex - 'male' or 'female'
 * @returns {number} BMR in kcals
 */
export function calculateBMR(weight, height, age, sex) {
  if (sex === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate TDEE based on activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - 'sedentary', 'light', 'moderate', 'active', 'veryActive'
 * @returns {number} TDEE in kcals
 */
export function calculateTDEE(bmr, activityLevel = "moderate") {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate macro targets based on TDEE
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {number} weight - Weight in kg (for protein calculation)
 * @returns {Object} Macro targets
 */
export function calculateMacroTargets(tdee, weight) {
  return {
    protein: Math.round(weight * 1.6), // 1.6g per kg
    carbs: Math.round((tdee * 0.45) / 4),
    fat: Math.round((tdee * 0.35) / 9),
  };
}

/**
 * Calculate nutrition totals from items
 * @param {Array} items - Nutrition items with food data
 * @returns {Object} Nutrition totals
 */
export function calculateNutritionTotals(items) {
  return items.reduce(
    (acc, item) => {
      const grams = item.grams || 0;

      if (item.food_catalog) {
        const food = item.food_catalog;
        acc.kcals += (food.kcals_per_100g * grams) / 100;
        acc.protein += (food.protein_per_100g * grams) / 100;
        acc.carbs += (food.carbs_per_100g * grams) / 100;
        acc.fat += (food.fat_per_100g * grams) / 100;
      }

      return acc;
    },
    { kcals: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Format response with consistent structure
 * @param {*} data - Data to include
 * @param {string} message - Optional message
 * @returns {Object} Formatted response
 */
export function formatResponse(data, message = null) {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} code - HTTP status code
 * @returns {Object} Error response
 */
export function formatError(message, code = 500) {
  return {
    error: true,
    message,
    code,
  };
}

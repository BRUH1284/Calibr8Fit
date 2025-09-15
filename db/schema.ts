import { sql } from "drizzle-orm";
import { check, int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const activities = sqliteTable("activities", {
    id: text().primaryKey().notNull(),
    majorHeading: text().notNull(),
    metValue: real().notNull(),
    description: text().notNull(),
});

export const userActivities = sqliteTable("user_activities", {
    id: text().primaryKey().notNull(),
    majorHeading: text('major_heading').notNull(),
    metValue: real('met_value').notNull(),
    description: text('description').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const activityRecords = sqliteTable("activity_records", {
    id: text().primaryKey().notNull(),
    activityId: text('activity_id').references(() => activities.id),
    userActivityId: text('user_activity_id').references(() => userActivities.id),
    duration: int('duration').notNull(),
    caloriesBurned: real('calories_burned').notNull(),
    time: int('time').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
},
    (table) => [
        check(`activity_or_user_activity_check`,
            sql`(${table.activityId} IS NOT NULL) != (${table.userActivityId} IS NOT NULL)`),
    ]
);

export const waterIntakeRecords = sqliteTable("water_intake_records", {
    id: text().primaryKey().notNull(),
    amountInMl: real('amount_in_ml').notNull(),
    time: int('time').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const weightRecords = sqliteTable("weight_records", {
    id: text().primaryKey().notNull(),
    weight: real('weight').notNull(),
    time: int('time').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const foods = sqliteTable("foods", {
    id: text().primaryKey().notNull(),

    // Basic info
    name: text().notNull(),
    caloricValue: real("caloric_value").notNull(),

    // Macronutrients (per 100g)
    fat: real("fat").notNull(),
    saturatedFats: real("saturated_fats").notNull(),
    monounsaturatedFats: real("monounsaturated_fats").notNull(),
    polyunsaturatedFats: real("polyunsaturated_fats").notNull(),
    carbohydrates: real("carbohydrates").notNull(),
    sugars: real("sugars").notNull(),
    protein: real("protein").notNull(),
    dietaryFiber: real("dietary_fiber").notNull(),
    water: real("water").notNull(),

    // Other nutrients
    cholesterol: real("cholesterol").notNull(),
    sodium: real("sodium").notNull(),

    // Vitamins (per 100g)
    vitaminA: real("vitamin_a").notNull(),
    vitaminB1Thiamine: real("vitamin_b1_thiamine").notNull(),
    vitaminB11FolicAcid: real("vitamin_b11_folic_acid").notNull(),
    vitaminB12: real("vitamin_b12").notNull(),
    vitaminB2Riboflavin: real("vitamin_b2_riboflavin").notNull(),
    vitaminB3Niacin: real("vitamin_b3_niacin").notNull(),
    vitaminB5PantothenicAcid: real("vitamin_b5_pantothenic_acid").notNull(),
    vitaminB6: real("vitamin_b6").notNull(),
    vitaminC: real("vitamin_c").notNull(),
    vitaminD: real("vitamin_d").notNull(),
    vitaminE: real("vitamin_e").notNull(),
    vitaminK: real("vitamin_k").notNull(),

    // Minerals (mg/100g)
    calcium: real("calcium").notNull(),
    copper: real("copper").notNull(),
    iron: real("iron").notNull(),
    magnesium: real("magnesium").notNull(),
    manganese: real("manganese").notNull(),
    phosphorus: real("phosphorus").notNull(),
    potassium: real("potassium").notNull(),
    selenium: real("selenium").notNull(),
    zinc: real("zinc").notNull(),

    // Quality metric
    nutritionDensity: real("nutrition_density").notNull(),
});

export const userFoods = sqliteTable("user_foods", {
    id: text().primaryKey().notNull(),

    // Basic info
    name: text().notNull(),
    caloricValue: real("caloric_value").notNull(),

    // Macronutrients (per 100g)
    fat: real("fat").notNull(),
    saturatedFats: real("saturated_fats").notNull(),
    monounsaturatedFats: real("monounsaturated_fats").notNull(),
    polyunsaturatedFats: real("polyunsaturated_fats").notNull(),
    carbohydrates: real("carbohydrates").notNull(),
    sugars: real("sugars").notNull(),
    protein: real("protein").notNull(),
    dietaryFiber: real("dietary_fiber").notNull(),
    water: real("water").notNull(),

    // Other nutrients
    cholesterol: real("cholesterol").notNull(),
    sodium: real("sodium").notNull(),

    // Vitamins (per 100g)
    vitaminA: real("vitamin_a").notNull(),
    vitaminB1Thiamine: real("vitamin_b1_thiamine").notNull(),
    vitaminB11FolicAcid: real("vitamin_b11_folic_acid").notNull(),
    vitaminB12: real("vitamin_b12").notNull(),
    vitaminB2Riboflavin: real("vitamin_b2_riboflavin").notNull(),
    vitaminB3Niacin: real("vitamin_b3_niacin").notNull(),
    vitaminB5PantothenicAcid: real("vitamin_b5_pantothenic_acid").notNull(),
    vitaminB6: real("vitamin_b6").notNull(),
    vitaminC: real("vitamin_c").notNull(),
    vitaminD: real("vitamin_d").notNull(),
    vitaminE: real("vitamin_e").notNull(),
    vitaminK: real("vitamin_k").notNull(),

    // Minerals (mg/100g)
    calcium: real("calcium").notNull(),
    copper: real("copper").notNull(),
    iron: real("iron").notNull(),
    magnesium: real("magnesium").notNull(),
    manganese: real("manganese").notNull(),
    phosphorus: real("phosphorus").notNull(),
    potassium: real("potassium").notNull(),
    selenium: real("selenium").notNull(),
    zinc: real("zinc").notNull(),

    // Quality metric
    nutritionDensity: real("nutrition_density").notNull(),

    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const userMeals = sqliteTable("user_meals", {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    notes: text(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
});

export const userMealIngredients = sqliteTable("user_meal_ingredients", {
    id: text().primaryKey().notNull(),
    userMealId: text('user_meal_id').references(() => userMeals.id).notNull(),
    foodId: text('food_id').references(() => foods.id),
    userFoodId: text('user_food_id').references(() => userFoods.id),
    quantity: int('quantity_in_grams').notNull(),
},
    (table) => [
        check(`food_or_user_food_check`,
            sql`(${table.foodId} IS NOT NULL) != (${table.userFoodId} IS NOT NULL)`),
    ]
);

export const consumptionRecords = sqliteTable("consumption_records", {
    id: text().primaryKey().notNull(),
    foodId: text('food_id').references(() => foods.id),
    userFoodId: text('user_food_id').references(() => userFoods.id),
    userMealId: text('user_meal_id').references(() => userMeals.id),
    quantity: int('quantity_in_grams').notNull(),
    time: int('time').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
},
    (table) => [
        check(`food_or_user_food_or_meal_check`,
            sql`( (${table.foodId} IS NOT NULL) + (${table.userFoodId} IS NOT NULL) + (${table.userMealId} IS NOT NULL) ) = 1`),
    ]
);

export const dailyBurnTarget = sqliteTable("daily_burn_target", {
    id: text().primaryKey().notNull(),
    activityId: text('activity_id').references(() => activities.id),
    userActivityId: text('user_activity_id').references(() => userActivities.id),
    duration: int('duration').notNull(),
    modifiedAt: int('modified_at').notNull(),
    deleted: int('deleted', { mode: 'boolean' }).notNull().default(false),
},

    (table) => [
        check(`activity_or_user_activity_check`,
            sql`(${table.activityId} IS NOT NULL) != (${table.userActivityId} IS NOT NULL)`),
    ]
);
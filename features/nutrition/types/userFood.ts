export interface UserFood {
    id: string;

    // Basic info
    name: string;
    caloricValue: number;

    // Macronutrients (per 100g)
    fat: number;
    saturatedFats: number;
    monounsaturatedFats: number;
    polyunsaturatedFats: number;
    carbohydrates: number;
    sugars: number;
    protein: number;
    dietaryFiber: number;
    water: number;

    // Other nutrients
    cholesterol: number;
    sodium: number;

    // Vitamins (per 100g)
    vitaminA: number;
    vitaminB1Thiamine: number;
    vitaminB11FolicAcid: number;
    vitaminB12: number;
    vitaminB2Riboflavin: number;
    vitaminB3Niacin: number;
    vitaminB5PantothenicAcid: number;
    vitaminB6: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;

    // Minerals (mg/100g)
    calcium: number;
    copper: number;
    iron: number;
    magnesium: number;
    manganese: number;
    phosphorus: number;
    potassium: number;
    selenium: number;
    zinc: number;

    // Quality metric
    nutritionDensity: number;

    modifiedAt: number; // Unix timestamp in seconds
    deleted: boolean;
}

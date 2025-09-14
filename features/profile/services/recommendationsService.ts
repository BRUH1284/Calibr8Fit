import { ActivityLevel } from "@/shared/types/enums/activityLevel";
import { Climate } from "@/shared/types/enums/climate";
import { Gender } from "@/shared/types/enums/gender";

const caloriesBurnedCalculator = (met: number, minutes: number, weight: number) => {
    const result = weight * met * minutes / 60;
    return Math.round(result);
};

// Mifflin-St Jeor Equation
const rmrCalculator = (
    gender: Gender,
    activityLevel: ActivityLevel,
    weight: number,
    height: number,
    age: number
) => {
    const genderValue = gender === Gender.Male ? 5 : -161;

    let activityMultiplier = 0;
    switch (activityLevel) {
        case ActivityLevel.Sedentary:
            activityMultiplier = 1.2;
            break;
        case ActivityLevel.Light:
            activityMultiplier = 1.375;
            break;
        case ActivityLevel.Moderately:
            activityMultiplier = 1.55;
            break;
        case ActivityLevel.High:
            activityMultiplier = 1.725;
            break;
        case ActivityLevel.Extreme:
            activityMultiplier = 1.9;
            break;
    }

    const result =
        ((10 * weight) +
            (6.25 * height) -
            (5 * age) +
            genderValue) *
        activityMultiplier;

    return Math.round(result);
};

const clamp = (v: number, min: number, max: number) => Math.min(min, Math.max(v, max));

const DIET_SHARE = 0.7;
const KCAL_PER_KG = 7700;
const MAX_DAILY_WEIGHT_CHANGE_KG = 0.5;

const dailyDelta = (weight: number, targetWeight: number) => {
    const weightDiff = clamp(targetWeight - weight, -5, 5);
    // 7700 kcal per kg of body weight
    const sign = Math.sign(targetWeight - weight); // + for gain, − for loss
    const kgPerDay = MAX_DAILY_WEIGHT_CHANGE_KG / 7;
    return Math.round(sign * kgPerDay * KCAL_PER_KG); // kcal/day to add (gain) or subtract (loss)
}

const consumptionCalculator = (
    gender: Gender,
    activityLevel: ActivityLevel,
    weight: number,
    targetWeight: number,
    height: number,
    age: number
) => {
    const maintenance = rmrCalculator(gender, activityLevel, weight, height, age); // should be TDEE
    const delta = dailyDelta(weight, targetWeight);
    return Math.round(maintenance + delta * DIET_SHARE);
};

const burningCalculator = (
    weight: number,
    targetWeight: number,
) => {
    const delta = dailyDelta(weight, targetWeight);
    return delta < 0 ? Math.round(Math.abs(delta) * (1 - DIET_SHARE)) : 0;
};

// Daily water intake calculator 
const waterCalculator = (
    gender: Gender,
    activityLevel: ActivityLevel,
    weight: number,
    userClimate: Climate
) => {
    const genderMultiplier = gender === Gender.Male ? 0.035 : 0.03;

    const weightMultiplier = genderMultiplier * weight;

    let activityValue = 0;
    switch (activityLevel) {
        case ActivityLevel.Sedentary:
            activityValue = 0.09;
            break;
        case ActivityLevel.Light:
            activityValue = 0.18;
            break;
        case ActivityLevel.Moderately:
            activityValue = 0.35;
            break;
        case ActivityLevel.High:
            activityValue = 0.7;
            break;
        case ActivityLevel.Extreme:
            activityValue = 0.95;
            break;
    }

    let climateValue = 0;
    switch (userClimate) {
        case Climate.Cold:
            climateValue = 0;
            break;
        case Climate.Temperate:
            climateValue = 0.25;
            break;
        case Climate.Tropical:
            climateValue = 0.5;
            break;
    }

    const result = weightMultiplier + activityValue + climateValue;
    return Math.round(result * 10) / 10;
}

export const recommendationsService = {
    caloriesBurnedCalculator,
    rmrCalculator,
    waterCalculator,
    burningCalculator,
    consumptionCalculator,
};
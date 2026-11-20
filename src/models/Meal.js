const mongoose = require('mongoose');
const { MEAL_CATEGORIES } = require('../utils/constants');

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant reference is required'],
    },
    description: {
      type: String,
      required: [true, 'Meal description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: MEAL_CATEGORIES,
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: 'Meal must have at least one ingredient',
      },
    },
    calories: {
      type: Number,
      min: 0,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [0, 'Preparation time cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: 'default-meal.jpg',
    },
  },
  { timestamps: true }
);

mealSchema.index({ restaurant: 1 });
mealSchema.index({ category: 1 });
mealSchema.index({ restaurant: 1, category: 1 });

module.exports = mongoose.model('Meal', mealSchema);

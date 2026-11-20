const Meal = require('../models/Meal');
const Restaurant = require('../models/Restaurant');
const { USER_ROLES } = require('../utils/constants');


const getAllMeals = async (req, res, next) => {
  try {
    const { category, restaurant, minPrice, maxPrice, isVegetarian, isVegan } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (restaurant) filter.restaurant = restaurant;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';
    if (isVegan !== undefined) filter.isVegan = isVegan === 'true';

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const meals = await Meal.find(filter).populate('restaurant', 'name address.city');
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};


const getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('restaurant', 'name description');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};


const createMeal = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add meals to this restaurant',
      });
    }

    const meal = await Meal.create(req.body);
    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};


const updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id).populate('restaurant');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.restaurant.owner.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal',
      });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};


const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('restaurant');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    if (meal.restaurant.owner.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal',
      });
    }

    await meal.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};

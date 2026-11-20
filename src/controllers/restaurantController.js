const Restaurant = require('../models/Restaurant');
const Meal = require('../models/Meal');
const { USER_ROLES } = require('../utils/constants');


const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).populate('owner', 'name email');
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};


const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};


const getRestaurantMeals = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const meals = await Meal.find({ restaurant: req.params.id });
    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};


const createRestaurant = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};


const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant',
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};


const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this restaurant',
      });
    }

    await Meal.deleteMany({ restaurant: req.params.id });
    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Restaurant and its meals deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


const getMyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMeals,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
};

const Meal = require('../models/Meal');
const Restaurant = require('../models/Restaurant');
const { MEAL_CATEGORIES } = require('../utils/constants');


const getClientMeals = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice, isVegetarian, isVegan, isGlutenFree, isSpicy } = req.query;
        const filter = { isAvailable: true };

        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) filter.category = category;
        if (isVegetarian === 'true') filter.isVegetarian = true;
        if (isVegan === 'true') filter.isVegan = true;
        if (isGlutenFree === 'true') filter.isGlutenFree = true;
        if (isSpicy === 'true') filter.isSpicy = true;

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }

        const meals = await Meal.find(filter).populate('restaurant', 'name address.city rating');
        res.status(200).json({
            success: true,
            count: meals.length,
            data: meals,
        });
    } catch (error) {
        next(error);
    }
};


const getClientRestaurants = async (req, res, next) => {
    try {
        const { search, city, cuisine } = req.query;
        const filter = { isActive: true };

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (city) {
            filter['address.city'] = { $regex: city, $options: 'i' };
        }

        if (cuisine) {
            filter.cuisine = { $in: [new RegExp(cuisine, 'i')] };
        }

        const restaurants = await Restaurant.find(filter);
        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants,
        });
    } catch (error) {
        next(error);
    }
};


const getClientRestaurantDetails = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.id, isActive: true });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        const meals = await Meal.find({ restaurant: req.params.id, isAvailable: true });

        res.status(200).json({
            success: true,
            data: {
                restaurant,
                meals,
            },
        });
    } catch (error) {
        next(error);
    }
};


const getMealCategories = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: MEAL_CATEGORIES,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getClientMeals,
    getClientRestaurants,
    getClientRestaurantDetails,
    getMealCategories,
};

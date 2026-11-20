const express = require('express');
const router = express.Router();
const {
    getClientMeals,
    getClientRestaurants,
    getClientRestaurantDetails,
    getMealCategories,
} = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/auth');
const { USER_ROLES } = require('../utils/constants');

router.use(protect, authorize(USER_ROLES.CLIENT));

router.get('/meals', getClientMeals);
router.get('/restaurants', getClientRestaurants);
router.get('/restaurants/:id', getClientRestaurantDetails);
router.get('/categories', getMealCategories);

module.exports = router;

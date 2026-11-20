const express = require('express');
const router = express.Router();
const {
    getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
} = require('../controllers/mealController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { createMealSchema, updateMealSchema } = require('../validations/mealValidation');
const { USER_ROLES } = require('../utils/constants');

router.get('/', getAllMeals);
router.get('/:id', getMealById);

router.post(
    '/',
    protect,
    authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
    validate(createMealSchema),
    createMeal
);

router.put(
    '/:id',
    protect,
    authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
    validate(updateMealSchema),
    updateMeal
);

router.delete(
    '/:id',
    protect,
    authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
    deleteMeal
);

module.exports = router;

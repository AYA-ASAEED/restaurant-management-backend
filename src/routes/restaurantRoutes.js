const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMeals,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { createRestaurantSchema, updateRestaurantSchema } = require('../validations/restaurantValidation');
const { USER_ROLES } = require('../utils/constants');

router.get(
  '/owner/my-restaurants',
  protect,
  authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
  getMyRestaurants
);

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/meals', getRestaurantMeals);

router.post(
  '/',
  protect,
  authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
  validate(createRestaurantSchema),
  createRestaurant
);

router.put(
  '/:id',
  protect,
  authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
  validate(updateRestaurantSchema),
  updateRestaurant
);

router.delete(
  '/:id',
  protect,
  authorize(USER_ROLES.RESTAURANT_OWNER, USER_ROLES.ADMIN),
  deleteRestaurant
);

module.exports = router;

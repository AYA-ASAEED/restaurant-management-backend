const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./src/config/config');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const mealRoutes = require('./src/routes/mealRoutes');
const clientRoutes = require('./src/routes/clientRoutes');

connectDB();

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Management API is running...',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/client', clientRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

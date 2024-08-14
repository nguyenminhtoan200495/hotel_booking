require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('./utils/logger');
const { validateLogin } = require('./middleware/validationMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const roomRoutes = require('./routes/room.routes');
const bookingRoutes = require('./routes/booking.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Sử dụng middleware để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, '../public')));

const db = require('./models');

const Role = db.role;

function initial() {
  Role.create({
    id: 1,
    name: 'admin',
  });

  Role.create({
    id: 2,
    name: 'moderator',
  });

  Role.create({
    id: 3,
    name: 'user',
  });
}

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

app.get('/', (req, res) => {
  logger.info('Hello world!');
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/login', validateLogin, (req, res) => {
  res.json({ message: 'Login successful' });
});

app.use('/rooms', roomRoutes);
app.use('/booking', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

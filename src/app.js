const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('./utils/logger');
const { validateLogin } = require('./middleware/validationMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();
const roomRoutes = require('./routes/room.routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
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

// Route chính hiển thị file index.html
app.get('/', (req, res) => {
  logger.info('Hello world!');
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Route xử lý đăng nhập
app.post('/login', validateLogin, (req, res) => {
  // Logic xử lý đăng nhập
  res.json({ message: 'Login successful' });
});

app.use('/rooms', roomRoutes);

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Middleware xử lý lỗi
app.use(errorHandler);

const port = process.env.PORT || 3000;
// Lắng nghe server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

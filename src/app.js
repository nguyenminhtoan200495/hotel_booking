const express = require('express');

const app = express();
require('dotenv').config();

app.use('/', (req, res) => res.json('Login successful'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

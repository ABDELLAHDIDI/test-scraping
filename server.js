const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

require('dotenv').config();
// const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));


// mongoose.connect('mongodb://localhost:27017/scraping_test');

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

console.log("dirname : " + __dirname)

app.use(express.static(path.join(__dirname, 'public')));
 


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

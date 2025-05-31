const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  url: String,
  image: String,
  offers: [{
    price: Number,
    availability: String, 
  }],
  
});
module.exports = mongoose.model('Product', ProductSchema);

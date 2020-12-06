const mongoose = require('mongoose')

const DishSchema = new mongoose.Schema({
  name: String, 
  price: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  pictures: [String],
  thumbnail: String,
  tags: [String]
}, { collection: 'dishes' })

module.exports = mongoose.model('Dish', DishSchema)
const mongoose = require('mongoose')

const DishSchema = new mongoose.Schema({
  name: String, 
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { collection: 'dishes' })

module.exports = mongoose.model('Dish', DishSchema)
const mongoose = require('mongoose')

const RestaurantSchema = new mongoose.Schema({
  name: String, 
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }],
  menu: String,
  drivethru: Boolean,
  delivery: Boolean
}, { collection: 'restaurants' })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
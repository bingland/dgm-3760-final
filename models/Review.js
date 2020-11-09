const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: String,
  body: String,
  rating: Number,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
}, { collection: 'reviews' })

module.exports = mongoose.model('Review', ReviewSchema)
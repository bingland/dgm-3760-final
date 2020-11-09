const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: String
}, { collection: 'users' })

module.exports = mongoose.model('User', UserSchema)
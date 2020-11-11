const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.listen(port, () => { console.log(`Server running on port ${port}`) })

app.use('/', express.static('public'))

// Schemas
const Dish = require('./models/Dish')
const Restaurant = require('./models/Restaurant')
const Review = require('./models/Review')
const User = require('./models/User')

// GET
app.get('/dishes', (req, res) => {
    console.log('/dishes GET')
    Dish.find()
    .populate(['restaurant', 'reviews'])
    .populate({
        path: 'reviews',
        populate: [
            { path: 'user', model: 'User' },
            { path: 'dish', model: 'Dish' },
            { path: 'restaurant', model: 'Restaurant' }
        ]
        
    })
    .exec((err, results) => {
        if (err) console.log(err)
        res.json(results)
    })
})
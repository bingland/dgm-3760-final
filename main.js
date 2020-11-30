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

// GET all dishes
// todo: other dishes at restaurants
// todo: searching for dishes; return them by exact matches and most relevant
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

// GET dishes by query
app.get('/dishes/:query', (req, res) => {
    console.log('/dishes/:query GET')
    Dish.find({ name: { $regex: req.params.query, $options: 'i' } }, (err, results) => {
        if (err) console.log(err)
    })
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

// GET all restaurants
app.get('/restaurants', (req, res) => {
    console.log('/restaurants GET')
    Restaurant.find()
    .populate(['dishes'])
    .exec((err, results) => {
        if (err) console.log(err)
        res.json(results)
    })
})

// GET restaurant by query
app.get('/restaurants/:id', (req, res) => {
    console.log('/restaurants GET')
    Restaurant.findById(`${req.params.id}`, (err, results) => {
        if (err) console.log(err)
    })
    .populate(['dishes'])
    .populate({
        path: 'dishes',
        populate: [
            { path: 'reviews', model: 'Review' }
        ]
    })
    .exec((err, results) => {
        if (err) console.log(err)
        res.json(results)
    })
})
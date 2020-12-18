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

mongoose.set('useFindAndModify', false);

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
    Dish.find({
        '$or': [
            {name: { $regex: req.params.query, $options: 'i' }},
            {tags: { $regex: req.params.query, $options: 'i' }}
        ]
    }, (err, results) => {
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

// GET dish by id
app.get('/dish/:id', (req, res) => {
    console.log('/dish/:id GET')
    Dish.findById(`${req.params.id}`, (err, results) => {
        if (err) console.log(err)
    })
    .populate('reviews')
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

// POST review
app.post('/reviews', (req, res) => {
    console.log('/reviews POST')
    Review.create({
        title: req.query.title,
        body: req.query.body,
        rating: req.query.rating,
        date: new Date(), // CURRENT SYSTEM DATE
        user: req.query.user,
        dish: req.query.dish,
        restaurant: req.query.restaurant
    }, (err, review) => {
        if (err) console.log(err)

        // add an ObjectID to a reviews respective dish
        Dish.findOneAndUpdate(
            {_id: review.dish},
            { $addToSet: {reviews: review._id} },
            (err, result) => {
                if (err) console.log(err)
            }
        )
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
})

// PUT review
app.put('/reviews/:id', (req, res) => {
    console.log('/reviews PUT')

    Review.findById(`${req.params.id}`, (err, review) => {
        if (err) console.log(err)
        
        review.title = req.query.title
        review.body = req.query.body
        review.rating = req.query.rating

        review.updateOne(review, (err, rev) => {
            if (err) console.log(err)
            console.log(review)

            Dish.findById(`${review.dish}`, (err, results) => {
                if (err) console.log(err)
            })
            .populate(['reviews'])
            .populate({
                path: 'reviews',
                populate: [
                    { path: 'user', model: 'User' }
                ]
            })
            .exec((err, results) => {
                if (err) console.log(err)
                res.json(results)
            })
        })
    })
})

// DELETE review
app.delete('/reviews/:id', (req, res) => {
    console.log('/reviews/:id DELETE')

    let reviewId = req.params.id
    let dishId = undefined

    Review.findById({
        _id: reviewId
    }, (err, review) => {
        if (err) console.log(err)

        console.log(reviewId)

        dishId = review.dish
        console.log(dishId)

        // delete the review
        Review.deleteOne({
            _id: reviewId
        }, (err, reviews) => {
            if (err) console.log(err)

            // remove redundant ObjectID from Dish
            Dish.findOneAndUpdate(
                {_id: dishId},
                { $pull: {reviews: reviewId} },
                (err, result) => {
                    if (err) console.log(err)
                }
            )
    
            //return the dish of the review as the JSON
            console.log(dishId)
            Dish.findById(`${dishId}`, (err, results) => {
                if (err) console.log(err)
                console.log(results)
            })
            .populate(['reviews'])
            .populate({
                path: 'reviews',
                populate: [
                    { path: 'user', model: 'User' }
                ]
            })
            .exec((err, results) => {
                if (err) console.log(err)
                res.json(results)
            })
        })
    })
})
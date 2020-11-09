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

// GET
app.get('/dishes', (req, res) => {
    Dish.find((err, dishes) => {
        if (err) console.log(err)
        res.json(dishes)
    })
})
const searchBar = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')
const resultsArea = document.getElementById('resultsArea')
const focusArea = document.getElementById('focusArea')

// state
let query = ''
let dishes = []

const search = (e) => {
    e.preventDefault()
    query = searchBar.value
    console.log(query)
    getAllDishes().then(results => {
        console.log(results)
        dishes = results
        listDishes()
    })
}

const listDishes = () => {
    resultsArea.innerHTML = ''
    for (dish of dishes) {
        resultsArea.innerHTML += `
        <div class="dish" data-id="${dish._id}">
            <div class="dishPic">
                <img src="${dish.pictures[0]}" alt="dish icon">
            </div>
            <div class="dishName">${dish.name}</div>
            <div class="restaurantName">${dish.restaurant.name}</div>
            <div class="dishRating">${calcRating(dish.reviews.map(review => review.rating))} stars</div>
            <div class="dishNumber">${dish.reviews.length} ${dish.reviews.length == 1 ? 'Review' : 'Reviews'}</div>
            <div class="dishPrice">${dish.price}</div>
        </div>
        `
    }

    // event listeners
    document.querySelectorAll('.dish').forEach(item => {
        item.addEventListener('click', (e) => {
            console.log(item.getAttribute('data-id'))
            focusDish(item.getAttribute('data-id'))
        })
    })
}

const focusDish = (id) => {
    let selectedDish = dishes.find(dish => dish._id === id)

    console.log(selectedDish)
    focusArea.innerHTML = `
        <header>
            <h1 class="focusName">${selectedDish.name}</h1>
            <div class="focusInfo">
                <div class="focusRestaurant">${selectedDish.restaurant.name}</div>
                <div class="focusRating">${calcRating(selectedDish.reviews.map(review => review.rating))} stars</div>
                <div class="focusReviewCount">${selectedDish.reviews.length} ${selectedDish.reviews.length == 1 ? 'Review' : 'Reviews'}</div>
            </div>
        </header>
        <div class="focusPhotos">${selectedDish.pictures.map(pic => {
            return `<img src="${pic}" alt="selected dish image">`
        })}</div>
        <div class="focusReviews">
            ${selectedDish.reviews.map(review => {
                return `
                    <div class="reviewTitle">${review.title}</div>
                    <div class="reviewUser">${review.user.username}</div>
                    <div class="reviewRating">${review.rating} stars</div>
                    <div class="reviewDate">${review.date}</div>
                    <div class="reviewBody">${review.body}</div>
                `
            })}
        </div>
    `
}

const calcRating = (ratings) => {
    return ratings.reduce((a, b) => a + b) / ratings.length
}

const getAllDishes = async () => {
    let response = await fetch('/dishes')
    let dishes = await response.json()
    return dishes
}

// event listeners
searchSubmit.addEventListener('click', search)
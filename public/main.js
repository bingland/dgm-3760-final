const searchBar = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')
const resultsArea = document.getElementById('resultsArea')

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
            focusDish()
        })
    })
}

const focusDish = () => {
    console.log('Selecting dish')
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
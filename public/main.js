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
    getAllDishes(query).then(results => {
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
                <div class="focusRating">${returnStars(calcRating(selectedDish.reviews.map(review => review.rating)))} stars</div>
                <div class="focusReviewCount">${selectedDish.reviews.length} ${selectedDish.reviews.length == 1 ? 'Review' : 'Reviews'}</div>
                <div class="focusPrice">${selectedDish.price}</div>
            </div>
        </header>
        <div class="focusPhotos">${selectedDish.pictures.map(pic => {
            return `<img src="${pic}" alt="selected dish image">`
        })}</div>
        <div class="focusReviews">
            ${selectedDish.reviews.map(review => {
                return `
                <div class="reviewHeader">
                    <div class="reviewPFP"><img src="./images/anonProfilePic.png" alt="user profile picture"></img></div>
                    <div class="reviewUser">${review.user.username}</div>
                    <div class="reviewRating">${returnStars(review.rating)}</div>
                    <div class="reviewDate">${returnDate(review.date)}</div>
                </div>
                <div class="reviewContent">
                    <div class="reviewTitle">${review.title}</div>
                    <div class="reviewBody">${review.body}</div>
                </div>
                `
            })}
        </div>
    `
}

const calcRating = (ratings) => {
    return ratings.reduce((a, b) => a + b) / ratings.length
}

const returnStars = (rating) => {
    let counter = rating
    let output = ''
    
    while (counter > 0) {
        if (counter >= 0.75) {
            output += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>'
        }
        else if (counter < 0.75 && counter > 0.25) {
            output += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524v-12.005zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>'
        }
        else {
            output = 'error'
        }
        counter -= 1
    }
    return output
}

const returnDate = (string) => {
    let millis = Date.parse(string)
    let date = new Date(millis)
    let output = date.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
    return output
}

const getAllDishes = async (query) => {
    let url = query == '' ? '/dishes' : '/dishes/' + query
    let response = await fetch(url)
    let dishes = await response.json()
    return dishes
}

// event listeners
searchSubmit.addEventListener('click', search)
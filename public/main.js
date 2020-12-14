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
    console.log(`Entered query: ${query}`)
    getDishes(query).then(results => {
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
                <img src="${dish.thumbnail}" alt="dish icon">
            </div>
            <div class="dishName">${dish.name}</div>
            <div class="restaurantName">${dish.restaurant.name}</div>
            <div class="dishRating">${returnStars(calcRating(dish.reviews.map(review => review.rating)))} stars</div>
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
            return `<img src="${pic}" alt="selected dish image" />`
        })}</div>
        <div class="focusContentGrid">
            <div class="focusMeta">
                <div class="focusItem">
                    <div class="focusItemCheck">
                        <!-- Restaurant Delivery -->
                        ${selectedDish.restaurant.delivery === true ? `
                            <svg viewBox="0 0 22.947 17.87">
                                <path d="M25.947,6.638,11.72,22.87,3,15.2l1.681-1.9,6.809,5.974L24.066,5l1.88,1.638Z" transform="translate(-3 -5)" fill="#519b76" fill-rule="evenodd"/>
                            </svg>
                        ` : `
                            <svg viewBox="0 0 24 24">
                                <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" fill="#D63A46"/>
                            </svg>
                        `}
                    </div>
                    <div class="focusItemValue">Delivery</div>
                </div>
                <div class="focusItem">
                    <div class="focusItemCheck">
                        <!-- Drive Thru -->
                        ${selectedDish.restaurant.drivethru === true ? `
                            <svg viewBox="0 0 22.947 17.87">
                                <path d="M25.947,6.638,11.72,22.87,3,15.2l1.681-1.9,6.809,5.974L24.066,5l1.88,1.638Z" transform="translate(-3 -5)" fill="#519b76" fill-rule="evenodd"/>
                            </svg>
                        ` : `
                        <svg viewBox="0 0 24 24">
                            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" fill="#D63A46"/>
                        </svg>
                        `}
                    </div>
                    <div class="focusItemValue">Drive Thru</div>
                </div>
                <div class="focusMenu">
                    <div class="menuText"><a href="${selectedDish.restaurant.menu}" target="blank">${selectedDish.restaurant.name} Menu</a></div>
                </div>
            </div>

            <div class="focusReviews">
                <div class="reviewBar">
                    <h2 class="focusTitle">Reviews</h2>
                    <button class="submitAppear">New Review +</button>
                </div>

                <!-- Submit Review -->
                <div class="reviewSubmitArea">
                    
                </div>

                ${selectedDish.reviews.map(review => {
                    return `
                    <div class="focusReview">
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
                    </div>
                    `
                })}
            </div>
            <div class="focusRelated">
                <div class="relatedRestaurant">
                    <h1>More dishes from ${selectedDish.restaurant.name}</h1>
                    <div class="restaurantDishes"><!-- populated via JS --></div>
                </div>
            </div>
        </div>
    `

    // get restaurants, populate .restaurantDishes
    getOneRestaurant(selectedDish.restaurant._id).then(results => {
        let div = document.querySelector('.restaurantDishes')
        div.innerHTML = ''
        console.log(results)
        results.dishes.forEach(dish => {
            div.innerHTML += `
                <div class="restaurantDish">
                    <div class="dishName">${dish.name}</div>
                    <div class="dishRating">${returnStars(calcRating(dish.reviews.map(review => review.rating)))}</div>
                </div>
            `
        })
    })

    // new review button event listener
    document.querySelector('.submitAppear').addEventListener('click', () => {
        displaySubmitArea()
    })
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

const displaySubmitArea = () => {
    // submit form HTML
    let submitAreaContent = document.createElement('div')
    submitAreaContent.className = 'submit'
    submitAreaContent.innerHTML = `
        <div class="submitInfo">
            <input type="text" placeholder="Enter Review Title">
            <div class="interactiveStars">
                <!-- insert stars via JS -->
            </div>
        </div>
        <textarea placeholder="Enter your review here..."></textarea>
        <div class="submitControls">
            <button class="submitButton">Submit</button>
            <button class="cancelButton">Cancel</button>
        </div>
    `

    // set the submit area content to our div
    document.querySelector('.reviewSubmitArea').appendChild(submitAreaContent)
    // remove the new review button
    document.querySelector('.submitAppear').remove()
    // add event listener for submit area content button
    document.querySelector('.submitControls .cancelButton').addEventListener('click', () => {
        closeSubmitArea()
    })

    interactiveStars()
}

const closeSubmitArea = () => {
    // new review button HTML
    let submitNewReview = document.createElement('div')
    submitNewReview.className = 'submitAppear'
    submitNewReview.innerHTML = `
        <button class="submitAppear">New Review +</button>
    `

    // remove the submit area content
    document.querySelector('.submit').remove()
    // add the new review button
    document.querySelector('.reviewBar').appendChild(submitNewReview)
    // add event listener for new review button
    document.querySelector('.submitAppear').addEventListener('click', () => {
        displaySubmitArea()
    })
}

const interactiveStars = () => {
    let starArea = document.querySelector('.interactiveStars')
    console.log(starArea)
    
    starArea.innerHTML = ''
    for (let i = 0; i < 5; i++) {
        starArea.innerHTML += `
            <svg class="ratingStar" data-id="${i + 1}" width="24" height="24" viewBox="0 0 24 24"><path data-id="${i + 1}" d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
        `
    }
    document.querySelectorAll('.ratingStar').forEach(star => {
        star.addEventListener('click', (e) => {
            starArea.innerHTML = ''
            starClick(e)
        })
    })
}

const starClick = (e) => {
    let output = ''
    let starArea = document.querySelector('.interactiveStars')
    let rating = e.target.getAttribute('data-id')
    for (let i = 0; i < 5; i++) {
        if(i < rating) {
            output += `
                <svg class="ratingStar" data-id="${i + 1}" width="24" height="24" viewBox="0 0 24 24"><path data-id="${i + 1}" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
            `
        } else {
            output += `
                <svg class="ratingStar" data-id="${i + 1}" width="24" height="24" viewBox="0 0 24 24"><path data-id="${i + 1}" d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
            `
        }
    }

    starArea.innerHTML = output

    document.querySelectorAll('.ratingStar').forEach(star => {
        star.addEventListener('click', (e) => {
            starArea.innerHTML = ''
            starClick(e)
        })
    })
    
    console.log(e.target.getAttribute('data-id'))
}

const returnDate = (string) => {
    let millis = Date.parse(string)
    let date = new Date(millis)
    let output = date.toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
    return output
}

const getDishes = async (query) => {
    let url = query == '' ? '/dishes' : '/dishes/' + query
    let response = await fetch(url)
    let dishes = await response.json()
    return dishes
}

const getAllRestaurants = async () => {
    let url = '/restaurants'
    let response = await fetch(url)
    let restaurants = await response.json()
    return restaurants
}

const getOneRestaurant = async (id) => {
    let url = '/restaurants/' + id
    let response = await fetch(url)
    let restaurant = await response.json()
    return restaurant
}

// event listeners
searchSubmit.addEventListener('click', search)
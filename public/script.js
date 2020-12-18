const searchBar = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')
const resultsArea = document.getElementById('resultsArea')
const focusArea = document.getElementById('focusArea')

// state
let query = ''
let dishes = []
let selectedDish = undefined
let userRating = undefined

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
            <div class="dishText">
                <div class="dishName">${dish.name}</div>
                <div class="row2">
                    <div class="restaurantName">${dish.restaurant.name}</div>
                    <div class="dishRating">${returnStars(calcRating(dish.reviews.map(review => review.rating)))}</div>
                    <div class="dishPrice">${dish.price}</div>
                </div>
            </div>
            
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
    selectedDish = dishes.find(dish => dish._id === id)

    console.log(selectedDish)
    focusArea.innerHTML = `
        <header>
            <h1 class="focusName">${selectedDish.name}</h1>
            <div class="focusInfo">
                <div class="focusRestaurant">${selectedDish.restaurant.name}</div>
                <div class="focusRating">${returnStars(calcRating(selectedDish.reviews.map(review => review.rating)))}</div>
                <div class="focusReviewCount">${selectedDish.reviews.length} ${selectedDish.reviews.length == 1 ? 'Review' : 'Reviews'}</div>
                <div class="focusPrice">${selectedDish.price}</div>
            </div>
        </header>
        <div class="focusPhotos">
        ${
            selectedDish.pictures.reduce((acc, pic) => {
                return acc + `<img src="${pic}" alt="selected dish image" />`
            }, '')
        }
        </div>
        <div class="focusContent">
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
                <div class="focusItem">
                    <div class="focusItemCheck">
                        <!-- Item Availability -->
                        ${selectedDish.available === true ? `
                            <svg viewBox="0 0 22.947 17.87">
                                <path d="M25.947,6.638,11.72,22.87,3,15.2l1.681-1.9,6.809,5.974L24.066,5l1.88,1.638Z" transform="translate(-3 -5)" fill="#519b76" fill-rule="evenodd"/>
                            </svg>
                        ` : `
                            <svg viewBox="0 0 24 24">
                                <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" fill="#D63A46"/>
                            </svg>
                        `}
                    </div>
                    <div class="focusItemValue">Item Availability</div>
                </div>
                <div class="focusMenu">
                    <div class="menuText"><a href="${selectedDish.restaurant.menu}" target="blank">${selectedDish.restaurant.name} Menu</a></div>
                </div>
            </div>

            <div class="focusContentGrid">
            
                <div class="focusReviews">
                    <div class="reviewBar">
                        <h2 class="focusTitle">Reviews</h2>
                        <button class="submitAppear">New Review +</button>
                    </div>

                    <!-- Submit Review -->
                    <div class="reviewSubmitArea">
                        
                    </div>

                    <!-- Reviews --> 
                    <div class="reviews">

                    </div>
                </div>
                <div class="focusRelated">
                    <div class="relatedRestaurant">
                        <h1>More dishes from ${selectedDish.restaurant.name}</h1>
                        <div class="restaurantDishes"><!-- populated via JS --></div>
                    </div>
                </div>

            </div>
        </div>
    `

    // insert reviews
    setTimeout(getReviews, 100)

    // get restaurants, populate .restaurantDishes
    getOneRestaurant(selectedDish.restaurant._id).then(results => {
        let div = document.querySelector('.restaurantDishes')
        div.innerHTML = ''
        console.log(results)
        results.dishes.forEach(dish => {
            if (dish._id !== selectedDish._id) {
                div.innerHTML += `
                    <div class="restaurantDish" data-id="${dish._id}">
                        <div class="dishThumb"><img src="${dish.thumbnail}" alt="${dish.name}" /></div>
                        <div class="row2">
                            <div class="dishName">${dish.name}</div>
                            <div class="dishRating">${returnStars(calcRating(dish.reviews.map(review => review.rating)))} ${dish.price}</div>
                        </div>
                    </div>
                `
            }
        })

        // restaurantDish opens up that dish onclick 
        document.querySelectorAll('.restaurantDish').forEach(item => {
            item.addEventListener('click', () => {
                focusDish(item.getAttribute('data-id'))
            })
        })
    })

    // new review button event listener
    document.querySelector('.submitAppear').addEventListener('click', () => {
        displaySubmitArea()
    })
}

const calcRating = (ratings) => {
    if (ratings.length === 0) {
        return 0
    }
    return ratings.reduce((a, b) => a + b) / ratings.length
}

const returnStars = (rating) => {
    let counter = rating
    let output = ''
    
    while (counter > 0) {
        if (counter >= 0.75) {
            output += '<svg class="svgStar" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>'
        }
        else if (counter < 0.75 && counter > 0.25) {
            output += '<svg class="svgStar" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524v-12.005zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>'
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
            <input class="submitTitle" type="text" placeholder="Enter Review Title">
            <div class="interactiveStars" id="submitStars" data-id="0">
                <!-- insert stars via JS -->
            </div>
        </div>
        <textarea class="submitBody" placeholder="Enter your review here..."></textarea>
        <div class="submitControls">
            <button class="submitButton">Submit</button>
            <button class="cancelButton">Cancel</button>
        </div>
    `

    // set the submit area content to our div
    document.querySelector('.reviewSubmitArea').appendChild(submitAreaContent)
    // remove the new review button
    document.querySelector('.submitAppear').remove()
    // add event listener for submit area content cancel button
    document.querySelector('.submitControls .cancelButton').addEventListener('click', () => {
        closeSubmitArea()
    })
    // add event listener for submitting review
    document.querySelector('.submitButton').addEventListener('click', () => {
        postReview()
    })

    interactiveStars('#submitStars')
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

const getReviews = () => {
    let outputArea = document.querySelector('.reviews')
    outputArea.innerHTML = selectedDish.reviews.reduce((acc, review, index) => {
        return acc + `
            <div class="focusReview" data-id="${review._id}" index="${index}" id="review${index}">
                <div class="reviewHeader">
                    <div class="reviewPFP"><img src="./images/anonProfilePic.png" alt="user profile picture"></img></div>
                    <div class="reviewHeaderText">
                        <div class="reviewUser">${review.user.username}</div>
                        <div class="row2">
                            <div class="reviewRating">${returnStars(review.rating)}</div>
                            <div class="reviewDate">${returnDate(review.date)}</div>
                        </div>
                    </div>
                    <div class="editBtn" id="edit${index}">Edit</div>
                </div>
                <div class="reviewContent">
                    <div class="reviewTitle">${review.title}</div>
                    <div class="reviewBody">${review.body}</div>
                </div>
            </div>
        `
    }, '')

    // assign edit button event listeners
    let editBtns = document.querySelectorAll('.focusReview .editBtn')
    console.log(editBtns)

    editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            openEditBox(e)
        })
    })
}

//open edit box
const openEditBox = (e) => {
    // toggle a reviews edit mode
    let index = Number(e.target.parentElement.parentElement.getAttribute('index'))
    let selected = selectedDish.reviews[index]
    console.log(e.target)
    e.target.parentElement.parentElement.innerHTML = `
    <div class="edit">
        <div class="editInfo">
            <input class="submitTitle" type="text" placeholder="Enter Review Title" value="${selected.title}">
            <div class="interactiveStars" id="stars${index}" data-id="${selected.rating}">
                <!-- insert stars via JS -->
            </div>
        </div>
        <textarea class="editBody" placeholder="Enter your review here...">${selected.body}</textarea>
        <div class="editControls">
            <button class="submitButtonEdit">Submit</button>
            <button class="cancelButtonEdit">Cancel</button>
            <button class="deleteButton">Delete</button>
        </div>
    </div>
    `

    interactiveStars(`#stars${index}`)

    // event listeners
    document.querySelector('.submitButtonEdit').addEventListener('click', () => {
        let submitTitle = document.querySelector(`#review${index} .edit .editInfo .submitTitle`).value
        let submitBody = document.querySelector(`#review${index} .edit .editBody`).value
        let submitRating = document.querySelector(`#stars${index}`).getAttribute('data-id')
        editReview(selected._id, submitTitle, submitBody, submitRating)
        closeEditBox(index)
    })
    document.querySelector('.cancelButtonEdit').addEventListener('click', () => {
        closeEditBox(index)
    })
    document.querySelector('.deleteButton').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this todo? This can\'t be undone.')) {
            closeEditBox(index)
            deleteReview(selected._id)
        }
    })

}

//close edit box
const closeEditBox = (index) => {
    let review = selectedDish.reviews[index]
    document.querySelector(`#review${index}`).innerHTML = `
        <div class="reviewHeader">
            <div class="reviewPFP"><img src="./images/anonProfilePic.png" alt="user profile picture"></img></div>
            <div class="reviewHeaderText">
                <div class="reviewUser">${review.user.username}</div>
                <div class="row2">
                    <div class="reviewRating">${returnStars(review.rating)}</div>
                    <div class="reviewDate">${returnDate(review.date)}</div>
                </div>
            </div>
            <div class="editBtn" id="edit${index}">Edit</div>
        </div>
        <div class="reviewContent">
            <div class="reviewTitle">${review.title}</div>
            <div class="reviewBody">${review.body}</div>
        </div>
    `

    // assign edit button event listeners
    let editBtn = document.querySelector(`#edit${index}`)
    console.log(editBtn)

    editBtn.addEventListener('click', (e) => {
        openEditBox(e)
    })
}

const interactiveStars = (id) => {
    let starArea = document.querySelector(id)
    let originalRank = Number(starArea.getAttribute('data-id'))
    
    starArea.innerHTML = ''
    for (let i = 0; i < 5; i++) {
        if(i < originalRank) {
            starArea.innerHTML += `
                <svg class="ratingStar" data-id="${i + 1}" width="24" height="24" viewBox="0 0 24 24"><path data-id="${i + 1}" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
            `
        } else {
            starArea.innerHTML += `
                <svg class="ratingStar" data-id="${i + 1}" width="24" height="24" viewBox="0 0 24 24"><path data-id="${i + 1}" d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
            `
        }
    }
    document.querySelectorAll(`${id} .ratingStar`).forEach(star => {
        star.addEventListener('click', (e) => {
            starArea.innerHTML = ''
            starClick(e, id)
        })
    })
    
}

const starClick = (e, id) => {
    console.log(id)
    let output = ''
    let starArea = document.querySelector(id)
    console.log(starArea)
    userRating = e.target.getAttribute('data-id')
    starArea.setAttribute('data-id', `${userRating}`)
    for (let i = 0; i < 5; i++) {
        if(i < userRating) {
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
            starClick(e, id)
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

const postReview = async () => {
    // example url: localhost:3000/reviews?title=Test Review&body=Wow cool amazing dish omg&rating=4&user=5fa8d7bc6847f97e01a38c38&dish=5fa8d2be6847f97e01a38c35&restaurant=5fa8d36f6847f97e01a38c36
    let title = document.querySelector('.submitTitle').value || "Empty"
    let body = document.querySelector('.submitBody').value || "Empty"
    let url = `/reviews?title=${title}&body=${body}&rating=${userRating || 3}&user=5fa8d7bc6847f97e01a38c38&dish=${selectedDish._id}&restaurant=${selectedDish.restaurant._id}`
    console.log(url)
    const func = async () => {
        let response = await fetch(url, {
            method: 'POST'
        })
        let dish = await response.json()
        return dish
    }
    selectedDish = await func()

    setTimeout(getReviews, 100)
    closeSubmitArea()
}


const editReview = async (id, title, body, rating) => {
    let url = `/reviews/${id}?title=${title}&body=${body}&rating=${rating}`
    console.log(url)

    const func = async () => {
        let response = await fetch(url, {
            method: 'PUT'
        })
        let dish = await response.json()
        return dish
    }
    selectedDish = await func()

    setTimeout(getReviews, 100)
}

const deleteReview = async (id) => {
    let url = `/reviews/${id}`
    console.log(url)

    const func = async () => {
        let response = await fetch(url, {
            method: 'DELETE'
        })
        let dish = await response.json()
        return dish
    }
    selectedDish = await func()

    setTimeout(getReviews, 100)
}

// event listeners
searchSubmit.addEventListener('click', search)
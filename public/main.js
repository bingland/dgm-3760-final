const searchBar = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')

// state
let query = ''

const search = (e) => {
    e.preventDefault()
    query = searchBar.value
    console.log(query)
    getDishes().then(dishes => {
        console.log(dishes)
    })
}

const getDishes = async () => {
    let response = await fetch('/dishes')
    let dishes = await response.json()
    return dishes
}

// event listeners
searchSubmit.addEventListener('click', search)
const searchBar = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')

// state
let query = ''

const search = (e) => {
    e.preventDefault()
    query = searchBar.value
    console.log(query)
}

// event listeners
searchSubmit.addEventListener('click', search)
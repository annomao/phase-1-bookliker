document.addEventListener("DOMContentLoaded", function() {
  const list = document.querySelector("#list")
  const displayPanel = document.querySelector("#show-panel")
  const exampleUser = {
    "id": 1,
    "username": "pouros"
  }
  let baseUrl = "http://localhost:3000/books"

  getBooksList()

  function getBooksList(){
    fetch(baseUrl)
    .then(res => res.json())
    .then(data =>{
      renderBookList(data)
    })
  }
  
  function renderBookList(books){
    list.innerHTML = ""
    books.forEach(book => {
      const li = document.createElement("li")
      li.innerText = book.title
      list.appendChild(li)

      li.addEventListener("click",()=>{
        displayBookDetails(book)
      })
      
    });
  }

  function displayBookDetails(book){
    displayPanel.innerText=""
    const img = document.createElement("img")
    const title = document.createElement("h2")
    const subTitle = document.createElement("h3")
    const author = document.createElement("h3")
    const description = document.createElement("p")
    const ul = document.createElement("ul")
    const button = document.createElement("button")

    img.src = book.img_url
    title.innerText = book.title
    subTitle.innerText = book.subtitle
    author.innerText = book.author
    description.innerText = book.description
    button.id = book.id

    const users = book.users
    displayUsers(users,ul)
    //Check if our example user exists in our array of users and returns true or false
    const isUser = users.some(item => JSON.stringify(item) === JSON.stringify(exampleUser))

    isUser ? button.innerText = "UNLIKE" : button.innerText = "LIKE"

    displayPanel.append(img,title,subTitle,author,description,ul,button)

    button.addEventListener("click",(event)=>{
      const bookId = event.target.id
      updateLikes(bookId,users,ul,event)
    })
  }

  function updateLikes(id,users,ul,event){
    const isUser = users.some(item => JSON.stringify(item) === JSON.stringify(exampleUser))
    if(!isUser){
      event.target.innerText = "UNLIKE"
      const exampleUserCopy = [exampleUser]
      const allUsers = [...users,...exampleUserCopy]
      const dataObj = {
        users: allUsers
      }
      fetch(`http://localhost:3000/books/${id}`,{
        method:"PATCH",
        headers:{
            "content-type": 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify(dataObj)
      })
      .then(res => res.json())
      .then(data =>{
        displayUsers(allUsers,ul)
        getBooksList()
      })
    }
    else{
      event.target.innerText = "LIKE"
      const userIndex = users.findIndex(user =>{
       return user.username === "pouros"
      })
      users.splice(userIndex, 1)
      const dataObj = {
        users: users
      }
      fetch(`http://localhost:3000/books/${id}`,{
        method:"PATCH",
        headers:{
            "content-type": 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify(dataObj)
      })
      .then(res => res.json())
      .then(data =>{
        displayUsers(users,ul)
        getBooksList()
      })
    }
  }

  function displayUsers(users,ul){
    ul.innerHTML = ""
    users.forEach((user)=>{
      const userLi = document.createElement("li")
      userLi.innerText = user.username
      userLi.id = user.id
      ul.appendChild(userLi)
    })
  }

});

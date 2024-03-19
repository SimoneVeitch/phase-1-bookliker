document.addEventListener('DOMContentLoaded', () => {

const booklist = document.querySelector("#list");
const bookinfo = document.querySelector("#show-panel");


    fetch ("http://localhost:3000/books")
    .then (response => response.json())
    .then (books => {
        books.forEach (book => {
            const li = document.createElement("li");
            li.textContent = book.title;
            li.addEventListener("click", () => showBookInfo(book));
            booklist.appendChild(li);
        });
    });

    // show book info on click
    function showBookInfo(book) {
        const usersLiked = book.users.map(user => `<li>${user.username}</li>`).join("");
        bookinfo.innerHTML = `
        <img src ="${book.img_url}" />
        <p class="main">${book.title}</p>
        <p class="main">${book.subtitle}</p>
        <p class="main">${book.author}</p>
        <p>${book.description}</p>
        <ul>${usersLiked}</ul>
        <button class="like-btn" data-id="${book.id}">LIKE</button>
        `;
        bookinfo.querySelector('.like-btn').addEventListener('click', handleLike);
    }

    function handleLike(event) {
        const button = event.target;
        const bookId = button.dataset.id;
      
        fetch(`http://localhost:3000/books/${bookId}`)
          .then((response) => response.json())
          .then((book) => {
            const user = { id: 1, username: "pouros" }; // Default data
      
            if (!book.users.some((u) => u.id === user.id)) {
              book.users.push(user);
      
              fetch(`http://localhost:3000/books/${bookId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ users: book.users }),
              })
                .then((response) => response.json())
                .then((updatedBook) => {
                  showBookInfo(updatedBook);
                })
                .catch((error) => console.error("Error updating book:", error));
            } else {
              console.log("User already liked this book.");
            }
          })
          .catch((error) => console.error("Error fetching book:", error));
      }
    });      
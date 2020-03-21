// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class - Handle UI Tasks, static methods so we dont have to instantiate from UI Class
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class= "btn btn-danger btn-sm delete"> X </a></td>
        `;
    //add the row to the #book-list element
    list.appendChild(row);
  }

  //delete Book, event.target will be passed as parameter
  //if that target element contains delete class, delete it.
  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      //element is inside <td> and <td> is inside the row
      element.parentElement.parentElement.remove();
    }
  }
  //this method takes bootstrap classname and a message and creates
  //a div element instead of putting out a simple alert
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    //set a childelement inside the div and make it of type text
    //with the message inside
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    //insert de div before the form
    container.insertBefore(div, form);

    //Delete after 3 seconds, so it doesnt stack up if pressed more than..
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}
//Store Class: Store Stuff, even when Website is closed
//Objects cant be stored in localStorage -> stringify
class Store {
  static getBooks() {
    let books;
    //if no books are in localStorage set booksarray to null
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      //parse the string that we would get from lStorage into books
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add Book
document.querySelector("#book-form").addEventListener("submit", event => {
  //event.preventDefault();

  //GET FORM VALUES
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("All fields need to be filled.", "danger");
  } else {
    //Instantiate Book
    const book = new Book(title, author, isbn);
    //console.log(book);
    //Add book to UI
    UI.addBookToList(book);

    //Add book to store (localStorage)
    Store.addBook(book);

    //Show success msg
    UI.showAlert("Added successfully!", "success");
    //After book Added, clear Fields
    UI.clearFields();
  }
});
//Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", event => {
  //console.log(event.target);
  //Remove the book from UI
  UI.deleteBook(event.target);
  //remove book from store(localStorage)
  Store.removeBook(
    event.target.parentElement.previousElementSibling.textContent
  );
  UI.showAlert("Removed successfully!", "success");
});

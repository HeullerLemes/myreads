import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import * as BooksAPI from './BooksAPI';
import Self from './Shelf/Shelf';
import Books from './Book/Books';
import Search from './Search/Search';
import BookDetails from './BookDetails/BookDetails'

function App() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [filtredBooks, setFiltredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');

  const shelfs = [
    {
      key: 'currentlyReading',
      name: 'Currently Reading'
    },
    {
      key: 'wantToRead',
      name: 'Want to Read'
    },
    {
      key: 'read',
      name: 'Read'
    }
  ];

  const setBookShelf = (resBooks) => {
    let resFilteredBooks = [];
    for(let resBook of resBooks) {
      const book = books.find((book) => book.id === resBook.id);
      if(book){
        resBook.shelf = book.shelf;
      }
      resFilteredBooks.push(resBook);
    }
    return resFilteredBooks;
  }

  const breakSearchTerms = (newSearchTerm) => {
    return newSearchTerm
    .split(" ")
    .filter((term) => term !== '');

  }

  const getSearchedBooks = async (terms) => {
    let resBooks;
    let resFilteredBooks = [];
    for(let term of terms) {
      resBooks = await BooksAPI.search(term, 10);
      if(resBooks instanceof Array) {
        resFilteredBooks.push(...resBooks);
      }
    }
    return resFilteredBooks;
  }

  const searchBook = async (newSearchTerm) => {
    if(newSearchTerm !== '') {
      const terms = breakSearchTerms(newSearchTerm);
      let resBooks = await getSearchedBooks(terms);
      resBooks = setBookShelf(resBooks);
      setFiltredBooks(resBooks);
      setSearchTerm(newSearchTerm);
    } else {
      setFiltredBooks([]);
      setSearchTerm('');
    }
  }

  const moveBook = async (shelf, book) => {
    await BooksAPI.update(book, shelf);
    getAllBooks();
    searchBook(searchTerm);
  }

  async function getAllBooks() {
    const books = await BooksAPI.getAll();
    setBooks(books);
  }

  const drag = (book) => {
    setSelectedBook(book);
  }

  const drop = (shelf) => {
    moveBook(shelf, selectedBook);
  }

  const allowDrop = (e) => {
    let event = e;
    event.stopPropagation();
    event.preventDefault();
  }

  const navigateToSearch = () => {
    navigate("/search");
    setFiltredBooks([]);
  }

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        MyReads
      </header>
      {
          <Routes>
            <Route 
              exact
              path="/"
              element=
              {
                <div className="shelfs-container">
                  <button className="search-button" onClick={() => navigateToSearch()}>🔍</button>
                  {
                    shelfs.map((shelf) => (
                    <div onDrop={() => drop(shelf.key)}
                         id={shelf.key}
                         key={shelf.key} 
                         onDragOver={event => allowDrop(event)}>
                      <Self key={shelf.key} 
                            shelf={shelf.name}>
                        {books.filter((book) => book.shelf === shelf.key).map((book) => (
                          <div  draggable="true"
                                id={book.id}
                                key={book.id}
                                onClick={() => navigate("/book/"+book.id)}
                                onDragStart={event => drag(book)}>
                            <Books book={book}
                                   onMoveBook={
                                    (shelf) => {
                                      moveBook(shelf, book)
                                    }}>
                            </Books>
                          </div>
                        ))}
                      </Self>
                    </div>))
                  }
                </div>
              }
            />
            <Route
              exact
              path="/search"
              element={
                <Search onFilter={searchBook} 
                        onReturn={() => navigate("/")}>
                  {filtredBooks.map((book) => (
                    <div key={book.id}
                         onClick={() => navigate("/book/"+book.id)}>
                      <Books onMoveBook={
                        (shelf) => {
                          moveBook(shelf, book)
                        }} book={book}>
                      </Books>
                    </div>

                  ))}
                </Search>
              }
            />
            <Route exact
                   path="/book/:id"
                   element={
                    <BookDetails></BookDetails>
                   }/>
          </Routes>
      }
    </div>
  );
}

export default App;

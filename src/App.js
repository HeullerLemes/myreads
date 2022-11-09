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

  const filterBooks = (searchTerm) => {
    console.log(searchTerm, books);
    const filtered = books.filter((book) => book.title.toUpperCase().includes(searchTerm.toUpperCase()) );
    console.log(filtered);
    setFiltredBooks(filtered);
  }

  const searchBook = (searchTerm) => {
    if(searchTerm) {
      filterBooks(searchTerm) 
    } else {
      setFiltredBooks(books);
    }
  }

  const moveBook = async (shelf, book) => {
    await BooksAPI.update(book, shelf);
    bookAPI();
  }

  async function bookAPI() {
    const books = await BooksAPI.getAll();
    setBooks(books);
    setFiltredBooks(books);
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

  useEffect(() => {
    bookAPI();
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
                  <button className="search-button" onClick={() => navigate("/search")}>🔍</button>
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
                      <Books  onMoveBook={
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

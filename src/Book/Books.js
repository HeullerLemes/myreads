import './Book.css';

function Books({book, onMoveBook}) {
    const onSelectChange = (event) => {
        onMoveBook(event.target.value)
    };
    return (
        <div className="book">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage:
                  "url("+book.imageLinks.thumbnail+")",
              }}>
            </div>
            <div>
              <select value={book.shelf} onChange={onSelectChange}>
                <option value="none" disabled>
                  Move to...
                </option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
            <p className="book-title">{book.title}</p>
            <p>{book.authors[0]}</p>
        </div>
    )
}

export default Books;
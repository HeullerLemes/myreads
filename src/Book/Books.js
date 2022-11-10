import './Book.css';

function Books({book, onMoveBook}) {
  const options = [
    {
      name: 'Currently Reading',
      value: 'currentlyReading'
    },
    {
      name: 'Want To Read',
      value: 'wantToRead'
    },
    {
      name: 'Read',
      value: 'read'
    },
    {
      name: 'None',
      value: 'none'
    }
  ]
    const onSelectChange = (event) => {
        onMoveBook(event.target.value)
    };
    const preventPropagation = (event) => {
      event.stopPropagation();
    }

    const thumbnail = () => {
      return book.imageLinks?.thumbnail ? 'url('+book.imageLinks?.thumbnail+')' : 'none'
    }
    return (
        <div className="book">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: thumbnail(),
              }}>
            </div>
            <div>
              <select value={book.shelf ? book.shelf : 'none'}
                      onClick={preventPropagation}
                      onChange={onSelectChange}>
                <option value="none" disabled>
                  Move to...
                </option>
                {
                  options.map((option) => (
                    <option key={option.value} value={option.value}>{option.name}</option>
                  ))
                }
              </select>
            </div>
            <p className="book-title">{book.title ? book.title : ''}</p>
            <p>{book.authors?.lenght > 0 ? book.authors[0] : ''}</p>
        </div>
    )
}

export default Books;
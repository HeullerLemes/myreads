import { useParams } from 'react-router-dom';
import * as BooksAPI from './../BooksAPI';
import { useState, useEffect } from 'react';

function BookDetails() {
    const params = useParams();
    const [book, setBook] = useState();
    const getBook = async (bookId) => {
        setBook(await BooksAPI.get(bookId));
    }

    useEffect(() => {
        getBook(params.id);
      }, [params]);

    return (
        <div>
            <p>Title: {book?.title}</p>
            <p>Page count: {book?.pageCount}</p>
            <p>Description: {book?.description}</p>
            <a href={book?.previewLink}>Preview Link</a>
        </div>
    )
}

export default BookDetails;
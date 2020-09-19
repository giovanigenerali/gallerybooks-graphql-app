import React, { useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";

const BOOKS_QUERY = `
query {
  books {
    id
    title
    year
    rating
    image
    likes
    author {
      name
    }
  }
}
`;

const BOOK_LIKE = `
mutation LikeBook($id: Int!) {
  likeBook(input: { id: $id }) {
    success
  }
}
`;

const BOOK_SUBSCRIPTION = `
subscription {
  changedBook {
    id
    title
    likes
  }
}
`;

function App() {
  const [updatedBooks, setUpdateBooks] = useState({});

  const [{ fetching, error, data }] = useQuery({ query: BOOKS_QUERY });
  const [, likeBook] = useMutation(BOOK_LIKE);

  useSubscription({ query: BOOK_SUBSCRIPTION }, (_, event) => {
    setUpdateBooks({
      ...updatedBooks,
      [event.changedBook.id]: event.changedBook,
    });
  });

  const getCurrentBookLikes = (book) =>
    updatedBooks.hasOwnProperty(book.id)
      ? updatedBooks[book.id].likes
      : book.likes;

  if (error) {
    return <div>Erro</div>;
  }

  return (
    <>
      <h1>Books</h1>

      {fetching && !error && !data && (
        <table>
          <tbody>
            <tr>
              <td>Loading...</td>
            </tr>
          </tbody>
        </table>
      )}

      {!fetching && !error && data && data.books.length === 0 && (
        <table>
          <tbody>
            <tr>
              <td>No books found.</td>
            </tr>
          </tbody>
        </table>
      )}

      {!fetching && error && (
        <table>
          <tbody>
            <tr>
              <td>Failed to load books, please try again.</td>
            </tr>
          </tbody>
        </table>
      )}

      {!fetching && !error && data && data.books.length > 0 && (
        <table className="books">
          <thead>
            <tr>
              <th />
              <th>Author</th>
              <th>Title</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Likes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.books.map((book) => (
              <tr key={book.id}>
                <td>
                  <img src={book.image} alt={book.title} />
                </td>
                <td>{book.author.name}</td>
                <td>{book.title}</td>
                <td>{book.year}</td>
                <td>{book.rating}</td>
                <td>{getCurrentBookLikes(book)}</td>
                <td>
                  <button onClick={() => likeBook({ id: book.id })}>
                    Like
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default App;

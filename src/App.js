import React, { useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";

import ReactStars from "react-rating-stars-component";

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

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl mt-6 font-bold">
        <span role="img" aria-label="icon books">
          📚
        </span>{" "}
        Gallery Books
      </h1>

      {fetching && !error && !data && (
        <div className="flex flex-row place-items-center text-blue-700 p-4 my-6">
          <svg
            className="animate-spin mr-3 h-5 w-5 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p>Loading...</p>
        </div>
      )}

      {!fetching && !error && data && data.books.length === 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-6">
          <p>No books found.</p>
        </div>
      )}

      {!fetching && error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-6">
          <p>Failed to load books, please try again.</p>
        </div>
      )}

      {!fetching && !error && data && data.books.length > 0 && (
        <table className="w-full border-collapse border-2 border-gray-500 my-6">
          <thead>
            <tr>
              <th className="border bg-gray-200 border-gray-400 px-4 py-2 text-gray-800" />
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800">
                Author
              </th>
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800">
                Title
              </th>
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800">
                Year
              </th>
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800">
                Rating
              </th>
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800">
                Likes
              </th>
              <th className="border  bg-gray-200 border-gray-400 px-4 py-2 text-gray-800" />
            </tr>
          </thead>
          <tbody>
            {data.books.map((book) => (
              <tr key={book.id}>
                <td className="border border-gray-400 px-4 py-2 text-gray-800">
                  <img src={book.image} alt={book.title} />
                </td>
                <td className="border border-gray-400 px-4 py-2 text-gray-800">
                  {book.author.name}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-gray-800">
                  {book.title}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-gray-800">
                  {book.year}
                </td>
                <td
                  className="border border-gray-400 px-4 py-2 text-gray-800 text-center"
                  title={book.rating}
                >
                  <ReactStars
                    value={book.rating}
                    edit={false}
                    size={20}
                    classNames="ratingStars"
                  />
                </td>
                <td className="border border-gray-400 px-4 py-2 text-gray-800 text-center">
                  {getCurrentBookLikes(book)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-gray-800 text-center">
                  <button
                    onClick={() => likeBook({ id: book.id })}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Like
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

import { gql } from '@apollo/client';

// Query to retrieve the logged-in user's data, including saved books
export const GET_ME = gql`
query Me {
  me {
    _id
    bookCount
    email
    username
    savedBooks {
      title
      bookId
      authors
      description
      image
    }
  }
}`;
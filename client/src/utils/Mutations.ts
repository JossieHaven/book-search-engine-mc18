import { gql } from '@apollo/client';

// Mutation for logging in a user
export const LOGIN_USER = gql`
    mutation loginUser($input: LoginInput!) {
        login(input: $input) { 
        token
        user {
        _id
        username
        email
        }
        }
    }`;

// Mutation for creating a new user account
export const ADD_USER = gql`
    mutation Mutation($input: CreateUserInput!) {
        addUser(input: $input) {
            token
            user {
            _id
            email
            username
            }
        }
    }`;

// Mutation for saving a book to the user's saved books list
export const SAVE_BOOK = gql`
    mutation SaveBook($book: BookInput!) {
  saveBook(book: $book) {
    username
    savedBooks {
      bookId
      title
      authors
      description
      image
    }
  }
}`;

// Mutation for removing a book from the user's saved books list
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
                _id
                username
                email
                bookCount
                savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                }
        }
    }`;
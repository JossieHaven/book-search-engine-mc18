import gql from 'graphql-tag';

const typeDefs = gql`

  type User {
    _id: String!
    username: String
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String
    image: String
    # link: String
  }

  type Auth {
    token: String!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(input: CreateUserInput!): Auth
    login(input: LoginInput!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: String!): User
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String
    password: String!
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String
    image: String
    # link: String
  }
`;

export default typeDefs;

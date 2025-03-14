import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import Navbar from './components/Navbar';

// Initialize Apollo Client with GraphQL endpoint and caching mechanism
const client = new ApolloClient({
  uri: '/graphql', // API endpoint for GraphQL requests
  cache: new InMemoryCache(), // Enables caching for improved performance
  headers: { 
    Authorization: `Bearer ${localStorage.getItem('id_token')}`, // Attach auth token from localStorage
  },
});

function App() {
  return (
    <ApolloProvider client={client}> {/* Provides Apollo Client to the application */}
      <Navbar /> {/* Renders the navigation bar */}
      <Outlet /> {/* Renders matched route components */}
    </ApolloProvider>
  );
}

export default App;
import {ApolloClient, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
  uri: "/dna/api/graphql",
  cache: new InMemoryCache({
    addTypename: false
  })
});

export default client;

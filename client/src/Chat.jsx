import React, { useState } from "react";

import {
  ApolloClient,
  InMemoryCache,
  useMutation,
  useSubscription,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Chip, Grid, TextField, Button } from "@material-ui/core";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

export const client = new ApolloClient({
  link, //websocket link
  uri: "http://localhost:4000/", //connect to server
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      text
    }
  }
`;
const POST_MESSAGE = gql`
  mutation ($user: String!, $text: String!) {
    postMessage(user: $user, text: $text)
  }
`;






export const Chat = () => {
  const [user, setUser] = useState("Username"); //initialize user
  const [text, setText] = useState(""); //initialize text
  const [postMessage] = useMutation(POST_MESSAGE);

  const sendMessage = () => {

    if (text.length > 0 && user.length > 0) {
      postMessage({
        variables: { user: user, text: text },
      });
      setText(""); //reset text field
    } else {
     
      alert("Missing fields!");
    }
  };

  const Messages = ({ user }) => {
    const { data } = useSubscription(GET_MESSAGES); //executes query
    if (!data) {
      return null; //if no data fetched, return null
    }

    
   
    //else return the fetched data
    return (
      <div style={{ marginBottom: "5rem" }}>
        {data.messages.map(({ id, user, text }) => {
          return (
            <div key={id} style={{ textAlign: "right" }}>
              <p style={{ marginBottom: "0.3rem" }}>{user}</p>
              <Chip
                style={{ fontSize: "0.9rem" }}
                color="primary"
                label={text}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Container>
      <h3>Welcome to React Chat App, built on GraphQL 🛢📳</h3>
      <Messages />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            onChange={(e) => {
              setUser(e.target.value);
            }}
            value={user}
            size="small"
            fullWidth
            variant="outlined"
            required
            label="Enter name"
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            size="small"
            fullWidth
            variant="outlined"
            required
            label="Enter message here"
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={sendMessage}
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#60a820", color: "white" }}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { RecoilRoot } from 'recoil';
import * as Realm from "realm-web";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";

/** page props setup **/
document.body.style.height = "100%"
document.body.style.backgroundColor = "black"

export const isTouchscreen = () => { return window.matchMedia("(pointer: coarse)").matches }

const breakpoints = createBreakpoints({
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
})

/** chakra setup **/
const theme = extendTheme({
  ...breakpoints,
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _focus: { boxShadow: "none" },
        },
        tabpanel: {
          padding: "0",
        }
      },
      variants: {
        line: {
          tab: {
            borderBottom: "4px solid",
            borderColor: "white",
            _selected: {
              borderColor: "red",
              color: "red"
            }
          },
        }
      }

    }
  }
})

/** graphql client setup **/
export const APP_ID = "shmibblez-app-cnmrx"; // FIXME: load with hosting config variables
//.
// Connect to your MongoDB Realm app
const app = new Realm.App(APP_ID);
// Gets a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  // Guarantee that there's a logged in user with a valid access token
  if (!app.currentUser) {
    // If no user is logged in, log in an anonymous user. The logged in user will have a valid
    // access token.
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    // An already logged in user's access token might be stale. To guarantee that the token is
    // valid, we refresh the user's custom data which also refreshes their access token.
    await app.currentUser.refreshCustomData();
  }
  return app!.currentUser!.accessToken
}
// Configure the ApolloClient to connect to your app's GraphQL endpoint
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`,
    // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
    // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
    // access token before sending the request.
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      // @ts-ignore, !!dangerous!! not sure if always works
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    },
  }),
  cache: new InMemoryCache()
});
export const realmSetup = () => {

}

// provider setup, chakra and recoil
ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </ApolloProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

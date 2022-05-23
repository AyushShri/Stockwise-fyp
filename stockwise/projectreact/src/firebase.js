import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyAjWIJe9AaL6fDZVn9tRajF-BUexEPFZyA",
  authDomain: "react-notif-40228.firebaseapp.com",
  projectId: "react-notif-40228",
  storageBucket: "react-notif-40228.appspot.com",
  messagingSenderId: "790644971731",
  appId: "1:790644971731:web:dc0c5d007d2b961af3dc26"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const MESSAGING_KEY = "BEYV8mHJnNO6GlZIl5_7hCwuMWi0tqTZMtMfY1PVsjp7Y8Xf6cBQw4XVFiBM9w7npss6dQFAcfY2Nmk55db6J3A";


export const fetchToken = (setTokenFound) => {
  
  return getToken(messaging, {vapidKey: MESSAGING_KEY}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
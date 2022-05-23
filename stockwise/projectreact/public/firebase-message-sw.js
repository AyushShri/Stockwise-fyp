// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAw0iOSHeBsCkcRWhs5t0Y-P9sxNCuwqBo",
  authDomain: "stock-update-34a1c.firebaseapp.com",
  projectId: "stock-update-34a1c",
  storageBucket: "stock-update-34a1c.appspot.com",
  messagingSenderId: "584491013913",
  appId: "1:584491013913:web:11f6c95a6a32e162ee1788",
  measurementId: "G-M34S99QQT2"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
firebase.initializeApp({
    'messagingSenderId': 'AIzaSyDOp3nwgVfyhQ_Ugm19MM6td39IheXIjCI'
});
const messaging = firebase.messaging();
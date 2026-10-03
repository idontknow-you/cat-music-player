// Song requests are saved to Firebase Firestore (collection: "requests").
// Paste your own config from Firebase console > Project settings > Your apps > Web app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: ''
};

const form = document.getElementById('request');
const msg = document.getElementById('rq-msg');
const configured = firebaseConfig.apiKey && firebaseConfig.projectId;
const db = configured ? getFirestore(initializeApp(firebaseConfig)) : null;
let lastSent = 0;

form.onsubmit = async e => {
  e.preventDefault();
  if (!db) { msg.textContent = 'Requests are not set up yet.'; return; }
  if (Date.now() - lastSent < 15000) { msg.textContent = 'Slow down, try again in a few seconds.'; return; }
  const song = document.getElementById('rq-song').value.trim();
  const artist = document.getElementById('rq-artist').value.trim();
  if (!song) return;
  try {
    await addDoc(collection(db, 'requests'), { song, artist, createdAt: serverTimestamp() });
    lastSent = Date.now();
    msg.textContent = 'Request sent. Thank you!';
    form.reset();
  } catch (err) {
    msg.textContent = 'Could not send. Try again later.';
  }
};
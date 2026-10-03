import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsxcWfYvsmIVheqZaHos2FEtRrnLVHV4I",
  authDomain: "cat-music-player-fbcdc.firebaseapp.com",
  projectId: "cat-music-player-fbcdc",
  storageBucket: "cat-music-player-fbcdc.firebasestorage.app",
  messagingSenderId: "997172895506",
  appId: "1:997172895506:web:15093179967f274a4d9dcb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("request");
const songInput = document.getElementById("rq-song");
const artistInput = document.getElementById("rq-artist");
const msgEl = document.getElementById("rq-msg");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const song = songInput.value.trim();
  const artist = artistInput.value.trim();

  if (!song) {
    msgEl.textContent = "Please enter a song title.";
    return;
  }

  // simple client-side cooldown (30s) to discourage spam
  const last = Number(localStorage.getItem("lastRequestAt") || 0);
  if (Date.now() - last < 30000) {
    msgEl.textContent = "Easy there! Try again in a few seconds.";
    return;
  }

  submitBtn.disabled = true;
  msgEl.textContent = "Sending...";

  try {
    await addDoc(collection(db, "requests"), {
      song: song.slice(0, 80),
      artist: artist.slice(0, 80),
      createdAt: serverTimestamp(),
    });
    localStorage.setItem("lastRequestAt", String(Date.now()));
    form.reset();
    msgEl.textContent = "Request sent! 🐱";
  } catch (err) {
    console.error(err);
    msgEl.textContent = "Couldn't send, try again.";
  } finally {
    submitBtn.disabled = false;
  }
});
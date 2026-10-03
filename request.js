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

const form = document.getElementById("request-form");
const songInput = document.getElementById("request-song");
const nameInput = document.getElementById("request-name");
const statusEl = document.getElementById("request-status");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const song = songInput.value.trim();
  const name = nameInput.value.trim();

  if (!song) {
    statusEl.textContent = "Please enter a song name.";
    return;
  }

  // simple client-side cooldown (30s) to discourage spam
  const last = Number(localStorage.getItem("lastRequestAt") || 0);
  if (Date.now() - last < 30000) {
    statusEl.textContent = "Easy there! Try again in a few seconds.";
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = "Sending...";

  try {
    await addDoc(collection(db, "song_requests"), {
      song: song.slice(0, 100),
      name: name.slice(0, 50),
      createdAt: serverTimestamp(),
    });
    localStorage.setItem("lastRequestAt", String(Date.now()));
    form.reset();
    statusEl.textContent = "Request sent! 🐱";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Couldn't send, try again.";
  } finally {
    submitBtn.disabled = false;
  }
});
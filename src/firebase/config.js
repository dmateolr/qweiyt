import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDMjqUiC7aNkLjzrpdqpRkPWohCvJ9D-7w",
  authDomain: "sportyav2.firebaseapp.com",
  projectId: "sportyav2",
  storageBucket: "sportyav2.appspot.com",
  messagingSenderId: "357595669731",
  appId: "1:357595669731:web:3343b347fb9458695391d6"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
export { firestore, auth, storage, analytics };

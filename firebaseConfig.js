import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCyB_MfWrNR9jYuDJ0A-9YOf_hAo4dnTt0",
	authDomain: "neumi-app-development.firebaseapp.com",
	databaseURL: "https://neumi-app-development.firebaseio.com",
	projectId: "neumi-app-development",
	storageBucket: "neumi-app-development.appspot.com",
	messagingSenderId: "982426357820",
	appId: "1:982426357820:web:43e12c0cafa683abfdb339",
	measurementId: "G-9YYZBD04LT",
};

let app;
if (!firebase.apps.length) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}
const storage = getStorage(app, "gs://neumi-app-development.appspot.com");
const auth = app.auth();
const db = getFirestore(app);

export { storage, auth, db };
export default firebase;

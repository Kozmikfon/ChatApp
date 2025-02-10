import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAqae3ENw7GU7I7MEI4AdPyISgFLl1nViM',
  authDomain: 'chat-app-d523b.firebaseapp.com',
  projectId: 'chat-app-d523b',
  storageBucket: 'chat-app-d523b.appspot.com',
  messagingSenderId: '22854053012',
  appId: '1:22854053012:web:7b93bbdb0b2163f6839881',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('🔥 Firebase initialized successfully');
} else {
  console.log('✅ Firebase already initialized');
}

export default firebase;

import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatList from './src/screen/ChatList/';
import Settings from './src/screen/Settings';
import Chat from './src/screen/Chat';
import SignUp from './src/screen/SignUp';
import SignIn from './src/screen/SignIn';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Provider, DefaultTheme} from 'react-native-paper';
import firebase from 'firebase/app'; // 'firebase/app' modülünü içe aktar
import '@react-native-firebase/auth'; // Firebase auth modülünü içe aktar
import '@react-native-firebase/firestore'; // Firebase firestore modülünü içe aktar

// Firebase'in doğru şekilde başlatıldığını kontrol et
const firebaseConfig = {
  apiKey: 'AIzaSyAqae3ENw7GU7I7MEI4AdPyISgFLl1nViM',
  authDomain: 'chat-app-d523b.firebaseapp.com',
  projectId: 'chat-app-d523b',
  storageBucket: 'chat-app-d523b.appspot.com',
  messagingSenderId: '22854053012',
  appId: '1:22854053012:web:7b93bbdb0b2163f6839881',
};

// Firebase başlatılmadıysa başlat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Başlatılmış bir Firebase uygulaması kullan
}

export {firebase}; // Firebase'i dışa aktar

const Stack = createNativeStackNavigator();

const Tabs = createBottomTabNavigator();

const TabsNavigator = () => {
  const navigation = useNavigation();
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate('SignUp');
      }
    });
  }, []);

  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          return (
            <Ionicons
              name={route.name === 'ChatList' ? 'chatbubbles' : 'settings'}
              color={color}
              size={size}
            />
          );
        },
      })}>
      <Tabs.Screen name="ChatList" component={ChatList} />
      <Tabs.Screen name="Settings" component={Settings} />
    </Tabs.Navigator>
  );
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    accent: '#e91e63',
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabsNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{presentation: 'fullScreenModal'}}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{presentation: 'fullScreenModal'}}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;

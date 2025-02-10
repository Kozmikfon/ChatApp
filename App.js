import React, {useEffect} from 'react';
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
import auth from '@react-native-firebase/auth';
import firebase from './firebase'; // Firebase'i burada içe aktar

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
        tabBarIcon: ({color, size}) => (
          <Ionicons
            name={route.name === 'ChatList' ? 'chatbubbles' : 'settings'}
            color={color}
            size={size}
          />
        ),
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

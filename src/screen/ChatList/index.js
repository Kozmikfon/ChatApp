import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  List,
  Avatar,
  Divider,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/core';

const ChatList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      setEmail(user?.email ?? '');
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const unsubscribeChats = firestore()
      .collection('chats')
      .where('users', 'array-contains', email)
      .onSnapshot(querySnapshot => {
        setChats(querySnapshot.docs);
      });

    return unsubscribeChats;
  }, [email]);

  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);

    const response = await firestore()
      .collection('chats')
      .add({
        users: [email, userEmail],
        messages: [], // Mesajlar için boş bir dizi ekle
      });

    setIsLoading(false);
    setIsDialogVisible(false);
    navigation.navigate('Chat', { chatId: response.id });
  };

  return (
    <View style={{ flex: 1 }}>
      {chats.map(chat => (
        <React.Fragment key={chat.id}>
          <List.Item
            title={chat.data().users.find(x => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            left={() => (
              <Avatar.Text
                label={chat
                  .data()
                  .users.find(x => x !== email)
                  .split(' ')
                  .reduce((prev, current) => prev + current[0], '')}
                size={56}
              />
            )}
            onPress={() => navigation.navigate('Chat', { chatId: chat.id })}
          />
          <Divider inset />
        </React.Fragment>
      ))}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={userEmail}
              onChangeText={text => setUserEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => createChat()} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;

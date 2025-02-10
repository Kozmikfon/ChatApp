import {useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GiftedChat} from 'react-native-gifted-chat';

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [uid, setUID] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        setUID(user.uid);
        setName(user.displayName);
      }
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const unsubscribeChat = firestore()
      .doc('chats/' + route.params.chatId)
      .onSnapshot(snapshot => {
        const messages = snapshot.data()?.messages ?? [];
        setMessages(
          messages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt?.toDate(), // Timestamp'i Date formatına çevir
          })),
        );
      });
    return unsubscribeChat;
  }, [route.params.chatId]);

  const onSend = (m = []) => {
    firestore()
      .doc('chats/' + route.params.chatId)
      .update({
        messages: firestore.FieldValue.arrayUnion(...m),
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
};

export default Chat;

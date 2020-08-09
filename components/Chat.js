import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { View, Text, StyleSheet, Platform } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      uid: '',
      user: {
        _id: '',
        name: '',
      },

    };
    //firabase access data
    const firebaseConfig = {
      apiKey: "AIzaSyBuY5bi4m_iDquRm4SGJ6ONGMw6xuYkLOA",
      authDomain: "my-project-1530093055040.firebaseapp.com",
      databaseURL: "https://my-project-1530093055040.firebaseio.com",
      projectId: "my-project-1530093055040",
      storageBucket: "my-project-1530093055040.appspot.com",
      messagingSenderId: "404822874074",
      appId: "1:404822874074:web:59ebf927e425dff38752e3",
      measurementId: "G-2FR2JSWQSS"
    }
    //call database from firestone
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
      };
    this.referenceMessages = firebase.firestore().collection('myChatApp');
    //this.referenceMessagesUser = firebase.firestore().collection('myChatApp').where("uid", "==", this.state.uid);
  }

  //feed messages to state on component mount
  componentDidMount() {
    //if noo user data, sign in anonymously and get uid
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Hello there',
      });
      // add user data
      this.setState({
        user: {
          name: this.props.route.params.name,
          _id: this.state.uid
        },
      });
    });
    // listen for collection changes for current user
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    //this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
  }
  
  componentWillUnmount() {
    this.unsubscribe();
    //this.unsubscribeMessagesUser();
  }

  //update state wehn new messages appear
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loop through documents
    querySnapshot.forEach((doc) => {
      // get data snapshot
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
      //sort messages by date added
      messages.sort((a, b) => b.createdAt - a.createdAt)
    });
    this.setState({
      messages,
    });
    //add a welcome message if thread is empty
    if (this.state.messages.length === 0) {
      var firstMessage = [
        {
          _id: 1,
          text: `Wellcome to the chat App`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
          },
        },
      ];
      this.onSend(firstMessage);
    }
  };

  //add new messages to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      },
    );
  }

  //add new messages to firestone database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  //add attributes to bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#121F67'
          },
          left: {
              backgroundColor: '#FFEBD0'
          }
        }}
      />
    )
  }
  
  render() {
    let name = this.props.route.params.name; // OR ...
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={ [ styles.container, {backgroundColor: color} ] }>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: this.state.user.name,
          }}
        />
        {/*Platform.OS === 'android' ? <KeyboardSpacer /> : null */}
        {/* Rest of the UI */}
      </View>
    );
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})
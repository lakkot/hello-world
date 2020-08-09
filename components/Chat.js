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
      lists: [],
      user: {
        uid: '1322',
        name: '',
      },
      uid: '1322',

    };
    
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
  
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    };
  this.referenceMessages = firebase.firestore().collection('myChatApp').doc('chat1');
  this.referenceMessagesUser = firebase.firestore().collection('myChatApp').where("_id", "==", this.state.uid);
  
  }
  //feed messages to state on component mount
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: this.state.uid,
          text: `Hello ${this.props.route.params.name}! Wellcome to the chat`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
      user: {
        name: this.props.route.params.name,
        uid: this.state.user.uid
      }
    })
    
    this.referenceMessages = firebase.firestore().collection('myChatApp');
    this.referenceMessagesUser = firebase.firestore().collection('myChatApp').where("_id", "==", this.state.uid);
    // listen for collection changes for current user
    this.unsubscribeListUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        uid: this.state.user.uid,
        loggedInText: 'Hello there',
      });
      // create a reference to the active user's documents (shopping lists)
    });
    

  }
  
  componentWillUnmount() {
    //this.unsubscribe();
    this.unsubscribeListUser();
 }

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
        avatar: data.user.avatar,
      },
      image: data.image || '',
    });
  });
  this.setState({
    messages,
  });
};


  //add new messages to state
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.addMessages();
  }

  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  };

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
    console.log(this.state.messages)
    console.log(this.state.user)
    let name = this.props.route.params.name; // OR ...
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={ [ styles.container, {backgroundColor: color} ] }>
        <Text>{this.state.loggedInText}</Text>

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
    flex: 1,

  },

})



/*
<View style={styles.container}>

<Text>{this.state.loggedInText}</Text>

<Text style={styles.text}>All Shopping lists</Text>
<FlatList
    data={this.state.lists}
    renderItem={({ item }) => 
      <Text style={styles.item}>{item.name}: {item.items}</Text>}
  />

<Button 
  onPress={() => {
    this.addList();
  }}
  title = "Add something"
/>
</View>

*/
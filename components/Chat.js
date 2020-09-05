import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import NetInfo from "@react-native-community/netinfo";

import { View, Text, StyleSheet, Platform, AsyncStorage, Image } from 'react-native';

import CustomActions from './ActionSheet.js'

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
      isConnected: false,
      image: null,
      location: null,
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
  //get messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  //save messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }
  //delete messages from asyncStorage

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }


  //feed messages to state on component mount
  componentDidMount() {

    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
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
          this.setState({ isConnected: true})
        });
        
      } else {
        this.getMessages();
        this.setState({ isConnected: false})
      }
      // listen for collection changes for current user
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
      //this.unsubscribeMessagesUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);  
    });
    

    
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
        //image: data.image ||  '',
        //location: data.location || '',
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
  };

  //add new messages to state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
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
      image: message.image || '',
      location: message.location || ''
    });
    //console.log(message.location)
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

  renderInputToolbar(props) {
    if (props.isConnected === false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }
  
  renderCustomActions = (props) => {
    return <CustomActions {...props} /> ;
    
  };

  renderCustomView (props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
    //let name = this.props.route.params.name; // OR ...
    let name = this.state.isConnected; // OR ...
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={ [ styles.container, {backgroundColor: color} ] }>


        <GiftedChat
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          onSend={messages => this.onSend(messages, false)}
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
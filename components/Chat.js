/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable import/extensions */





import React from 'react';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

import {
  View, StyleSheet, AsyncStorage, LogBox,
} from 'react-native';

console.disableYellowBox = true;


import CustomActions from './ActionSheet.js';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
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
    // firabase access data
    const firebaseConfig = {
      apiKey: 'AIzaSyBuY5bi4m_iDquRm4SGJ6ONGMw6xuYkLOA',
      authDomain: 'my-project-1530093055040.firebaseapp.com',
      databaseURL: 'https://my-project-1530093055040.firebaseio.com',
      projectId: 'my-project-1530093055040',
      storageBucket: 'my-project-1530093055040.appspot.com',
      messagingSenderId: '404822874074',
      appId: '1:404822874074:web:59ebf927e425dff38752e3',
      measurementId: 'G-2FR2JSWQSS',
    };
    // call database from firestone
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceMessages = firebase.firestore().collection('myChatApp');
  }

  // feed messages to state on component mount
  componentDidMount() {
    NetInfo.fetch().then((isConnected) => {
      if (isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          // update user state with currently active user data
          this.setState({
            uid: user.uid,
            loggedInText: 'Hello there',
          });
          // add user data
          this.setState({
            user: {
              name: this.props.route.params.name,
              _id: this.state.uid,
            },
          });
          this.setState({ isConnected: true });
        });
      } else {
        this.getMessages();
        this.setState({ isConnected: false });
      }
      // listen for collection changes for current user
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    // this.unsubscribeMessagesUser();
  }

  /**
   * Sends messages
   * @async
   * @function onSend
   * @param {string} messages
   * @return {state} GiftedChat
   */
  onSend(messages = []) {
    // add new messages to state
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
  /**
   * Update message state with recent data
   * @function onCollectionUpdate
   * @param {string} _id - message id
   * @param {string} text - content
   * @param {date} cratedAt - date and time sent
   * @param {string} user - user data
   * @param {string} image - image sent
   * @param {number} location - geographical coordinates
   */

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
        image: data.image,
        location: data.location,
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
      // sort messages by date added
      messages.sort((a, b) => b.createdAt - a.createdAt);
    });
    this.setState({
      messages,
    });
  };

  /**
   * get messages from AsyncStorage
   * @async
   * @function getMessages
   * @param {string} messages
   * @return {state} messages
   */
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Pushes messages to Firestore database
   * @function addMessages
   * @param {string} _id - message id
   * @param {string} text - message content
   * @param {date} cratedAt - date and time of message
   * @param {string} image
   * @param {number} location - geographical coordinates
   * @param {boolean} sent
   */
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || '',
    });
    // console.log(message.location)
  };

  /**
   * Saves messages to AsyncStorage
   * @async
   * @function saveMessages
   * @param {string} messages
   * @return {AsyncStorage}
   */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Deletes messages from AsyncStorage
   * @async
   * @function deleteMessages
   * @param {string} messages
   * @return {AsyncStorage}
   */
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Adds attributes to GiftedChat Bubble
   * @function renderBubble
   * @param {*} props
   * @returns {InputToolbar}
   */
  renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#121F67',
        },
        left: {
          backgroundColor: '#FFEBD0',
        },
      }}
    />
  )

  /**
   * Renders input toolbar only if online
   * @function renderInputToolbar
   * @param {*} props
   * @returns {Bubble}
   */
  renderInputToolbar = (props) => {
    if (props.isConnected === false) {
      return (
        <InputToolbar />
      );
    }
    return (
      <InputToolbar
        {...props}
      />
    );
  }

  /**
   * Renders upload image, take photo and share location options
   * @function renderCustomActions
   * @param {*} props
   * @returns {CustomActions}
   */
  renderCustomActions = (props) => <CustomActions {...props} /> ;

  /**
   * if currentMessage has location coords then mapview is returned
   * @function renderCustomView
   * @param {*} props
   * @returns {MapView}
   */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
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
    let name = this.props.route.params.name; // OR ...
    const { color } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, { backgroundColor: color }]}>

        <GiftedChat
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          onSend={(messages) => this.onSend(messages, false)}
          user={{
            _id: this.state.uid,
            name: this.state.user.name,
          }}
        />
        {/* Platform.OS === 'android' ? <KeyboardSpacer /> : null */}
        {/* Rest of the UI */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

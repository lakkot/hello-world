import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, FlatList } from 'react-native';

//const firebase = require('firebase');
//require('firebase/firestore');

// import the screens
import Home from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Create the navigator
const Stack = createStackNavigator();

export default class HelloWorld extends Component {

  constructor() {
    super()
    this.state = {
      name: '',
    };
  };

  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView } from 'react-native';

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
      name: ''
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  box1: {
    flex:1,
    backgroundColor: '#41354d'
  },
  box2: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#de7e44'
  },
  box3: {
    flex:3,
    backgroundColor: '#5d9b84'
  }
});



/*
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box1}></View>
        <View style={styles.box2}>
          <TextInput
            style={{height: 40, width: '80%', borderColor: 'white', borderWidth: 1}}
            onChangeText={ (text) => this.setState({text}) }
            value={this.state.text}
            placeholder='Type here'
          />
          <Button
            onPress={() => {
              this.alertMyText({text: this.state.text});
            }}
            title="Press Me"
          />
          <Text>You wrote: {this.state.text}</Text>
        </View>
        <View style={styles.box3}>
          <ScrollView>
            <Text style={{fontSize:110}}>This text is so big! And so long! You have to scroll!</Text>
          </ScrollView>
        </View>
      </View>
    );
  }
*/
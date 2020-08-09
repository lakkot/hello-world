import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, Button, Alert, ScrollView, FlatList } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

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
      lists: [],
      user: {
        uid: '8fVbXZs4cnXPRq8zY86X2PUHSE42',
        name: '',
      },
      uid: '8fVbXZs4cnXPRq8zY86X2PUHSE42',
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
  this.referenceShoppingLists = firebase.firestore().collection('shoppinglists').doc('list2');
  this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
  
  };

  componentDidMount() {
    this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');
    //this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate);
    this.referenceShoppinglistUser = firebase.firestore().collection('shoppinglists').where("uid", "==", this.state.uid);
    // listen for collection changes for current user
    this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
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
  const lists = [];
  // go through each document
  querySnapshot.forEach((doc) => {
    // get the QueryDocumentSnapshot's data
    var data = doc.data();
    lists.push({
      name: data.name,
      items: data.items.toString(),
    });
  });
  this.setState({
    lists,
  });
};

addList() {
  this.referenceShoppingLists.add({
    name: 'TestList',
    items: ['eggs', 'pasta', 'veggies'],
    uid: this.state.uid,
  });
}

  render() {
    return (
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
    );
  }

  /*
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
      */

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,     
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
  /*
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
  */
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
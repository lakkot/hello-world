/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const backgroundImage = require('../img/Background_Image.png');

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      color: '',
    };
  }

  render() {
    return (
      <ImageBackground source={backgroundImage} style={styles.image}>
        <View style={styles.container}>

          <View style={styles.box}>
            <TextInput
              style={styles.input}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="enter your name here"
            />
            <View style={styles.colors}>
              <Text style={{ color: '#474056', textAlign: 'center', paddingBottom: 10 }}>Choose background color</Text>
              <View style={styles.balls}>
                <TouchableOpacity
                  style={[styles.colorBall, styles.color1]}
                  onPress={() => this.setState({ color: '#757083' })}
                />
                <TouchableOpacity
                  style={[styles.colorBall, styles.color2]}
                  onPress={() => this.setState({ color: '#474056' })}
                />
                <TouchableOpacity
                  style={[styles.colorBall, styles.color3]}
                  onPress={() => this.setState({ color: '#8A95A5' })}
                />
                <TouchableOpacity
                  style={[styles.colorBall, styles.color4]}
                  onPress={() => this.setState({ color: '#B9C6AE' })}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              background="none"
              title="Open Chat"
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
            >
              <Text style={styles.buttonText}>Open Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  box: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    width: '88%',
    height: '44%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '88%',
    borderColor: 'gray',
    borderRadius: 1,
    borderWidth: 1,
    padding: 10,
  },
  colors: {
    borderColor: 'gray',
    height: 70,
    width: '88%',
    padding: 2,
  },
  balls: {
    paddingLeft: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderColor: 'black',
  },
  colorBall: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginTop: 10,
    marginRight: 25,
  },
  color1: {
    backgroundColor: '#757083',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  button: {
    width: '88%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

Home.propTypes = {
  navigation: PropTypes.string.isRequired,
};

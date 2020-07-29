import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const backgroundImage = require('../img/Background_Image.png')

export default class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      color: ''
    }
  }

  render() {
    return (
      <ImageBackground source={backgroundImage} style={styles.image}>
        <View style={styles.container}>
          <View style={styles.box}>
            <TextInput 
              style={styles.input}
              onChangeText={ (name) => this.setState({name}) }
              value={this.state.name}
              placeholder='enter your name here'
            />
            <View style={styles.colors}>
              <Text style={{color: '#474056'}}>Choose background color</Text>
              <View style={styles.balls}>
                <View style={styles.colorBall} backgroundColor={'#757083'}>
                  <Button 
                    title={''}
                    onPress={ () => this.setState({color: '#757083'})}
                  />
                </View>
                <View style={styles.colorBall} backgroundColor={'#474056'}>
                  <Button 
                      title={''}
                      onPress={ () => this.setState({color: '#474056'})}
                    />
                </View>
                <View style={styles.colorBall} backgroundColor={'#8A95A5'}>
                  <Button 
                      title={''}
                      onPress={ () => this.setState({color: '#8A95A5'})}
                    />
                </View>
                <View style={styles.colorBall} backgroundColor={'#B9C6AE'}>
                  <Button 
                      title={''}
                      onPress={ () => this.setState({color: '#B9C6AE'})}
                    />
                </View>
              </View>
            </View>
            <View style={styles.okButton} >
              <Button
                color="#FFFFFF"
                title="Open Chat"
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color})}
              />
            </View>
          </View> 
        </View>
      </ImageBackground>

    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
},
  box: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    width: '88%',
    height: '44%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    height: 50, 
    width: '88%', 
    borderColor: 'gray', 
    borderRadius: 1,
    borderWidth: 1,
    padding: 10
  },
  colors: {
    borderColor: 'gray', 
    height: 70, 
    width: '88%',
    padding: 2,
  },
  balls: {
    flex: 4,
    display: 'flex',  
    flexDirection: 'row',
    width: '100%',
    borderColor: 'black'
  },
  colorBall: {
    width: 40,
    height:40,
    borderRadius: 25,
    marginTop: 10,
    marginRight: 25,
  },
  okButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
    width: '88%',
    marginBottom: 24,
    height: 50,
    width: '88%',
    justifyContent: 'center'
},
})
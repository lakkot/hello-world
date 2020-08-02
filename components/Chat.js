import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { View, Text, StyleSheet, Platform } from 'react-native';

export default class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [

      ]
    }
  }
  //feed messages to state on component mount
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${this.props.route.params.name}! Wellcome to the chat`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }
  //add new messages to state
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

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
            _id: 1,
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
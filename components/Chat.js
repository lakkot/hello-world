import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={ [ styles.container, {backgroundColor: color} ] }>
        <Text>{color}</Text>
        {/* Rest of the UI */}
      </View>
    );
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
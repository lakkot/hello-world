/* eslint-disable react/jsx-filename-extension */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');

export default class CustomActions extends React.Component {
/**
 * requests permission and allows user to pick image, then sends url to uploadImage and onSend
 * @async
 * @function pickImage
 */
  pickImage = async () => {
    try {
    // Requests permission to access user's gallery
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
      // Sets selected image to variable
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch((e) => console.log(e));
        // Sets image to display if user does not cancel upload
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          // eslint-disable-next-line react/destructuring-assignment
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (e) { console.log(e.message); }
  }

    /**
     * taking a photo and setting it to the state, sends results to onSend
     * @async
     * @function takePhoto
     *
     */
    takePhoto = async () => {
      try {
        // Requests permission to access user's gallery
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
          // Sets selected image to variable
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'Images',
          }).catch((e) => console.log(e));
          // Sets image to display if user does not cancel upload
          if (!result.cancelled) {
            const imageUrl = await this.uploadImage(result.uri);
            // eslint-disable-next-line react/destructuring-assignment
            this.props.onSend({ image: imageUrl });
          }
        }
      } catch (e) { console.log(e.message); }
    }

    /**
     * Uploading the image as blob to cloud storage
     * @async
     * @function uploadImage
     * @param {string}
     * @returns {string} imageURL
     */
    uploadImage = async (uri) => {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const getImageName = uri.split('/');
      const imageArrayLength = getImageName.length - 1;
      const ref = firebase.storage().ref().child(getImageName[imageArrayLength]);
      // console.log(ref, getImageName[imageArrayLength]);
      const snapshot = await ref.put(blob);
      blob.close();
      // spitting out image url
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    }

    /**
     * Requests permission for location, then sends location to onSend
     * @async
     * @function getLocation
     * @returns {Promise<number>}
     */
    getLocation = async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === 'granted') {
        const result = await Location.getCurrentPositionAsync({});
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    }

    /**
     * @function onActionPress
     * @returns {actionSheet}
     */
    onActionPress = () => {
      const options = ['Choose From Library', 'Take picture', 'Send location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          // eslint-disable-next-line default-case
          switch (buttonIndex) {
            case 0:
              this.pickImage();
              return;
            case 1:
              this.takePhoto();
              return;
            case 2:
              this.getLocation();
          }
        },
      );
    };

    render() {
      return (
        <TouchableOpacity
          style={[styles.container]}
          onPress={this.onActionPress}
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.propTypes = {
  onSend: PropTypes.func.isRequired,
  wrapperStyle: PropTypes.string.isRequired,
  iconTextStyle: PropTypes.string.isRequired,
};

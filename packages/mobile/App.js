/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, AsyncStorage
} from 'react-native';
import firebase from 'react-native-firebase';
import { background } from 'shared';

export default function App() {
  const [count, setCount] = useState(0);
  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        getToken();
    } else {
        requestPermission();
        createNotificationListeners();
    }
  }
  createNotificationListeners = async () => {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  showAlert = (title, body) => {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  // Similar to componentDidMount:
  useEffect(() => {
    // Update the document title using the browser API
    setCount(count + 1);
    checkPermission();
  }, []);
  return (
    <View style={[background, styles.container]}>
      <Text style={styles.welcome}>
        You clicked
        {count}
        times
      </Text>
      <TouchableOpacity onPress={() => setCount(count + 1)}><Text>Click me</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// Functions used for Firebase Notifications are stored here
import { AsyncStorage, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import axios from 'axios';

export async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        getToken();
        createNotificationListeners();
    } else {
        requestPermission();
        createNotificationListeners();
    }
}

export async function notificationOpenedListener() {
    await firebase.notifications().onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        showAlert(title, body);
    });
}

async function createNotificationListeners() {
    /*
     * Foreground Trigger
     * */
    firebase.notifications().onNotification(function(notification) {
        const { title, body } = notification._data;
        showAlert(title, body);
    });
    /*
     * Background Trigger
     * */
    firebase.notifications().onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification._data;
        showAlert(title, body);
    });
}
async function getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8080/api/registerdevice',
                data: {
                    userName: 'Ganapati',
                    deviceId: fcmToken
                }
            })
                .then(res => console.log(res))
                .catch(err => console.log(err));
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }

    console.log('External FCMTOKEN', fcmToken);
}
export function showAlert(title, body) {
    Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });
}
requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        getToken();
    } catch (error) {
        // User has rejected permissions
        // console.log('permission rejected')
    }
};

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Button, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import loginStyles from './loginStyles';
import { showAlert } from '../notifications/notifications';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // ComponentDidMount, called only once.
    useEffect(() => {
        async function getData() {
            const data = await AsyncStorage.getItem('userName');
            return data;
        }
        (async () => {
            const token = await getData();
            if (token !== null) {
                Actions.chat();
            }
        })();
    }, []);

    handleUserIdChange = name => {
        setUserName(name);
    };
    handlePasswordChange = password => {
        setPassword(password);
    };
    submitClick = () => {
        const inputValidated = () => {
            if (userName.trim() === '') {
                showAlert('Warning!', 'Please enter a valid Username');
                return false;
            }
            if (password.trim() === '') {
                showAlert('Warning!', 'Please enter a valid Password');
                return false;
            }
            return true;
        };
        if (inputValidated() === true) {
            AsyncStorage.setItem('userName', userName);
            Actions.chat();
        }
    };

    return (
        <View style={loginStyles.loginContainer}>
            <TextInput
                placeholder="Username"
                onChangeText={value => {
                    setUserName(value);
                }}
                name="username"
                style={loginStyles.inputText}
            />
            <TextInput
                placeholder="Password"
                onChangeText={value => {
                    setPassword(value);
                }}
                name="password"
                secureTextEntry
                style={loginStyles.inputText}
            />
            <TouchableOpacity style={loginStyles.buttonStyle}>
                <Button type="submit" onPress={submitClick} onKeyPress={submitClick} title="LOGIN" color="#e20074" />
            </TouchableOpacity>
        </View>
    );
}

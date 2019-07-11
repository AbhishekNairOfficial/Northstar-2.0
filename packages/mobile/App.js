/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import Chat from './src/components/chatlanding/chat';
import Camera from './src/components/chatlanding/camara';
import FileSystem from './src/components/chatlanding/files';
import { notificationOpenedListener, checkPermission } from './src/components/notifications/notifications';

export default function App() {
    useEffect(() => {
        checkPermission();
        return function cleanup() {
            notificationOpenedListener();
        };
    });
    return (
        <Router>
            <Scene key="root">
                <Scene key="chat" component={Chat} title="Chat" initial hideBackImage={true}></Scene>
                <Scene key="camera" component={Camera} title="Camera" hideBackImage={true}></Scene>
                <Scene key="files" component={FileSystem} title="FileSystem" hideBackImage={true}></Scene>
            </Scene>
        </Router>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

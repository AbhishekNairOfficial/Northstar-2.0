/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import ChatHeader from './header';
import ChatFooter from './chatfooter';
import ChatBody from './chatbody';
import io from 'socket.io-client';

export default function Chat(props) {
    const { camaraImage } = props;
    const [message, setMessage] = useState('');
    const [data, setData] = useState([
        {
            userId: 'user1',
            message: 'hello'
        },
        { userId: 'user2', message: 'hi, how are you' }
    ]);
    const [socket, setSocket] = useState(io.connect('https://secure-cliffs-60858.herokuapp.com'));

    useEffect(() => {
        socket.emit('user-join');
        socket.on(
            'user-history-chat',
            newData => {
                if (JSON.stringify(data) !== JSON.stringify(newData)) {
                    setData(newData);
                }
            },
            [data]
        );

        socket.on('chat-server', msg => {
            setData([...data, msg]);
        });
    });

    return (
        <View style={styles.container}>
            <ChatHeader socket={socket}></ChatHeader>
            <View style={{ height: '75%' }}>
                <ScrollView>
                    <ChatBody data={data}></ChatBody>
                </ScrollView>
            </View>
            <ChatFooter setTextMessage={message => setMessage({ message })} socket={socket}></ChatFooter>
        </View>
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

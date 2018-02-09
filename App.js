/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from "pusher-chatkit-client/react-native";
//import messages from './messages';

class App extends Component {
  state = {
    messages: [],
    room: '',
  }

  componentDidMount() {
    this.setState(() => {
      return {
        messages: [],
      };
    });

    const tokenProvider = new TokenProvider({
      url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/5a9620bf-4536-4e82-8655-55a9e903d9fe/token?instance_locator=v1:us1:5a9620bf-4536-4e82-8655-55a9e903d9fe",
      userId: "ridhwan"
    });

    const chatManager = new ChatManager({
      instanceLocator: 'v1:us1:5a9620bf-4536-4e82-8655-55a9e903d9fe',
      userId: "ridhwan",
      tokenProvider: tokenProvider
    });

    chatManager.connect({
      delegate: {
        addedToRoom: (room) => {
          console.log(`Added to room ${room.name}`);
        },
      },
      onSuccess: (currentUser) => {
        const roomToSubscribeTo = currentUser.rooms[0];
        this.setState({ room :roomToSubscribeTo, currentUser });

        let arrMsg = [];

        currentUser.subscribeToRoom(
          roomToSubscribeTo,
          {
            newMessage: (message) => {
              arrMsg = { 
                text: message.text, 
                user: {
                  _id: 1,
                  name: message.sender.name,
                },
                _id: Math.round(Math.random() * 1000000),
                createdAt: message.createdAt,
              };

               this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, arrMsg),
              }))              
            }
          }
        );

       
      },
      onError: (error) => {
        console.log("Error on connection");
      }
    });
  }

  onSend(messages = []) {
    // this.setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }))

    this.state.currentUser.sendMessage(
      {
        text: messages[0].text,
        roomId: this.state.room.id,
      },
      (messageId) => {
        console.log("Success!", messageId);
      },
      (error) => {
        console.log("Error", error);
      }
    )
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}

export default App;

import React, { Component, useEffect } from 'react';
import 'react-native-gesture-handler';
import Router from './config/Router';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import {BackHandler, LogBox} from 'react-native';
//import messaging from '@react-native-firebase/messaging';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


class App extends Component {

  componentDidMount() {
    
    // messaging().onMessage(async remoteMessage => {
    //   //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton() {
    return true;
  } 

  render() {
    return ( 
      <SafeAreaProvider> 
        <Router /> 
    </SafeAreaProvider>
    );
  }
}
export default App;

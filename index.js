/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
//import { useNavigation } from '@react-navigation/native';
//import PushNotification from "react-native-push-notification";
//import messaging from '@react-native-firebase/messaging';

import OneSignal from 'react-native-onesignal';



OneSignal.setAppId("5e5b2b14-57b9-4936-8699-1edd30af832b");

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

// //Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
  //const navigation = useNavigation();
  //navigation.navigate("DashboardNavigator", {screen: "listinbox"})
});


// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);

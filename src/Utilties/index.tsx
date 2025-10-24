import { Alert, Linking, PermissionsAndroid, Platform, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import messaging, { firebase } from '@react-native-firebase/messaging'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { SetFCM } from '../Store/actions/auth';
import { AssignGuestFCMTokenHandler } from '../Apis/Auth';
import { useNavigation } from '@react-navigation/native';

type Props = {

};
 
const PushNotificationHandler = () => {
    const { isLogin } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation() as any;
    const requestNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {  // Android 13 (API 33) and above
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Notification Permission',
                        message: 'This app needs access to show notifications',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Notification permission granted');
                } else {
                    console.log('Notification permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };
    PushNotification.createChannel(
        {
            channelId: "high-importance-channel", // Define the channelId (can be any unique string)
            channelName: "High Importance Notifications", // A user-visible name for the channel
            channelDescription: "Channel for important notifications", // Description of the channel
            importance: PushNotification.Importance.HIGH, // Set importance to HIGH to show as pop-ups
            vibrate: true, // Enable vibration

        },
        (created) => console.log(`createChannel returned '${created}'`) // Callback function for debugging
    );

    useEffect(() => {
        requestNotificationPermission()
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            PushNotification.localNotification({
                channelId: "high-importance-channel",
                title: remoteMessage.notification.title,
                message: remoteMessage.notification.body,
                // actions: ["Yes", "No"], // Add actions here
                importance: 'high',
            });
        });
        getFCMToken();
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
            PushNotification.localNotification({
                channelId: "high-importance-channel",
                title: remoteMessage.notification.title,
                message: remoteMessage.notification.body,
                importance: 'high',

            });
        });
        return unsubscribe;
    }, []);
    const dispatch = useDispatch();
    const getFCMToken = async () => {
        try {
            await firebase.messaging().registerDeviceForRemoteMessages();
            const fcmToken = await firebase.messaging().getToken();
            console.log('============fcmToken========================');
            console.log(fcmToken);
            console.log('====================================');
            dispatch(SetFCM(fcmToken));
            // if (!isLogin) {      
            dispatch<any>(AssignGuestFCMTokenHandler({},
                {
                    fcmToken: fcmToken
                }, (res, status) => {
                    if (res.status == 200) {
                        console.log('=============AssignGuestFCMTokenHandler=======================');
                        console.log(res);
                        console.log('====================================');
                    } else {
                        //   toastNotfication({ type: 'error', message: res?.message ?? t("Something Went wrong") });
                    }
                }))
            // }
        } catch (error) {
            console.log('===============errorFCM=====================');
            console.log(error);
            console.log('====================================');
        }

    }


    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token: any) {
            console.log("TOKEN:", token);
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification: any) {
            console.log("NOTIFICATION:", notification);

            switch (notification.data.FirstName as string) {
                case "AdminPoll":
                    navigation.navigate("Polls");
                    break;
                default:
                    navigation.navigate("Home")
                    break;
            }
            // process the notification

            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification: any) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);

            // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err: any) {
            console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
    });


    return <></>
}



export default PushNotificationHandler



import React, { useEffect, useRef } from "react";
import { AppState, PermissionsAndroid, Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging, { firebase } from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/store";
import { SetFCM } from "../Store/actions/auth";
import { AssignGuestFCMTokenHandler } from "../Apis/Auth";
import { navigate, navigationRef } from "../Navigation/NavigationService";

const CHANNEL_ID = "high-importance-channel";

function routeFromMessage(remoteMessage: any) {
  const type =
    remoteMessage?.data?.FirstName ??
    remoteMessage?.data?.type ??
    "";

  //console.log("🧭 routeFromMessage type:", type);

  if (type === "AdminPoll") return { name: "Polls", params: {} };

  return { name: "Market", params: {} };
}

export default function PushNotificationHandler() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: RootState) => state.auth);

  const initializedRef = useRef(false);

  // ✅ NEW: ensure channel ready before usage
  const channelReady = useRef(false);

  const ensureAndroidChannel = () => {
    if (Platform.OS !== "android") return;

    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: "High Importance Notifications",
        channelDescription: "Channel for important notifications",
        importance: PushNotification.Importance.HIGH,
        vibrate: true,
        playSound: true,
      },
      (created) => {
        //console.log("✅ Channel created?", created);
        channelReady.current = true; // ✅ important
      }
    );
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        //console.log("🔐 Android POST_NOTIFICATIONS:", granted);
      }
    } catch (err) {
      // console.warn("Permission error:", err);
    }
  };

  const getFCMToken = async () => {
    try {
      await firebase.messaging().registerDeviceForRemoteMessages();
      const fcmToken = await firebase.messaging().getToken();

      //console.log("🪙 FCM TOKEN:", fcmToken);

      if (!fcmToken) return;

      dispatch(SetFCM(fcmToken));

      dispatch<any>(
        AssignGuestFCMTokenHandler({}, { fcmToken }, (res: any) => {
          //console.log("📡 AssignGuestFCMTokenHandler status:", res?.status);
        })
      );
    } catch (error) {
      //console.log("❌ FCM token error:", error);
    }
  };

  const showLocalNotification = (remoteMessage: any) => {
    // ✅ prevent crash if channel not ready
    if (Platform.OS === "android" && !channelReady.current) {
      //console.log("⛔ Channel not ready yet, skip notification");
      return;
    }

    const title =
      remoteMessage?.notification?.title ??
      remoteMessage?.data?.title ??
      "Notification";

    const message =
      remoteMessage?.notification?.body ??
      remoteMessage?.data?.body ??
      "";

    //console.log("🔔 showLocalNotification:", { title, message });

    PushNotification.localNotification({
      channelId: CHANNEL_ID,
      title,
      message,
      importance: "high",
      data: remoteMessage?.data ?? {},
      userInfo: remoteMessage?.data ?? {},
    });
  };

  const safeNavigateFromMessage = (remoteMessage: any) => {
    const r = routeFromMessage(remoteMessage);

    //console.log("➡️ Navigating to:", r);

    if (!navigationRef.isReady()) {
      //console.log("⏳ Navigation not ready, delaying...");

      // ✅ safer timeout
      setTimeout(() => {
        if (navigationRef.isReady()) {
          navigate(r.name, r.params);
        }
      }, 400);

      return;
    }

    navigate(r.name, r.params);
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    //console.log("🚀 PushNotificationHandler mounted");

    ensureAndroidChannel();
    requestNotificationPermission();
    getFCMToken();

    const appStateSub = AppState.addEventListener("change", (state) => {
      //console.log("📊 AppState:", state);
    });

    // ✅ FIX: prevent duplicate / crash
    const unsubOnMessage = messaging().onMessage(async (remoteMessage) => {
      //console.log("📱 FOREGROUND MESSAGE RECEIVED");

      //console.log("DATA:", remoteMessage?.data);
      //console.log("NOTIFICATION:", remoteMessage?.notification);

      // if (remoteMessage?.notification) {
      //   console.log("⚠️ System handles it → skip local");
      //   return;
      // }

      try {        
        showLocalNotification(remoteMessage);
      } catch (e) {
        // console.log("❌ showLocalNotification error:", e);
      }
    });

    const unsubOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log("👆 OPENED FROM BACKGROUND");

      if (remoteMessage) {
        safeNavigateFromMessage(remoteMessage);
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) return;

        // console.log("🚀 OPENED FROM QUIT");
        safeNavigateFromMessage(remoteMessage);
      });

    // ⚠️ keep but note: better to move to App.tsx
    PushNotification.configure({
      onRegister: function (token: any) {
        //console.log("✅ onRegister token:", token);
      },

      onNotification: function (notification: any) {
        //console.log("🔔 LOCAL NOTIFICATION RECEIVED / TAPPED");

        const data = notification?.data ?? notification?.userInfo ?? {};

        safeNavigateFromMessage({ data });

        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      onRegistrationError: function (err: any) {
        // console.error("❌ Registration error:", err?.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === "ios",
    });

    return () => {
      unsubOnMessage();
      unsubOpened();
      appStateSub.remove();
    };
  }, []);

  return null;
}
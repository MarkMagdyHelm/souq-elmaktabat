// ✅ PushNotificationHandler.tsx (FULL WORKING + LOGS + SAFE NAVIGATION)
// Put this file in: src/Utilties/PushNotificationHandler.tsx (or your path)

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
  const type = remoteMessage?.data?.FirstName ?? remoteMessage?.data?.type ?? "";

  console.log("🧭 routeFromMessage type:", type);

  if (type === "AdminPoll") return { name: "Polls", params: {} };

  // ✅ IMPORTANT: "Home2" does NOT exist in your Stack, so use "Market" or "Demo"
  return { name: "Market", params: {} };
}

export default function PushNotificationHandler() {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: RootState) => state.auth);

  // prevent double-init in dev (Fast Refresh)
  const initializedRef = useRef(false);

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
        // soundName: "default",
      },
      (created) => console.log("✅ createChannel created?", created) // false => already exists
    );
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log("🔐 Android POST_NOTIFICATIONS:", granted);
      }
    } catch (err) {
      console.warn("Permission error:", err);
    }
  };

  const getFCMToken = async () => {
    try {
      await firebase.messaging().registerDeviceForRemoteMessages();
      const fcmToken = await firebase.messaging().getToken();

      console.log("🪙 FCM TOKEN:", fcmToken);

      if (!fcmToken) return;

      dispatch(SetFCM(fcmToken));

      // If you want only guest token assignment:
      // if (!isLogin) { ... }
      dispatch<any>(
        AssignGuestFCMTokenHandler({}, { fcmToken }, (res: any) => {
          console.log("📡 AssignGuestFCMTokenHandler status:", res?.status);
        })
      );
    } catch (error) {
      console.log("❌ FCM token error:", error);
    }
  };

  const showLocalNotification = (remoteMessage: any) => {
    const title =
      remoteMessage?.notification?.title ??
      remoteMessage?.data?.title ??
      "Notification";

    const message =
      remoteMessage?.notification?.body ??
      remoteMessage?.data?.body ??
      "";

    console.log("🔔 showLocalNotification:", { title, message });
    console.log("🔔 Local data:", remoteMessage?.data);

    PushNotification.localNotification({
      channelId: CHANNEL_ID,
      title,
      message,
      importance: "high",
      data: remoteMessage?.data ?? {},
      userInfo: remoteMessage?.data ?? {}, // iOS uses userInfo
      // playSound: true,
      // soundName: "default",
    });
  };

  const safeNavigateFromMessage = (remoteMessage: any) => {
    const r = routeFromMessage(remoteMessage);

    console.log("➡️ Navigating to:", r);

    if (!navigationRef.isReady()) {
      console.log("⏳ Navigation not ready, delaying...");
      setTimeout(() => navigate(r.name, r.params), 400);
      return;
    }
    navigate(r.name, r.params);
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log("🚀 PushNotificationHandler mounted");

    ensureAndroidChannel();
    requestNotificationPermission();
    getFCMToken();

    // AppState logs (helpful)
    const appStateSub = AppState.addEventListener("change", (state) => {
      console.log("📊 AppState:", state);
    });

    // ✅ FOREGROUND
    const unsubOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log("📱 FOREGROUND MESSAGE RECEIVED");
      console.log("DATA:", remoteMessage?.data);
      console.log("NOTIFICATION:", remoteMessage?.notification);

      showLocalNotification(remoteMessage);
    });

    // ✅ OPENED FROM BACKGROUND (tap)
    const unsubOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("👆 OPENED FROM BACKGROUND (TAP)");
      console.log("DATA:", remoteMessage?.data);
      console.log("NOTIFICATION:", remoteMessage?.notification);

      if (remoteMessage) safeNavigateFromMessage(remoteMessage);
    });

    // ✅ OPENED FROM QUIT (cold start tap)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) return;

        console.log("🚀 OPENED FROM QUIT (COLD START)");
        console.log("DATA:", remoteMessage?.data);
        console.log("NOTIFICATION:", remoteMessage?.notification);

        safeNavigateFromMessage(remoteMessage);
      });

    // ✅ Local notification tap (react-native-push-notification)
    PushNotification.configure({
      onRegister: function (token: any) {
        console.log("✅ PushNotification onRegister token:", token);
      },

      onNotification: function (notification: any) {
        console.log("🔔 LOCAL NOTIFICATION TAPPED / RECEIVED");
        console.log("notification:", notification);

        const data = notification?.data ?? notification?.userInfo ?? {};
        console.log("🔔 Local tap data:", data);

        safeNavigateFromMessage({ data });

        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      onAction: function (notification: any) {
        console.log("🟦 ACTION:", notification.action);
        console.log("🟦 NOTIFICATION:", notification);
      },

      onRegistrationError: function (err: any) {
        console.error("❌ Registration error:", err?.message, err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
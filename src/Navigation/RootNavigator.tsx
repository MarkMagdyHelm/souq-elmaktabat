import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { navigate, navigationRef } from "../Navigation/NavigationService";

function routeFromMessage(remoteMessage: any) {
  const type = remoteMessage?.data?.FirstName ?? remoteMessage?.data?.type;

  if (type === "AdminPoll") return { name: "Polls", params: {} };
  return { name: "Market", params: {} };
}
useEffect(() => {
  // When app is opened from background by tapping notification
  const unsubOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
    if (!remoteMessage) return;
    const r = routeFromMessage(remoteMessage);
    navigate(r.name, r.params);
  });

  // When app is opened from quit state by tapping notification
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (!remoteMessage) return;
      const r = routeFromMessage(remoteMessage);
      // small delay helps ensure nav is ready
      setTimeout(() => navigate(r.name, r.params), 300);
    });

  return () => unsubOpened();
}, []);
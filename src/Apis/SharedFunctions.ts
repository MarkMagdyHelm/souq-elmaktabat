import { useCallback, useRef } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const useDoubleBackExit = () => {
  const backPressCount = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount.current === 1) {
          BackHandler.exitApp();
          return true; 
        }

        backPressCount.current += 1;

        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; 
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );
};

export default useDoubleBackExit;
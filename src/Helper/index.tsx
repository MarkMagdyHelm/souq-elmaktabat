// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Easing, Platform } from 'react-native';
import i18n from '../Local/i18n.config';
export enum AsyncKeys {
  IS_LOGIN = 'IS_LOGIN',
  USER_DATA = 'USER_DATA',
  LANGUAGE = 'LANGUAGE',
}

export class PersistConfig {
  key: string;
  storage: AsyncStorage;
  whitelist?: any;
  constructor(key: string, ...whitelist: any) {
    this.key = key;
    this.storage = AsyncStorage;
    this.whitelist = whitelist;
  }
}
export const saveItem = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.log('saveItem', error.message);
    }
    return false;
  };
  
  export const getItem = async (key: string) => {
    try {
      const retrievedItem: any = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log('getItem', error.message);
    }
    return null;
  };

  export const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.log('removeItem', error.message);
    }
    return false;
  };

  const AnimationSpec = {
    animation: 'timing',
    config: {
      duration: 500,
      easing: Easing.ease,
    },
  };
export const SpotifyTransition = {
    transitionSpec: {
      open: AnimationSpec, //TransitionSpecs.TransitionIOSSpec,
      close: AnimationSpec, //TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: ({current, next}) => {
      return {
        cardStyle: {
          transform: [
            {
              rotateY: next
                ? next.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  })
                : current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '0deg'],
                  }),
            },
          ],
        },
      };
    },
  };
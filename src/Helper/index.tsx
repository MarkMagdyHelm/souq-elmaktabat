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
    } catch (error:any) {
      console.log('saveItem', error.message);
    }
    return false;
  };
  
  export const getItem = async (key: string) => {
    try {
      const retrievedItem: any = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error:any) {
      console.log('getItem', error.message);
    }
    return null;
  };

  export const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error:any) {
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
    cardStyleInterpolator: ({current, next}:any) => {
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
  

  export const roles = [
    { id: 1, arName: "استخدام شخصي", name: "Customer" },
    { id: 2, arName: "تاجر", name: "Merchant" },
    { id: 3, arName: "صاحب مكتبة", name: "Bookstore Owner" },
    { id: 4, arName: "صاحب مطبعة", name: "Printing Owner" },
    { id: 5, arName: "مكتب", name: "Office" },
    { id: 6, arName: "مدرسة", name: "School" },
    { id: 7, arName: "شركة توريدات", name: "Supply Company" },
    // { id: 8, arName: "مستورد", name: "Importer" },
    // { id: 9, arName: "اخرى", name: "Importer" }

  ];
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Easing, Linking, Platform } from 'react-native';
import i18n from '../Local/i18n.config';
export enum AsyncKeys {
  IS_LOGIN = 'IS_LOGIN',
  USER_DATA = 'USER_DATA',
  LANGUAGE = 'LANGUAGE',
}
export const CallNumber = async (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert("🚫 خطأ", "الاتصال غير مدعوم على هذا الجهاز");
  }
};

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


export const GetNamesByLang = (item: any, dir: any) => {
  if (!item) return "";
  return dir === "rtl" ? item.arName : item.name;
}

export const saveItem = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error: any) {
    console.log('saveItem', error.message);
  }
  return false;
};

export const getItem = async (key: string) => {
  try {
    const retrievedItem: any = await AsyncStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
  } catch (error: any) {
    console.log('getItem', error.message);
  }
  return null;
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error: any) {
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
export const timeAgo =  (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals: Record<string, number> = {
    "سنة": 31536000,
    "شهر": 2592000,
    "يوم": 86400,
    "ساعة": 3600,
    "دقيقة": 60,
    "ثانية": 1,
  };

  for (let unit in intervals) {
    const value = Math.floor(seconds / intervals[unit]);
    if (value >= 1) return `منذ ${value} ${unit}`;
  }

  return "الآن";
}



export const SpotifyTransition = {
  transitionSpec: {
    open: AnimationSpec, //TransitionSpecs.TransitionIOSSpec,
    close: AnimationSpec, //TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({ current, next }: any) => {
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
  { id: 1, arName: "مورد", name: "Customer" },
  { id: 2, arName: "مستهلك", name: "Merchant" },
  // { id: 3, arName: "صاحب مكتبة", name: "Bookstore Owner" },
  // { id: 4, arName: "صاحب مطبعة", name: "Printing Owner" },
  // { id: 5, arName: "مكتب", name: "Office" },
  // { id: 6, arName: "مدرسة", name: "School" },
  // { id: 7, arName: "شركة توريدات", name: "Supply Company" },
  // // { id: 8, arName: "مستورد", name: "Importer" },
  // // { id: 9, arName: "اخرى", name: "Importer" }
];

export const amounts = [
  { id: 1, arName: "1", name: "1", isSelected: true },
  { id: 2, arName: "20", name: "20", isSelected: false },
  { id: 3, arName: "50", name: "50", isSelected: false },
  { id: 4, arName: "100", name: "100", isSelected: false },
  { id: 5, arName: "200", name: "200", isSelected: false },
  { id: 6, arName: "500", name: "500", isSelected: false },
  { id: 7, arName: "أخرى", name: "Others", isSelected: false },
];
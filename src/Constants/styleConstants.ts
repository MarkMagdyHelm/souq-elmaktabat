import { Dimensions, NativeModules, Platform, StatusBar } from 'react-native';
const { width, height } = Dimensions.get('screen');
export const phoneHeight = Dimensions.get('screen').height;
export const phoneWidth = Dimensions.get('screen').width;
export enum Colors {
  mainColor = '#FF7631',
  secondColor = '#00D787',
  light = '#F6F6F6',
  dark = '#383535',
  darkLighter = '#68655F',
  white = '#ffffff',
  success = '#1AA361',

  facebook = '#1877F2',
  googleLogin = '#F2F6F8',

  gray = '#979797',
  appBackgroundColor = '#fff',
  sacandAppBackgroundColor = '#F4F6F9',
  grayDark = '#515355',
  boxColor = '#E0E6EF',
  warning = '#FF5656',

  google = '#ea4335',
  twitter = '#1da1f2',
  linkedin = '#0077b5',
  youtube = '#ff0000',
  snapchat = '#fffc00',
  instagram = '#405de6',
  whatsapp = '#128c7e',

  textTitle = '#222222',
  medGary = '#9E9E9E',
  grayTabBar = '#707F89',
  bodyBackground = '#FEFEFE', // this color is light dark white in the body of screen under headers
}

export enum FontsRtl {
  extraLight = 'ArbFONTS-The-Sans-Plain-alinma',
  light = 'ArbFONTS-TheSans-Bold-alinma',
  regular = 'FrutigerLTArabic45Light',
  medium = 'FrutigerLTArabic55Roman',
  bold = 'FrutigerLTArabic65Bold',
  semiBold = 'frutigerltarabic75black',
  // extraBold = 'Tajawal-ExtraBold',
  // black = 'Tajawal-black',
}
export enum FontsLtr {
  extraLight = 'ArbFONTS-The-Sans-Plain-alinma',
  light = 'ArbFONTS-TheSans-Bold-alinma',
  regular = 'FrutigerLTArabic45Light',
  medium = 'FrutigerLTArabic55Roman',
  bold = 'FrutigerLTArabic65Bold',
  semiBold = 'frutigerltarabic75black',
}
export enum FontsLtrIOS {
  extraLight = 'TheSans Plain',
  light = 'TheSans Bold',
  regular = 'Frutiger LT Arabic 45 Light',
  medium = 'Frutiger LT Arabic 55 Roman',
  bold = 'Frutiger LT Arabic 65 Bold',
  semiBold = 'Frutiger LT Arabic 75 Black',
}

export enum Images {
  // headerLogo = require('../assets/images/headerLogo.png'),
  // vat = require('../assets/images/vat.png'),
  // maroof = require('../assets/images/maroof.png'),
  // defaultImage = require('../assets/images/default.png'),
}

export enum ScreenOptions {
  StatusBarHeight = NativeModules.StatusBarManager.HEIGHT,
  HalfScreen = width / 2 - 15,
  CURRENT_RESOLUTION = Math.sqrt(height * height + width * width),
  DesignResolution = {
    width: 375,
    height: 812,
  } as any,
}

export const createPerfectPixel = (designSize = { width: 375, height: 812 }) => {
  if (
    !designSize ||
    !designSize.width ||
    !designSize.height ||
    typeof designSize.width !== 'number' ||
    typeof designSize.height !== 'number'
  ) {
    throw new Error(
      'react-native-pixel-perfect | create function | Invalid design size object! must have width and height fields of type Number.',
    );
  }
  const DESIGN_RESOLUTION = Math.sqrt(
    designSize.height * designSize.height + designSize.width * designSize.width,
  );
  const RESOLUTIONS_PROPORTION =
    ScreenOptions.CURRENT_RESOLUTION / DESIGN_RESOLUTION;
  return (size: number) => RESOLUTIONS_PROPORTION * size;
};

export const PixelPerfect = (pixel: number) => {
  const Perfect = createPerfectPixel(ScreenOptions.DesignResolution as any);
  return Perfect(pixel);
};
export const ColorWithOpacity = (
  hex: Colors | string,
  opacity: number,
): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let color;
  if (result) {
    color = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  } else {
    return hex;
  }
  return `rgba(${color.r},${color.g},${color.b},${opacity})`;
};
export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

export function ifIphoneX(iphoneXStyle:any, regularStyle:any) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe:any) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
    default: 0,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

export function checkIndexIsEven(n:any) {
  return n % 2 === 0;
}

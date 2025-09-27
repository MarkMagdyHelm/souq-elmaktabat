import { StyleProp, ViewStyle } from 'react-native';
import { ActionType } from '../Store/actions/actions';

export interface TouchableProps {
  dark?: boolean;
  disable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface IReduser {
  type: ActionType;
  payload?: any;
  redeemCode?: string;
}
export interface IDispatch extends IReduser { }

export interface NavigationProps {
  goBack?: () => void;
  openDrawer?: () => void;
  closeDrawer?: () => void;
  navigate?: any;
  replace?: any;
  reset?: any;
  params?: any;
  name?: string;
}

export interface ScreenProps {
  navigation?: NavigationProps;
  route?: NavigationProps;
}

export interface IModals {
  visible: boolean;
  onPress?: (arg?: any) => void;
}

export interface IFont {
  extraLight: string;
  light: string;
  regular: string;
  medium: string;
  bold: string;
  // semiBold: string;
  extraBold: string;
  black: string;
}

export interface ITheme {
  border: string;
  sectionIcon: string;
  grayL_grayD: string;
  popUpText: string;
  gray_blue2: string;
  pagesText: string;
  green_blue: string;
  cyrcle: string;
  tabText: string;
  thirdButton: string;
  secondButton: string;
  separator: string;
  lightSeparator: string;
  appBackgroundColor: string;
  appFullBackgroundColor: string;
  headerBackgroundColor: string;
  inputBackground: string;
  inputTextColor: string;

  mainColor: string;
  secondColor: string;
  light: string;
  dark: string;
  darkLighter: string;
  white: string;
  success: string;
  babyBlue: string;
  green: string;

  facebook: string;
  googleLogin: string;

  gray: string;
  sacandAppBackgroundColor: string;
  grayDark: string;
  boxColor: string;
  warning: string;

  google: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  snapchat: string;
  instagram: string;
  whatsapp: string;

  textTitle: string;
  medGary: string;
  grayTabBar: string;
  bodyBackground: string;
  tabBarBackground: string;

  button: string;
  blue_gray: string;
  red_yellow: string;
  disableBtn: string;
  inputBorder: string;
  black_white: string;
  gray_white: string;
  white_gray: string;
  gray_black: string;
  gray_blue: string;
  cartCyrcle: string;
  alertBackground: string;
  cartItemTitleColor: string;
  labelText: string;
  phonecodeDropdowe: string
  orText: string,
  signuoText: string,
  social: string,
  appointment: string,
  active: string,
  deactive: string,
  textColor: string,
  black: string,
  currenctText: string,
  timeText: string,
  optionText: string,
  sepreator: string,
  grayLigth: string
  gray2: string
}
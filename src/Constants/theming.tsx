import React, { createContext, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeAppDirection, ChangeDarkMode } from '../Store/actions/settings';
import { RootState } from '../Store/store';
import { Colors, ColorWithOpacity, FontsLtr, FontsLtrIOS, FontsRtl } from './styleConstants';
const themes  = {
  dark: {
    appBackgroundColor: '#FFFFFF',
    appFullBackgroundColor: '#FFFFFF',
    headerBackgroundColor: '#ED6A1D',
    inputBackground: '#464646',
    inputTextColor: Colors.medGary,
    cartNumBack: '#333333',

    mainColor: '#FFFFFF',
    secondColor: '#F6F6F6',
    light: '#F6F6F6',
    dark: '#383535',
    darkLighter: '#68655F',
    white: '#ffffff',
    success: '#1AA361',

    facebook: '#1877F2',
    googleLogin: '#707070',

    gray: '#979797',
    sacandAppBackgroundColor: '#F4F6F9',
    grayDark: '#515355',
    boxColor: '#E0E6EF',
    warning: '#FF5656',

    google: '#ea4335',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    snapchat: '#fffc00',
    instagram: '#405de6',
    whatsapp: '#128c7e',

    textTitle: Colors.medGary,
    medGary: Colors.medGary,
    grayTabBar: '#9B9B9B',
    bodyBackground: '#FF7631',

    button: '#00D787',
    secondButton: '#636161',
    thirdButton: '#636161',
    blue_gray: Colors.medGary,
    red_yellow: '#F8E71C',
    disableBtn: '#00D787',
    inputBorder: '#565656',
    black_white: '#333333',
    gray_white: '#585858',
    white_gray: '#FFFFFF',
    gray_black: '#D9D9D9',
    gray_blue: '#D9D9D9',
    cartCyrcle: '#404040',
    alertBackground: '#464646',
    border: '#636363',
    cartItemTitleColor: Colors.medGary,
    separator: ColorWithOpacity('#FFFFFF', 0.1),
    lightSeparator: ColorWithOpacity('#FFFFFF', 0.06),
    blue_gray2: '#464646',
    tabText: '#FFFFFF',
    inActiveTabText: Colors.medGary,
    gray_blue2: Colors.medGary,
    gray_gray: Colors.medGary,
    cyrcle: '#464646',
    green_blue: '#00D787',
    sectionIcon: Colors.medGary,
    pagesText: '#C2C2C2',
    accordianBack: '#5A5A5A',
    accordianBody: '#505050',
    gray_gray2: Colors.medGary,
    catgBack: '#474747',
    popUpText: Colors.white,
    tabBarBackground: '#3B3B3B',
    grayL_grayD: '#9B9B9B',
    labelText: "#030303",
    phonecodeDropdowe: "#E5E5E5",
    CountryText: "#FFFFFF"
  },
  light: {
    grayL_grayD: '#889BA7',
    cartNumBack: Colors.mainColor,
    tabBarBackground: Colors.white,
    popUpText: Colors.medGary,
    catgBack: '#F2F6F8',
    accordianBody: '#FAFAFA',
    sectionIcon: '#A4B5C5',
    green_blue: Colors.mainColor,
    cyrcle: '#B8CDD9',
    gray_gray: '#707F89',
    tabText: Colors.mainColor,
    inActiveTabText: '#97AFC3',
    secondButton: Colors.mainColor,
    thirdButton: Colors.mainColor,
    button: Colors.mainColor,
    blue_gray: Colors.mainColor,
    blue_gray2: Colors.mainColor,
    red_yellow: '#D0021B',
    disableBtn: '#CBD7DE',
    inputBorder: '#E9E9E9',
    black_white: '#F1F1F1',
    gray_white: '#FFFFFF',
    white_gray: '#707B82',
    gray_gray2: '#707B82',
    gray_black: '#222222',
    gray_blue: Colors.mainColor,
    gray_blue2: Colors.mainColor,
    cartCyrcle: '#F1F1F1',
    alertBackground: '#FFFFFF',
    border: '#E6E4E7',
    cartItemTitleColor: '#222222',
    separator: ColorWithOpacity('#000000', 0.1),
    lightSeparator: ColorWithOpacity('#000000', 0.06),
    pagesText: '#707F89',
    accordianBack: '#F1F1F1',
    appBackgroundColor: '#FFFFFF',
    appFullBackgroundColor: '#FFFFFF',
    headerBackgroundColor: '#ED6A1D',
    inputBackground: '#F1F1F1',
    inputTextColor: Colors.medGary,

    mainColor: Colors.mainColor,
    secondColor: '#F6F6F6',
    light: '#F6F6F6',
    dark: '#383535',
    darkLighter: '#68655F',
    white: '#ffffff',
    success: '#1AA361',

    facebook: '#1877F2',
    googleLogin: '#F2F6F8',

    gray: '#979797',
    sacandAppBackgroundColor: '#F4F6F9',
    grayDark: '#515355',
    boxColor: '#E0E6EF',
    warning: '#FF5656',

    google: '#ea4335',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    snapchat: '#fffc00',
    instagram: '#405de6',
    whatsapp: '#128c7e',

    textTitle: '#82799D',
    medGary: Colors.medGary,
    grayTabBar: '#707F89',
    bodyBackground: '#FFFFFF',
    labelText: "#030303",
    phonecodeDropdowe: "#E5E5E5",
    orText: "#030303",
   signuoText: "#432C81",
 social:"#FCFCFC",
 appointment:"#D20000",
 active:Colors.secondColor,
 deactive:"#888888",
 textColor:"#3D4A78",
 black:"#000000",
 currenctText:"#FEBA32",
 timeText:"#A3A3A3",
 optionText:"#EDEEF0",
 sepreator:"#EDEBEB",
 grayLigth:"#F2F2F7"
  },
}as any;
const LayoutDirectionRtl = StyleSheet.create({
  rowBox: {
    flexDirection: 'row-reverse',
  },
  flexEnd: {
    alignItems: 'flex-start',
  },
  flexStart: {
    alignItems: 'flex-end',
  },
  textAlign: {
    textAlign: 'right',
  },
  dirRow: {
    flexDirection: 'row',
  },
  center:{
    alignItems:"center",
    justifyContent:"center"
  }
});
const LayoutDirectionLtr = StyleSheet.create({
  rowBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  flexStart: {
    alignItems: 'flex-start',
  },
  textAlign: {
    textAlign: 'left',
  },
  dirRow: {
    flexDirection: 'row-reverse',
  },
});

const initialState = {
  dark: false,
  theme: themes.light,
  layout: LayoutDirectionRtl,
  Fonts: FontsRtl,
  dir: 'ltl',
  toggle: () => { },
  toggleDir: (dir: any) => { },
};
const ThemeContext = createContext(initialState);

const ThemeProvider = ({ children }:any) => {
  const dispatch = useDispatch<any>();
  const { darkmode, direction } = useSelector(
    (state: RootState) => state.settings,
  );

  const [dark, setDark] = useState<boolean>(darkmode);
  const [dir, setDir] = useState<string>(direction);

  // To toggle between dark and light modes
  const toggle = () => {
    setDark(!dark);
    dispatch(ChangeDarkMode(!dark));
   
  };
  const toggleDir = (dir: React.SetStateAction<string>) => {
    setDir(dir);
    dispatch(ChangeAppDirection(dir as string));
  };

  // Filter the styles based on the theme selected
  const theme = dark ? themes.dark : themes.light;
  const layout = dir === 'rtl' ? LayoutDirectionRtl : LayoutDirectionLtr  as any;
  const Fonts = Platform.OS === "ios"? FontsLtrIOS :FontsLtr as any;

  return (
    <ThemeContext.Provider
      value={{
        dark,
        theme,
        toggle,
        dir,
        toggleDir,
        layout,
        Fonts,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  I18nManager,
  LogBox,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { ToastProvider } from 'react-native-toast-notifications';
 import 'react-native-gesture-handler'
import RNBootSplash from "react-native-bootsplash";
import AppInitializer from './src/index'
import { ThemeContext } from './src/Constants/theming';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from './src/Store/store';
import './src/Local/i18n.config';
type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  const { theme, dark, Fonts, toggleDir } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { langauge } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    i18next.changeLanguage(langauge);
  }, [langauge]);

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      LogBox.ignoreLogs(['Warning: ...']);
      LogBox.ignoreAllLogs();
    }
  }, []);

  return (
    <>
      {/* <OfflineNotice /> */}
      <ToastProvider
        offsetTop={30}
      >
        <AppInitializer />
      </ToastProvider>
      </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

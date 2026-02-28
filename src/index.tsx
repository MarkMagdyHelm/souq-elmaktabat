import { I18nManager, LogBox, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import i18n from 'i18next';
import { useSelector } from 'react-redux';
import { RootState } from './Store/store';
import DeviceInfo from 'react-native-device-info';
import Navigation from './Navigation/Navigation';
import PushNotificationHandler from './Utilties';

type Props = {}

const index = (props: Props) => {
  // const { langauge } = useSelector((state: RootState) => state.settings);
 
  useEffect(() => {
    // i18n.changeLanguage(langauge);
  
  }, []);

  useEffect(() => {
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      LogBox.ignoreLogs(['Warning: ...']);
      LogBox.ignoreAllLogs();
    }
  }, []);
  return (
    <Navigation/>
  )
}

export default index

const styles = StyleSheet.create({});
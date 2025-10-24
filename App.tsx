/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  I18nManager,
  LogBox,
  Platform,
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './src/Store/store';
import './src/Local/i18n.config';
import { GetSettingsHandler } from './src/Apis/Appinfo';
import ForceUpdate from './src/Components/PopUps/ForceUpdate';
import DeviceInfo from 'react-native-device-info';
import Error from './src/Components/Notifications/Error';
import Success from './src/Components/Notifications/Success';
import PushNotificationHandler from './src/Utilties';
import Orientation from 'react-native-orientation-locker';

type SectionProps = PropsWithChildren<{
  title: string;
}>;



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  const { theme, dark, Fonts, toggleDir } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { langauge } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    console.log('====================================');
    console.log("splash 1");
    console.log('====================================');
      RNBootSplash.hide({ fade: true });
    setTimeout(() => {
       console.log('====================================');
    console.log("splash 2");
    console.log('====================================');
      RNBootSplash.hide({ fade: true });
    }, 100);
    i18next.changeLanguage(langauge);
    getSettings()
  }, [langauge]);
   const dispatch = useDispatch();
   const [state, setstate] = useState({
      forceUpdate:false,
      isForceUpdateOptional:true
   });
   const getSettings = ()=>{
    dispatch<any>(GetSettingsHandler({lookupIds:[1]},"settings",(res,status)=>{
      if (Platform.OS === "android") {
        let androidSetting = res?.find((el:any)=>el.type == "Android");
        console.log('====androidSetting================================');
        console.log(res);
        console.log('====================================');
        if (androidSetting.status == 1 && parseFloat(DeviceInfo.getVersion()) < parseFloat(androidSetting.targetVersion)) {
          setstate(old=>({...old,isForceUpdateOptional:false,forceUpdate:true}))
        }else if(androidSetting.status == 0 && parseFloat(DeviceInfo.getVersion()) < parseFloat(androidSetting.targetVersion)){
          setstate(old=>({...old,isForceUpdateOptional:true,forceUpdate:true}))
        }else{
          setstate(old=>({...old,isForceUpdateOptional:false,forceUpdate:false}))
        }
      } else {
        let iosSetting = res?.find((el:any)=>el.type == "IOS");
          console.log('====iosSetting================================');
        console.log(iosSetting.status);
        console.log('====================================');
        if (iosSetting.status == 1 && parseFloat(DeviceInfo.getVersion()) < parseFloat(iosSetting.targetVersion)) {
          setstate(old=>({...old,isForceUpdateOptional:false,forceUpdate:true}))
        }else if(iosSetting.status == 0 && parseFloat(DeviceInfo.getVersion()) < parseFloat(iosSetting.targetVersion)){
          setstate(old=>({...old,isForceUpdateOptional:true,forceUpdate:true}))
        }else{
          setstate(old=>({...old,isForceUpdateOptional:false,forceUpdate:false}))
        }
    
      }
    }))
   }
  
  useEffect(() => {
    console.log('==========I18nManager.isRTL==========================');
    console.log(I18nManager.isRTL);
    console.log('====================================');
    Orientation.lockToPortrait();
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }else{
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <>
      {/* <OfflineNotice /> */}
      <ToastProvider
    offsetTop={50}
    renderType={{
      error: (toast) => (
        <Error toast={toast} />
      ),
      ok: (toast) => (
         <Success toast={toast} />
      ),
    }}
  >
        <AppInitializer />
        <ForceUpdate show={state.forceUpdate} isForceUpdateOptional={state.isForceUpdateOptional}
         onCloseFn={()=> setstate(old=>({...old,isForceUpdateOptional:false,forceUpdate:false}))}
        />
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

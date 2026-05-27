import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'

const thunkMiddleware = require('redux-thunk').default;
import { persistStore, persistReducer } from 'redux-persist';
import auth from './reducers/auth';
import settings from './reducers/settings';

import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotronEnhancer =
  __DEV__ ? require('../ReactotronConfig').default?.createEnhancer?.() : undefined;

const authConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['gusterID', 'userdata', 'isLogin', 'fcm', 'isSeller', 'isAdmin'],
};

const settingsConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: ['darkmode', 'langauge', 'direction','forceUpdate','appSettings'],
};



const rootReducer = combineReducers({
  settings: persistReducer(settingsConfig, settings as any),
  auth: persistReducer(authConfig, auth as any),
  
});

export const store = configureStore({
  reducer:{
    settings: persistReducer(settingsConfig, settings as any),
    auth: persistReducer(authConfig, auth as any),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  enhancers: getDefaultEnhancers =>
    reactotronEnhancer
      ? getDefaultEnhancers().concat(reactotronEnhancer)
      : getDefaultEnhancers(),
})
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

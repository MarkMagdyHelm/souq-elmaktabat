import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'

const thunkMiddleware = require('redux-thunk').default;
import { persistStore, persistReducer } from 'redux-persist';
import auth from './reducers/auth';
import settings from './reducers/settings';

import AsyncStorage from '@react-native-async-storage/async-storage';

const authConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['gusterID','userdata','isLogin','fcm'],
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
  // Automatically calls `combineReducers`
  reducer:{
    settings: persistReducer(settingsConfig, settings as any),
    auth: persistReducer(authConfig, auth as any),
    
  },
  middleware:getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

import axios from 'axios';

import { NativeModules, Platform } from 'react-native';
import { AsyncKeys, getItem } from '../Helper';
import DeviceInfo from 'react-native-device-info'
// Staging
export const mainUrl = 'http://markmagdy-001-site3.ktempurl.com/';
export const imageUrl = 'http://markmagdy-001-site2.ctempurl.com/images/';


// Production
// export const mainUrl = 'http://markmagdy-001-site1.ctempurl.com/';
// export const imageUrl = 'http://markmagdy-001-site2.ctempurl.com/images/';

export const channel = Platform.OS == "android" ? "Android" : "IOS";
export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

export const globalAPI = axios.create({
  headers: headers,
  baseURL: mainUrl,
});
let cancelToken: any;
globalAPI.interceptors.request.use(
  async config => {
    const language = await getItem(AsyncKeys.LANGUAGE);
    const { token } = (await getItem(AsyncKeys.USER_DATA)) || '';

    config.headers['Accept-Language'] = language ?? 'ar';
    if (cancelToken?.hasOwnProperty("cancel")) {
      cancelToken.cancel('Canceling previous request');
    }

    config.cancelToken = new axios.CancelToken(c => {
      cancelToken = c;
    });
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }

    config.headers['DeviceId'] = DeviceInfo.getUniqueIdSync();
    if (config?.data) {

      if (!config.data.channel) {
        config.data.Source = channel;
      }

      config.data.DeviceId = DeviceInfo.getUniqueIdSync();
      if (config.params) {
        config.params['DeviceId'] = DeviceInfo.getUniqueIdSync();
      }

    }
    console.log('==============data.id=========config=============');
    console.log(config.data, `zzzzz${config.baseURL}${config.url}`);
    console.log('================headers====================');
    console.log(config.headers);
    console.log('====================================');
    console.log('=============config.params=======================');
    console.log(config.params);
    console.log('====================================');
    return config;
  },
  error => {
    console.log('error ', error);
    Promise.reject(error);
  },
);

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
let cancelToken:any;
globalAPI.interceptors.request.use(
  async config => {
    const language = await getItem(AsyncKeys.LANGUAGE);
    const { token } = (await getItem(AsyncKeys.USER_DATA)) || '';
      config.headers['Accept-Language']= language ?? 'ar';
      if (cancelToken?.hasOwnProperty("cancel")) {
        cancelToken.cancel('Canceling previous request');
      }
  
      config.cancelToken = new axios.CancelToken(c => {
        cancelToken = c;
      });
    // if (token) {
    //  // config.headers.Authorization = `bearer ${token}`;
    //   config.headers.Authorization = `bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImE3NGVjMWU4LTNlNzUtNGNiMy1iMjZiLTA4ZGUwYmVhMDk5OSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJSWUNCQkJBN003IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJleHAiOjE3NjM4OTUyMjl9.N4ax88eSA7A5m9FhXa_jflvEi8euzgAoIxoDMRAAwGY`;
    // }
          config.headers.Authorization = `bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkxODc3MWZmLTlkZGItNGRjZS0xNTM5LTA4ZGRmMTZkMmI3OCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJNODdKQzJESUxDIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ3VzdG9tZXIiLCJleHAiOjE3NjM5MTMwOTR9.jTxMxsI2IB-VZidQ9F2LoTvEMqOK9922IO4TIdwnjl8`;

   
    config.headers['DeviceId'] = DeviceInfo.getUniqueIdSync();
    if (config?.data) {
     
      if (!config.data.channel) {
        config.data.Source = channel;
      }

      config.data.DeviceId = DeviceInfo.getUniqueIdSync();
      if ( config.params) {    
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

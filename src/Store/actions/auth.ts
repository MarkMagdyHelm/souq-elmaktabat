import { Platform } from 'react-native';
import { Dispatch } from 'redux';
import { store } from '../store';
import { ActionType } from './actions';

import DeviceInfo from 'react-native-device-info';



/**
 * SetGuesterId
 * @param GuesterId any
 */
export const SetGuesterId = (GuesterId: any) => ({
    type: ActionType.SET_GUSTER_ID,
    payload: GuesterId,
  });

  /**
 * ChangeAppLanguage
 * @param userdata string
 */
export const SetUserData = (userdata: any) => ({
  type: ActionType.SAVE_USER_DATA,
  payload: userdata,
});

/**
* UserLogin
*/
export const UserLogin = () => ({
  type: ActionType.USER_LOGIN,
  payload: true,
});

/**
* UserIsSeller
*/
export const UserIsSeller = (payload:boolean) => ({
  type: ActionType.USER_ISRESELLER,
  payload: payload,
});
/**
* UserLogout
*/
export const UserLogout = () => ({
  type: ActionType.USER_LOGOUT,
  payload: false,
});

/**
 * ChangeAppLanguage
 * @param fcm string
 */
export const SetFCM = (fcm: any) => ({
  type: ActionType.SET_FCM_TOKEN,
  payload: fcm,
});
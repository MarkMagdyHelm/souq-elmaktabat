import { Platform } from 'react-native';
import { Dispatch } from 'redux';
import { store } from '../store';
import { ActionType } from './actions';

import DeviceInfo from 'react-native-device-info';


/**
 * ChangeAppLanguage
 * @param language string
 */
export const ChangeAppLanguage = (language: string) => ({
  type: ActionType.CHANGE_APP_LANGUAGE,
  payload: language,
});

/**
 * ChangeDarkMode
 * @param theme boolean
 */
export const ChangeDarkMode = (theme: boolean) => ({
  type: ActionType.CHANGE_APP_THEME,
  payload: theme,
});

/**
 * ChangeAppDirection
 * @param direction string
 */
export const ChangeAppDirection = (direction: string) => ({
  type: ActionType.CHANGE_APP_DIRECTION,
  payload: direction,
});
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


/**
 * SetAppSettings
 * @param direction string
 */
export const SetAppSettings = (payload: any) => ({
  type: ActionType.SET_APP_SETTINGS,
  payload: payload,
});

/**
 * SetForceUpdatw
 * @param payload string
 */
export const SetForceUpdate = (payload: boolean) => ({
  type: ActionType.SET_FORCE_UPDATE,
  payload: payload,
});

/**
 * SetCountries
 * @param payload array
 */
export const SetCountries = (payload: any[]) => ({
  type: ActionType.SAVE_COUNTRIES,
  payload: payload,
});



/**
 * SetRejectReasons
 * @param payload array
 */
export const SetRejectReasons = (payload: any[]) => ({
  type: ActionType.SAVE_REJECT_REASONS,
  payload: payload,
});

/**
 * SetOfferRequestStatus
 * @param payload array
 */
export const SetOfferRequestStatus = (payload: any[]) => ({
  type: ActionType.SAVE_OFFER_REQUEST_STATUS,
  payload: payload,
});



/**
 * SetActivites
 * @param payload array
 */
export const SetActivites = (payload: any[]) => ({
  type: ActionType.SAVE_ACTIVITES,
  payload: payload,
});
/**
 * SetTools
 * @param payload array
 */
export const SetTools = (payload: any[]) => ({
  type: ActionType.SAVE_TOOLS,
  payload: payload,
});

/**
 * SetRoles
 * @param payload array
 */
export const SetRoles = (payload: any[]) => ({
  type: ActionType.SAVE_Roles,
  payload: payload,
});

/**
 * SetPayments
 * @param payload array
 */
export const SetPayments = (payload: any[]) => ({
  type: ActionType.SAVE_PAYMENTS,
  payload: payload,
});

/**
 * SetPaperSizes
 * @param payload array
 */
export const SetPaperSize = (payload: any[]) => ({
  type: ActionType.SAVE_PAPERSIZE,
  payload: payload,
});

/**
 * SetPaperWodth
 * @param payload array
 */
export const SetPaperWidth = (payload: any[]) => ({
  type: ActionType.SAVE_PAPERWIDTH,
  payload: payload,
});

/**
 * SetPaperType
 * @param payload array
 */
export const SetPaperType = (payload: any[]) => ({
  type: ActionType.PAPER_TYPE,
  payload: payload,
});

/**
 * SetInkType
 * @param payload array
 */
export const SetInkType = (payload: any[]) => ({
  type: ActionType.INK_Type,
  payload: payload,
});
/**
 * SetColorType
 * @param payload array
 */
export const SetColorType = (payload: any[]) => ({
  type: ActionType.COLOR_TYPE,
  payload: payload,
});

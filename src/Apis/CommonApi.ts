import { Dispatch } from 'react';
import { IDispatch } from '../Constants/interfaces';
import { globalAPI } from '../Constants/config';
import i18n from '../Local/i18n.config';
import { ChangeAppLanguage } from '../Store/actions/settings';
import { AsyncKeys, saveItem } from '../Helper';
import { logoutHandler } from './User';
import { SetUserData } from '../Store/actions/auth';

/**
 * GetAllSetting
 * @param cb callback function
 */
export const GetAllSetting = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/Configuration/GetAllSetting',
      );
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllSetting error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetCategories
 * @param cb callback function
 */
export const GetCategories = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/Configuration/GetCategories',
      );
      cb && cb(data, status);
      //console.log('GetCategories ttttata = ', data);
    } catch (error) {
      //console.log('GetCategories error = ', error.response.data);
      if (error?.response?.data?.status == 401) {
        logoutHandler();
      }
      cb && cb(error, 500);
    }
  };
};
/**
 * AddFavouritePaperOffer
 * @param cb callback function
 */
export const AddFavouritePaperOffer = (
  id: any,
  cb?: (data: any, status: any) => void,
) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post(
        'api/Configuration/AddFavouritePaperOffer?Id=' + id,
      );
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null
      //console.log('ffffff', id);
      //console.log('ffffff', data);
    } catch (error) {
      //console.log('AddFavouritePaperOffer error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * AddFavouritePaperOffer
 * @param cb callback function
 */
export const AddFavouritePrintingPressesOffer = (
  id: any,
  cb?: (data: any, status: any) => void,
) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post(
        'api/Configuration/AddFavouritePrintingPressesOffer?Id=' + id,
      );
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null
      //console.log('AddFavouritePrintingPressesOffer', id);
      //console.log('AddFavouritePrintingPressesOffer', data);
    } catch (error) {
      //console.log('AddFavouritePrintingPressesOffer error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * AddFavouriteInkOffer
 * @param cb callback function
 */
export const AddFavouriteInkOffer = (
  id: any,
  cb?: (data: any, status: any) => void,
) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post(
        'api/Configuration/AddFavouriteInkOffer?Id=' + id,
      );
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null
      //console.log('ffffff', id);
      //console.log('ffffff', data);
    } catch (error) {
      //console.log('AddFavouriteInkOffer error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetFavouriteUsers
 * @param cb callback function
 */

export const GetFavouriteUsers = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/User/GetFavouriteUsers',
      );
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null
    } catch (error) {
      //console.log('GetFavouriteUsers error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * UserProfile
 * @param cb callback function
 */
export const UserProfile = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/UserProfile');
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null
    } catch (error) {
      console.log('UserProfile error = ', error);
      cb && cb(error, 500);
    }
  };
};
export const ChangeLanguageHandler = (
  lang: any,
  cb?: (data: any, status: any) => void,
) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      //console.log(lang);
      const isRTL = lang === 'ar';

      i18n.changeLanguage(lang);
      // لو الاتجاه الحالي مختلف عن المطلوب

      dispatch(ChangeAppLanguage(lang));

      await saveItem(AsyncKeys.LANGUAGE, lang);
    } catch (error) {
      //console.log('ChangeLanguageHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetMyBranches
 * @param cb callback function
 */
export const GetMyBranches = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetMyBranches');
    console.log("GetMyBranches data = ", data, status);
    
      cb && cb(data, status);
    } catch (error) {
      console.log('GetMyBranches error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAllActivities
 * @param cb callback function
 */
export const GetAllActivities = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllActivities');
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllActivities error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAllAvailableTools
 * @param cb callback function
 */
export const GetAllAvailableTools = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/User/GetAllAvailableTools',
      );
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllAvailableTools error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAllPaperSizes
 * @param cb callback function
 */
export const GetAllPaperSizes = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/DisplayPaper/GetAllPaperSizes',
      );
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllPaperSizes error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAllPaperWidths
 * @param cb callback function
 */
export const GetAllPaperWidths = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get(
        'api/DisplayPaper/GetAllPaperWidths',
      );
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllPaperWidths error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAllPaperWidths
 * @param cb callback function
 */
export const GetAllRoles = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllRoles');
      cb && cb(data, status);
    } catch (error) {
      //console.log('GetAllPaperWidths error = ', error);
      cb && cb(error, 500);
    }
  };
};


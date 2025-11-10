import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";



/**
 * GetAllSetting
 * @param cb callback function
 */
export const GetAllSetting = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/Configuration/GetAllSetting');
      cb && cb(data, status);
    } catch (error) {
      console.log('GetAllSetting error = ', error);
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
      const { data, status } = await globalAPI.get('api/Configuration/GetCategories');
      cb && cb(data, status);
    } catch (error) {
      console.log('GetCategories error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
 * AddFavouritePaperOffer
 * @param cb callback function
 */
export const AddFavouritePaperOffer = (id:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Configuration/AddFavouritePaperOffer?Id='+id);
      cb && cb(data ?? {}, status); // تأمين بسيط لو data طلعت null

    } catch (error) {
      console.log('AddFavouritePaperOffer error = ', error);
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
      console.log('GetAllActivities error = ', error);
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
      const { data, status } = await globalAPI.get('api/DisplayPaper/GetAllPaperSizes');
      cb && cb(data, status);
    } catch (error) {
      console.log('GetAllPaperSizes error = ', error);
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
      const { data, status } = await globalAPI.get('api/DisplayPaper/GetAllPaperWidths');
      cb && cb(data, status);
    } catch (error) {
      console.log('GetAllPaperWidths error = ', error);
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
      console.log('GetAllPaperWidths error = ', error);
      cb && cb(error, 500);
    }
  };
};


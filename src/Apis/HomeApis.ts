import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";


/**
 * GetPepars
 * @param cb callback function
 */
export const GetPapersHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/DisplayPaper/GetAllPapers');
      cb && cb(data, status);
    } catch (error) {
      console.log('GetPapersHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
 * GetPepars
 * @param cb callback function
 */
export const GetAllPaperOffers = (body:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Offer/GetAllPaperOffers',body);
      cb && cb(data, status);
    } catch (error) {
      console.log('GetAllPaperOffers error = ', error);
      cb && cb(error, 500);
    }
  };
};

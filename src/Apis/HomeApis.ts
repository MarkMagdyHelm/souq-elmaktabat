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
      // console.log('GetPapersHandler error = ', error);
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
    // console.log("GetAllPaperOffers",data);
    // console.log("kkkk",body);

    } catch (error) {
      // console.log('GetAllPaperOffers error = ', error);
      cb && cb(error, 500);
    }
    
  };
};
/**
 * GetPepars
 * @param cb callback function
 */
export const GetAllInkOffers = (body:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Offer/GetAllInkOffers',body);
      cb && cb(data, status);
      // console.log('GetAllInkOffers  = ', data);
      // console.log('GetAllInkOffers  = ', body);

    } catch (error) {
      // console.log('GetAllInkOffers error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
 * GetPrinters
 * @param cb callback function
 */
export const GetAllPrintersOffers = (body:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Offer/GetAllPrintingOffers',body);
      cb && cb(data, status);
      // console.log('GetAllPrintersOffers = ', body);
      // console.log('GetAllPrintersOffers = ', data);

    } catch (error) {
      // console.log('GetAllPrintersOffers error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
 * GetPepars
 * @param cb callback function
 */
export const GetMyPaperOffers = (body:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Offer/GetMyPaperOffers',body);
      cb && cb(data, status);
    } catch (error) {
      // console.log('GetAllPaperOffers error = ', error);
      cb && cb(error, 500);
    }
  };
};


/**
 * GetSellerData
 * @param cb callback function
 */
export const GetSellerData = (id:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetSellerData?id='+id);
      cb && cb(data, status);
        // console.log('GetSellerData = ', data);
    } catch (error) {
      // console.log('GetSellerData error = ', error);
      cb && cb(error, 500);
    }
  };
};

export const DeleteAccount = (
  cb?: (data: any, status: any) => void,
) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.delete(
        'api/User/DeleteAccount',
      );

      cb && cb(data, status);

      // console.log('DeleteAccount = ', data);
    } catch (error) {
      // console.log('DeleteAccount error = ', error);

      cb && cb(error, 500);
    }
  };
};

export const AddPaperRate = (body:any,cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
      try {
      const { data, status } = await globalAPI.post('api/DisplayPaper/AddPaperRate',body);
      cb && cb(data, status);
      // console.log('AddPaperRate = ', body);
      // console.log('AddPaperRate = ', data);

    } catch (error) {
      // console.log('AddPaperRate error = ', error);
      cb && cb(error, 500);
    }
  };
};
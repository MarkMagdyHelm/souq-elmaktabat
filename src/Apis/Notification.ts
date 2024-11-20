import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";

/**
 * GetAllNotifications
 * @param params {}
 * @param cb callback function
 */
export const GetAllNotificationsHandler = (params:any,cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.get('api/DisplayPaper/GetAllNotifications',{params:params});  
        cb && cb(data,status);
      } catch (error) {
          console.log('GetAllNotifications error = ', error);
        cb && cb(error,500);
      }
    };
  };
  
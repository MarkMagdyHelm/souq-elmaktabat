import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetGuesterId } from "../Store/actions/auth";
import DeviceInfo from "react-native-device-info";


/**
 * AssignDeviceIdToGuest
 * @param body 
 * @param cb callback function
 */
export const AssignDeviceIdToGuestHandler = (body:any,cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.post('api/User/AssignDeviceIdToGuest',body,{params:{
            DeviceId:DeviceInfo.getUniqueIdSync()
        }});  
        if (data.status == 200) {      
            dispatch(SetGuesterId(data.data))     
        }
        cb && cb(data,status);
      } catch (error) {
          console.log('AssignDeviceIdToGuest error = ', error);
        cb && cb(error,500);
      }
    };
  };
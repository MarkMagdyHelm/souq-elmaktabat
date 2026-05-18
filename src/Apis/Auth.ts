import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetGuesterId, SetUserData, UserLogout } from "../Store/actions/auth";
import DeviceInfo from "react-native-device-info";
import { AsyncKeys, saveItem } from "../Helper";


/**
 * AssignDeviceIdToGuest
 * @param body 
 * @param cb callback function
 */
export const AssignDeviceIdToGuestHandler = (body: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/User/AssignDeviceIdToGuest', body, {
        params: {
          DeviceId: DeviceInfo.getUniqueIdSync()
        }
      });
      if (data.status == 200) {
        dispatch(SetGuesterId(data.data))
      }
      cb && cb(data, status);
    } catch (error) {
      // console.log('AssignDeviceIdToGuest error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
* AssignGuestFCMToken
* @param body {}
* @param fcmToken
* @param cb callback function
*/
// export const AssignGuestFCMTokenHandler = (body: any, params: any, cb?: (data: any, status: any) => void) => {
//   return async (dispatch: Dispatch<IDispatch>) => {
//     try {
//       const { data, status } = await globalAPI.post('api/User/AssignGuestFCMToken', body, { params: params });
//       if (data.status == 200) {
//         // dispatch(SetGuesterId(data.data))     
//       }
//       cb && cb(data, status);
//     } catch (error) {
//       // console.log('AssignGuestFCMToken error = ', error);
//       cb && cb(error, 500);
//     }
//   };
// };

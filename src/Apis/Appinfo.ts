import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetAppSettings } from "../Store/actions/settings";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

/**
 * GetAppSettings
 * @param cb callback function
 */
export const GetSettingsHandler = (cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.get('/api/Configuration/GetAllSetting');
        console.log('GetSettingsHandler data = ', data,status);
        dispatch(SetAppSettings(data.data))
        cb && cb(data,status);
      } catch (error) {
          console.log('GetSettingsHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };

  /**
 * GetAppCities
 * @param cb callback function
 */
export const GetCitiesHandler = (cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.get('api/User/GetAllCountries');
      console.log('GetCitiesHandler data = ', data,status);
      cb && cb(data,status);
    } catch (error) {
        console.log('GetCitiesHandler error = ', error);
      cb && cb(error,500);
    }
  };
};


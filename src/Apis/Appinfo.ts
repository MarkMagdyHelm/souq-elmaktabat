import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetActivites, SetAppSettings, SetCountries } from "../Store/actions/settings";
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
 * ContactUs
 * @param body {name,email,message}
 * @param params {}
 * @param cb callback function
 */
export const ContactUsHandler = (body:any,params:any,cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.post('/api/Poll/AddMessage',body,{params:params});  
      if (data.status == 200) {      
          // dispatch(SetGuesterId(data.data))     
      }
      cb && cb(data,status);
    } catch (error) {
        console.log('ContactUs error = ', error);
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
      // cb && cb(data,status);

      dispatch(SetCountries(data.data));
    } catch (error) {
        console.log('GetCitiesHandler error = ', error);
      cb && cb(error,500);
    }
  };
};
 /**
 * GetAppCities
 * @param CountryId
 * @param cb callback function
 */
export const GetAllRegionsByCountryIdHandler = (CountryId,cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.get('api/User/GetAllRegionsByCountryId',{params:{
        CountryId:CountryId

      }});
      console.log('GetAllRegionsByCountryIdHandler data = ', data,status);
      // cb && cb(data,status);

      dispatch(SetCountries(data.data));
    } catch (error) {
        console.log('GetAllRegionsByCountryIdHandler error = ', error);
      cb && cb(error,500);
    }
  };
};
/**
 * GetAppGetAllActivities
 * @param cb callback function
 */
export const GetAllActivitiesHandler = (cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.get('api/User/GetAllActivities');
      console.log('GetAllActivitiesHandler data = ', data,status);
      // cb && cb(data,status);
            const activitesWithFlag = data.data.map(activity => ({
  ...activity,
  isSelected: false, 
}));
dispatch(SetActivites(activitesWithFlag));
    } catch (error) {
        console.log('GetAllActivitiesHandler error = ', error);
      cb && cb(error,500);
    }
  };
};
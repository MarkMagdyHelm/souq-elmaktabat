import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetActivites, SetAppSettings, SetCountries, SetPayments, SetRoles, SetTools } from "../Store/actions/settings";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

/**
 * GetAppSettings
 * @param cb callback function
 */
export const GetSettingsHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('/api/Configuration/GetAllLookups');
      console.log('GetSettingsHandler data = ', data.data, data.status);
      dispatch(SetAppSettings(data.data.setting));
      const paymentTypesithFlag = Array.isArray(data?.data?.paymentTypes)
        ? data.data.paymentTypes.map(payment => ({
          ...payment,
          isSelected: false,
        }))
        : [];
      console.log('==============paymentTypesithFlag======================');
      console.log(paymentTypesithFlag);
      console.log('====================================');
      dispatch(SetPayments(paymentTypesithFlag));
      dispatch(SetCountries(data.data.country));
      const activitesWithFlag = data.data.activities.map(activity => ({
        ...activity,
        isSelected: false,
      }));
      dispatch(SetActivites(activitesWithFlag));
      const toolsWithFlag = data.data.availableTools.map(tool => ({
        ...tool,
        isSelected: false,
      }));
      dispatch(SetTools(toolsWithFlag));
      dispatch(SetRoles(data.data.roles));
      cb && cb(data.data.setting, data.status);
    } catch (error) {
      console.log('GetSettingsHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};



/**
 * ContactUs
 * @param body {name,email,message}
 * @param params {}
 * @param cb callback function
 */
export const ContactUsHandler = (body: any, params: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('/api/Poll/AddMessage', body, { params: params });
      if (data.status == 200) {
        // dispatch(SetGuesterId(data.data))     
      }
      cb && cb(data, status);
    } catch (error) {
      console.log('ContactUs error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
* GetAppCities
* @param cb callback function
*/
export const GetCitiesHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllCountries');
      console.log('GetCitiesHandler data = ', data, status);
      // cb && cb(data,status);

      dispatch(SetCountries(data.data));
    } catch (error) {
      console.log('GetCitiesHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
* GetAppCities
* @param CountryId
* @param cb callback function
*/
export const GetAllRegionsByCountryIdHandler = (CountryId, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllRegionsByCountryId', {
        params: {
          CountryId: CountryId

        }
      });
      console.log('GetAllRegionsByCountryIdHandler data = ', data, status);
      cb && cb(data, status);

      // dispatch(SetCountries(data.data));
    } catch (error) {
      console.log('GetAllRegionsByCountryIdHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAppGetAllActivities
 * @param cb callback function
 */
export const GetAllActivitiesHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllActivities');
      console.log('GetAllActivitiesHandler data = ', data, status);
      // cb && cb(data,status);
      const activitesWithFlag = data.data.map(activity => ({
        ...activity,
        isSelected: false,
      }));
      dispatch(SetActivites(activitesWithFlag));
    } catch (error) {
      console.log('GetAllActivitiesHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAppGetAllAvailableTools
 * @param cb callback function
 */
export const GetAllAvailableToolsHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllAvailableTools');
      console.log('GetAllAvailableToolsHandler data = ', data, status);
      // cb && cb(data,status);
      const toolsWithFlag = data.data.map(tool => ({
        ...tool,
        isSelected: false,
      }));
      dispatch(SetTools(toolsWithFlag));
    } catch (error) {
      console.log('GetAllAvailableToolsHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * GetAppRoles
 * @param cb callback function
 */
export const GetAllRolesHandler = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetAllRoles');
      console.log('GetAllRolesHandler data = ', data, status);
      // cb && cb(data,status);

      dispatch(SetRoles(data.data));
    } catch (error) {
      console.log('GetAllRolesHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};


import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import { SetActivites, SetAppSettings, SetColorType, SetCountries, SetInkType, SetOfferRequestStatus, SetPaperSize, SetPaperWidth, SetPayments, SetRejectReasons, SetRoles, SetTools } from "../Store/actions/settings";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

/**
 * GetAppSettings
 * @param cb callback function
 */
export const GetSettingsHandler = (body: any, action, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('/api/Configuration/GetAllLookups', body);

      console.log('GetSettingsHandler data = ', data, data.status);
      if (action == "settings") {
        dispatch(SetAppSettings(data.data.Setting));
      }
      if (action == "signup") {
        const paymentTypesithFlag = Array.isArray(data?.data?.PaymentTypes)
          ? data.data.PaymentTypes.map(payment => ({
            ...payment,
            isSelected: false,
          }))
          : [];
        dispatch(SetPayments(paymentTypesithFlag));
        const activitesWithFlag = data.data.Activities.map(activity => ({
          ...activity,
          isSelected: false,
        }));
        dispatch(SetActivites(activitesWithFlag));
        const toolsWithFlag = data.data.AvailableTools.map(tool => ({
          ...tool,
          isSelected: false,
        }));
        dispatch(SetTools(toolsWithFlag));
        dispatch(SetRoles(data.data.Roles));
      }
      if (action == "paper") {
        dispatch(SetPaperSize(data.data.PaperSizes));
        dispatch(SetPaperWidth(data.data.PaperWidths));
      }
      if (action == "countries") {
   
        
        dispatch(SetCountries(data.data.Countries));
        dispatch(SetPaperSize(data.data.PaperSizes));
        dispatch(SetPaperWidth(data.data.PaperWidths));
        dispatch(SetRejectReasons(data.data.RejectReasons));
        dispatch(SetOfferRequestStatus(data.data.OfferRequestStatus));
        dispatch(SetInkType(data.data.Inks));
        dispatch(SetColorType(data.data.Colors));
        dispatch(SetPayments(data.data.PaymentTypes));
        const activitesWithFlag = data.data.Activities.map(activity => ({
          ...activity,
          isSelected: false,
        }));
        dispatch(SetActivites(activitesWithFlag));
        
      }

      cb && cb(data.data.Settings, data.status);
    } catch (error) {
      // console.log('GetSettingsHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * @param cb callback function
 */
export const LookUpHandler = (body: any, params: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('/api/Poll/AddMessage', body, { params: params });
      if (data.status == 200) {
        // dispatch(SetGuesterId(data.data))     
      }
      cb && cb(data, status);
    } catch (error) {
      // console.log('ContactUs error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * @param cb callback function
 */
export const DeleteBranch = (branchId: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.delete('/api/Configuration/DeleteBranch?Id='+branchId);
     
      cb && cb(data, status);
    } catch (error) {
      // console.log('ContactUs error = ', error);
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
      // console.log('ContactUs error = ', error);
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
      // console.log('GetCitiesHandler data = ', data, status);
      // cb && cb(data,status);

      dispatch(SetCountries(data.data));
    } catch (error) {
      // console.log('GetCitiesHandler error = ', error);
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
      // console.log('GetAllRegionsByCountryIdHandler data = ', data, status);
      cb && cb(data, status);

      // dispatch(SetCountries(data.data));
    } catch (error) {
      // console.log('GetAllRegionsByCountryIdHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
* AddBranch
* @param country
* @param region
* @param street
* @param cb callback function
*/
export const AddBranch = (body:any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/Configuration/AddBranch',body);
      // console.log('AddBranch data = ', data, status);
      cb && cb(data, status);

      // dispatch(SetCountries(data.data));
    } catch (error) {
      // console.log('AddBranch error = ', error);
      cb && cb(error, 500);
    }
  };
};

export const GetAllPapersV2 = ( cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/DisplayPaper/GetAllPapers');
      // console.log('GetAllPapersV2 data = ', data, status);
      cb && cb(data, status);

      // dispatch(SetCountries(data.data));
    } catch (error) {
      // console.log('GetAllPapersV2 error = ', error);
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
      // console.log('GetAllActivitiesHandler data = ', data, status);
      // cb && cb(data,status);
      const activitesWithFlag = data.data.map(activity => ({
        ...activity,
        isSelected: false,
      }));
      dispatch(SetActivites(activitesWithFlag));
    } catch (error) {
      // console.log('GetAllActivitiesHandler error = ', error);
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
      // console.log('GetAllAvailableToolsHandler data = ', data, status);
      // cb && cb(data,status);
      const toolsWithFlag = data.data.map(tool => ({
        ...tool,
        isSelected: false,
      }));
      dispatch(SetTools(toolsWithFlag));
    } catch (error) {
      // console.log('GetAllAvailableToolsHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 * DeleteOffer
 * @param cb callback function
 */
export const DeleteOffer = (body: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.delete('api/Offer/DeleteOffer', body);
      console.log('DeleteOffer data = ',body, data, status);
      cb && cb(data,status);
    
    } catch (error) {
      console.log('DeleteOffer error = ', error);
      cb && cb(error, 500);
    }
  };
};


/**
 * UserRate
 * @param cb callback function
 */
export const UserRate = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/Rating/UserRate');
      // console.log('UserRate data = ', data, status);
      cb && cb(data,status);
  
    } catch (error) {
      // console.log('UserRate error = ', error);
      cb && cb(error, 500);
    }
  };
};
/**
 * GetFavouriteOffers
 * @param cb callback function
 */
export const GetFavouriteOffers = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/GetFavouriteOffers');
      // console.log('GetFavouriteOffers data = ', data, status);
      cb && cb(data,status);
  
    } catch (error) {
      // console.log('GetFavouriteOffers error = ', error);
      cb && cb(error, 500);
    }
  };
};





/**
 * AddFavouriteUser
 * @param cb callback function
 */
export const AddFavouriteUser = (toUserId: any, cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.post('api/User/AddFavouriteUser?toUserId='+toUserId)
      // console.log('AddFavouriteUser data = ', data, status);
       cb && cb(data,status);
    
    } catch (error) {
      // console.log('AddFavouriteUser error = ', error);
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
      // console.log('GetAllRolesHandler data = ', data, status);
      // cb && cb(data,status);

      dispatch(SetRoles(data.data));
    } catch (error) {
      // console.log('GetAllRolesHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};


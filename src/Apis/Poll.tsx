import { Dispatch } from "react";
import { IDispatch } from "../Constants/interfaces";
import { globalAPI } from "../Constants/config";
import DeviceInfo from "react-native-device-info";


/**
 * GetPolls
 * @param cb callback function
 */
export const GetPollsHandler = (params:any,cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.get('api/Poll/GetAllPollsForMobile',{
            params:params
        });       
        cb && cb(data,status);
      } catch (error) {
          console.log('GetPollsHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };

  /**
 * VotePollByGuese
 * @param cb callback function
 */
export const VotePollByGueseHandler = (params:any,cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.post('api/Poll/VotePollByGuest',{},{
            params:params
        });       
        cb && cb(data,status);
      } catch (error) {
          console.log('VotePollByGueseHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };
 /**
 * UpdateVotePollByGuese
 * @param cb callback function
 */
 export const UpdateVotePollByGueseHandler = (params:any,cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.post('api/Poll/UpdatePollByGuest',{},{
          params:params
      });       
      cb && cb(data,status);
    } catch (error) {
        console.log('UpdateVotePollByGueseHandler error = ', error);
      cb && cb(error,500);
    }
  };
};

  /**
 * VotePollByUserHandler
 * @param cb callback function
 */
export const VotePollByUserHandler = (params:any,cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.post('api/Poll/VotePollByUser',{},{
          params:params
      });       
      cb && cb(data,status);
    } catch (error) {
        console.log('VotePollByUserHandler error = ', error);
      cb && cb(error,500);
    }
  };
};

/**
 * UpdateVotePollByUserHandler
 * @param cb callback function
 */
export const UpdateVotePollByUserHandler = (params:any,cb?: (data: any,status:any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data,status } = await globalAPI.post('api/Poll/UpdatePollByUser',{},{
          params:params
      });       
      cb && cb(data,status);
    } catch (error) {
        console.log('UpdateVotePollByUserHandler error = ', error);
      cb && cb(error,500);
    }
  };
};
import { Dispatch } from "redux";
import { IDispatch } from "../Constants/interfaces";
import { SetUserData, UserLogin, UserLogout } from "../Store/actions/auth";
import { AsyncKeys, saveItem } from "../Helper";
import { globalAPI } from "../Constants/config";



/**
 *   Sign in
 * @param body  phoneNumber password
 * @param cb callback function
 */
export const SignInHandler = (body:any, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('====================================');
        console.log(body);
        console.log('====================================');
        const { data,status } = await globalAPI.post('/api/User/SignIn', body,{params:{}});
        console.log(data,status);
        
        console.log('SignInHandler data = ', data,status);
  
        if (status == 200) {
          dispatch<any>(loginHandler(data.data));
        }
        cb && cb(data,status);
      } catch (error) {
          console.log('SignInHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };
/**
 *  loginHandler 
 * @param body usertoken user mail and phone ...etc
 */
export const loginHandler = (body:any) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('==========loginHandler==========================');
        console.log(body);
        console.log('====================================');
        dispatch(SetUserData(body));
        dispatch(UserLogin());
         await saveItem(AsyncKeys.USER_DATA,body);
         await saveItem(AsyncKeys.IS_LOGIN,true);
        console.log('loginHandler data = ',); 
      } catch (error) {
          console.log('loginHandler error = ', error);
      }
    };
  };

  /**
 *  logoutHandler 
 * @param body usertoken user mail and phone ...etc
 */
export const logoutHandler = (body:any={}) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('==========loginHandler==========================');
        console.log(body);
        console.log('====================================');
        dispatch(SetUserData(body));
        dispatch(UserLogout());
         await saveItem(AsyncKeys.USER_DATA,body);
         await saveItem(AsyncKeys.IS_LOGIN,false);
        console.log('loginHandler data = ',); 
      } catch (error) {
          console.log('loginHandler error = ', error);
      }
    };
  };
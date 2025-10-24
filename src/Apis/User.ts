import { Dispatch } from "redux";
import { IDispatch } from "../Constants/interfaces";
import { SetUserData, UserIsSeller, UserLogin, UserLogout } from "../Store/actions/auth";
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
          if (data.data.role != "Customer") {
            if (data.data.admin) {     
              dispatch<any>(UserIsSeller(data.data.admin));
            }
          }
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

  /**
 *SendOTPByEmail
 * @param email string
 * @param cb callback function
 */
export const SendOTPByEmailHandler = (email:string, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        const { data,status } = await globalAPI.get('/api/User/SendOTPByEmail',{params:{
          email:email
        }});
        console.log('SendOTPByEmailHandler data = ', data,status);
        cb && cb(data,status);
      } catch (error) {
          console.log('SendOTPByEmailHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };
  

  /**
 *   ConfirmEmail
 * @param body  email verifyCode
 * @param cb callback function
 */
export const ConfirmEmailHandler = (body:any, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('===============aaaa=====================');
        console.log(body);
        console.log('====================================');
        const { data,status } = await globalAPI.post('/api/User/ConfirmEmail', body);
        console.log(data,status);
        
        console.log('ConfirmEmailHandler data = ', data,status);
  
        if (status == 200) {
          dispatch<any>(loginHandler(data.data));
        }
        cb && cb(data,status);
      } catch (error) {
          console.log('ConfirmEmailHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };

  /**
 *   SignUp
 * @param body  email verifyCode
 * @param cb callback function
 */
export const SignUpHandler = (body:any, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('===============aaaa=====================');
        console.log(body);
        console.log('====================================');
      
        const { data,status } = await globalAPI.post('/api/User/SignUp', body,{
  headers: {
    "Content-Type": "multipart/form-data",
  }});
        console.log(data,status);
        
        console.log('SignUpHandler data = ', data,status);
  
        // if (status == 200) {
        //   dispatch<any>(loginHandler(data.data));
        // }
        cb && cb(data,status);
      } catch (error) {
          console.log('SignUpHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };

  /**
 * CheckActivison
 * @param cb callback function
 */
export const CheckActivison = (cb?: (data: any, status: any) => void) => {
  return async (dispatch: Dispatch<IDispatch>) => {
    try {
      const { data, status } = await globalAPI.get('api/User/CheckConfirmation');
      console.log('CheckActivisonHandler data = ', data, status);
      // cb && cb(data,status);

       if (data.status == 200) {
            if (data.data) {     
              dispatch<any>(UserIsSeller(data.data));
            }
          }
    } catch (error) {
      console.log('CheckActivisonHandler error = ', error);
      cb && cb(error, 500);
    }
  };
};

/**
 *   ForgetPassword
 * @param body  phoneNumber password
 * @param cb callback function
 */
export const ForgetPasswordHandler = (body:any, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
        console.log('====================================');
        console.log(body);
        console.log('====================================');
        const { data,status } = await globalAPI.post('/api/User/ChangePassword', body);
        console.log(data,status);
        
        console.log('ForgetPasswordHandler data = ', data,status);
  
        if (status == 200) {
          cb && cb(data,status);
        }
      } catch (error) {
          console.log('ForgetPasswordHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };
import { Dispatch } from "redux";
import { IDispatch } from "../Constants/interfaces";
import { SetUserData, UserIsSeller, UserLogin, UserLogout } from "../Store/actions/auth";
import { AsyncKeys, saveItem } from "../Helper";
import { globalAPI } from "../Constants/config";
import { Platform } from "react-native";



/**
 *   Sign in
 * @param body  phoneNumber password
 * @param cb callback function
 */
export const SignInHandler = (body:any, cb?: (data: any,status:any) => void) => {
    return async (dispatch: Dispatch<IDispatch>) => {
      try {
       
        const { data,status } = await globalAPI.post('/api/User/SignIn', body,{params:{}});
        // console.log('SignIn:', data);
        
        if (data.status == 200) {
          const signInData = data.data;
          
          // Fetch UserProfile to get complete user data
          try {
            const profileResponse = await globalAPI.get('api/User/GetSellerData?id=' + signInData.id);
            
            if (profileResponse.data.status === 200) {
              const userProfileData = profileResponse.data.data;
              
              // console.log('UserProfile:', userProfileData);
              
              // Merge: SignIn data first, then UserProfile fills missing fields
              const finalUserData = {
                ...signInData,
                ...userProfileData,
                // Always preserve token from SignIn
                token: signInData.token,
                id: signInData.id,
              };
              
              // console.log('Merged userData:', finalUserData);
              
              dispatch<any>(loginHandler(finalUserData));
            } else {
              // Fallback to SignIn data only
              dispatch<any>(loginHandler(signInData));
            }
          } catch (profileError) {
            // console.log('UserProfile fetch error, using SignIn data only');
            dispatch<any>(loginHandler(signInData));
          }
          
          if (data.data.role != "Customer") {
            if (data.data.admin) {     
              dispatch<any>(UserIsSeller(data.data.admin));
            }
          }else{
            dispatch<any>(UserIsSeller(false));
          }
        }
        cb && cb(data,status);
      } catch (error) {
          console.log('SignInHandler error = ', error.response.data);
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
        // console.log('==========loginHandler==========================');
        // console.log('📦 Login data received:', body);
        // console.log('🔍 Login data fields:', Object.keys(body || {}));
        
        // Validate user data has required fields
        if (!body || !body.id || !body.token) {
          // console.error('❌ Invalid login data - missing id or token:', body);
          throw new Error('Invalid user data - missing required fields');
        }
        
        // console.log('✅ Valid login data - saving to state and storage');
        // console.log('📝 User fields being saved:', {
        //   id: body.id,
        //   name: body.name,
        //   email: body.email,
        //   phoneNumber: body.phoneNumber,
        //   imageUrl: body.imageUrl,
        //   hasToken: !!body.token,
        //   allFields: Object.keys(body),
        // });
        
        // Save complete user object - DO NOT destructure or filter
        dispatch(SetUserData(body));
        dispatch(UserLogin());
        await saveItem(AsyncKeys.USER_DATA, body);
        await saveItem(AsyncKeys.IS_LOGIN, true);
        
        // console.log('✅ Login complete - user authenticated with all fields'); 
      } catch (error) {
          // console.error('❌ loginHandler error = ', error);
          // Ensure clean state on login failure
          dispatch(SetUserData({}));
          dispatch(UserLogout());
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
        console.log('==========logoutHandler==========================');
        console.log('Logging out user, clearing auth data');
        console.log('====================================');
        
        // Clear Redux state FIRST
        dispatch(SetUserData({}));
        dispatch(UserLogout());
        dispatch(UserIsSeller(false));
        
        // Then clear AsyncStorage
        await saveItem(AsyncKeys.USER_DATA, {});
        await saveItem(AsyncKeys.IS_LOGIN, false);
        
        console.log('✅ Logout complete - auth state cleared'); 
      } catch (error) {
          console.error('❌ logoutHandler error = ', error);
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
        const { data,status } = await globalAPI.post('/api/User/ConfirmEmail', body);
        // console.log('ConfirmEmail:', data);
  
        if (status == 200) {
          const confirmData = data.data;
          
          // Fetch UserProfile to get complete user data
          try {
            const profileResponse = await globalAPI.get('api/User/GetSellerData?id=' + confirmData.id);
            
            if (profileResponse.data.status === 200) {
              const userProfileData = profileResponse.data.data;
              
              // console.log('UserProfile:', userProfileData);
              
              // Merge: ConfirmEmail data first, then UserProfile fills missing fields
              const finalUserData = {
                ...confirmData,
                ...userProfileData,
                // Always preserve token from ConfirmEmail
                token: confirmData.token,
                id: confirmData.id,
              };
              
              // console.log('Merged userData:', finalUserData);
              
              dispatch<any>(loginHandler(finalUserData));
            } else {
              // Fallback to ConfirmEmail data only
              dispatch<any>(loginHandler(confirmData));
            }
          } catch (profileError) {
            // console.log('UserProfile fetch error, using ConfirmEmail data only');
            dispatch<any>(loginHandler(confirmData));
          }
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
      console.log('CheckActivisonHandler data = ',Platform.OS, data, status);
      
      if (data.status == 200) {
         console.log('CheckActivisonHandler success - user is valid');
         dispatch<any>(UserIsSeller(data.data));
         cb && cb(data, status);
      } else {
        // Session invalid - logout user
        console.warn('⚠️ CheckActivison failed - invalid session, logging out:', data);
        dispatch<any>(logoutHandler({}));
        cb && cb(data, status);
      }
    } catch (error) {
      // API error (401, 403, network, etc.) - likely invalid session
      console.error('❌ CheckActivison error - session invalid, logging out:', error);
      dispatch<any>(logoutHandler({}));
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

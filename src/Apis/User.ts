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
        // console.log('🔐 SignInHandler: Starting authentication...');
        
        const { data,status } = await globalAPI.post('/api/User/SignIn', body,{params:{}});
        // console.log('📡 SignIn API Response:', {
        //   status: data.status,
        //   hasData: !!data.data,
        //   dataFields: data.data ? Object.keys(data.data) : [],
        // });
        
        if (data.status == 200) {
          // console.log('✅ SignIn successful - initial data fields:', Object.keys(data.data || {}));
          
          // Store token and basic auth data first
          const initialAuthData = data.data;
          
          // Fetch complete user profile to get all fields
          // console.log('🔄 Fetching full user profile for userId:', initialAuthData.id);
          
          try {
            const profileResponse = await globalAPI.get('api/User/GetSellerData?id=' + initialAuthData.id);
            
            if (profileResponse.data.status === 200) {
              // console.log('✅ Full profile fetched successfully');
              // console.log('📦 Profile data fields:', Object.keys(profileResponse.data.data || {}));
              
              // Merge: Start with profile data, then override with auth-specific fields (token, etc.)
              const completeUserData = {
                ...profileResponse.data.data,  // Full profile from GetSellerData
                ...initialAuthData,            // Auth fields from SignIn (token, etc.)
                // Ensure critical auth fields are preserved
                token: initialAuthData.token,
                id: initialAuthData.id,
              };
              
              // console.log('🔗 Merged userData fields:', Object.keys(completeUserData));
              // console.log('📊 Comparison:', {
              //   initialFields: Object.keys(initialAuthData).length,
              //   profileFields: Object.keys(profileResponse.data.data || {}).length,
              //   mergedFields: Object.keys(completeUserData).length,
              // });
              
              // Save complete merged user data
              dispatch<any>(loginHandler(completeUserData));
            } else {
              // console.warn('⚠️ Profile fetch failed, using initial auth data only');
              dispatch<any>(loginHandler(initialAuthData));
            }
          } catch (profileError) {
            // console.error('❌ Profile fetch error, using initial auth data:', profileError);
            dispatch<any>(loginHandler(initialAuthData));
          }
          
          // Handle seller role
          if (data.data.role != "Customer") {
            if (data.data.admin) {     
              dispatch<any>(UserIsSeller(data.data.admin));
            }
          } else {
            dispatch<any>(UserIsSeller(false));
          }
        }
        
        cb && cb(data,status);
      } catch (error) {
          // console.error('❌ SignInHandler error = ', error.response?.data || error);
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
        
        // Expected user fields for complete profile
        const expectedFields = [
          'id', 'token', 'name', 'email', 'phoneNumber', 'imageUrl', 
          'role', 'admin', 'companyName', 'address', 'info'
        ];
        
        const presentFields = Object.keys(body);
        const missingFields = expectedFields.filter(field => !presentFields.includes(field));
        
        if (missingFields.length > 0) {
          // console.warn('⚠️ Some user fields are missing:', {
          //   missing: missingFields,
          //   present: presentFields,
          //   total: presentFields.length,
          // });
        } else {
          // console.log('✅ All expected user fields present');
        }
        
        // console.log('📝 User fields being saved:', {
        //   id: body.id,
        //   name: body.name,
        //   email: body.email,
        //   phoneNumber: body.phoneNumber,
        //   imageUrl: body.imageUrl,
        //   hasToken: !!body.token,
        //   hasInfo: !!body.info,
        //   hasAddress: !!body.address,
        //   allFields: Object.keys(body),
        // });
        
        // Save complete user object - DO NOT destructure or filter
        dispatch(SetUserData(body));
        dispatch(UserLogin());
        await saveItem(AsyncKeys.USER_DATA, body);
        await saveItem(AsyncKeys.IS_LOGIN, true);
        
        // console.log('✅ Login complete - user authenticated with', Object.keys(body).length, 'fields'); 
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
        // console.log('==========logoutHandler==========================');
        // console.log('Logging out user, clearing auth data');
        // console.log('====================================');
        
        // Clear Redux state FIRST
        dispatch(SetUserData({}));
        dispatch(UserLogout());
        dispatch(UserIsSeller(false));
        
        // Then clear AsyncStorage
        await saveItem(AsyncKeys.USER_DATA, {});
        await saveItem(AsyncKeys.IS_LOGIN, false);
        
        // console.log('✅ Logout complete - auth state cleared'); 
      } catch (error) {
          // console.error('❌ logoutHandler error = ', error);
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
        // console.log('SendOTPByEmailHandler data = ', data,status);
        cb && cb(data,status);
      } catch (error) {
          // console.log('SendOTPByEmailHandler error = ', error);
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
        // console.log('📧 ConfirmEmailHandler: Verifying email...');
        // console.log('Request body:', body);
        
        const { data,status } = await globalAPI.post('/api/User/ConfirmEmail', body);
        // console.log('📡 ConfirmEmail API Response:', {
        //   status: data.status,
        //   hasData: !!data.data,
        //   dataFields: data.data ? Object.keys(data.data) : [],
        // });
  
        if (status == 200) {
          // console.log('✅ Email confirmed successfully');
          // console.log('🔄 Fetching full user profile for userId:', data.data.id);
          
          try {
            // Fetch complete profile after email confirmation
            const profileResponse = await globalAPI.get('api/User/GetSellerData?id=' + data.data.id);
            
            if (profileResponse.data.status === 200) {
              // console.log('✅ Full profile fetched after email confirmation');
              
              // Merge confirmation data with full profile
              const completeUserData = {
                ...profileResponse.data.data,
                ...data.data,
                token: data.data.token,
                id: data.data.id,
              };
              
              // console.log('🔗 Merged userData after confirmation:', Object.keys(completeUserData));
              dispatch<any>(loginHandler(completeUserData));
            } else {
              // console.warn('⚠️ Profile fetch failed after confirmation, using confirmation data only');
              dispatch<any>(loginHandler(data.data));
            }
          } catch (profileError) {
            // console.error('❌ Profile fetch error after confirmation:', profileError);
            dispatch<any>(loginHandler(data.data));
          }
        }
        
        cb && cb(data,status);
      } catch (error) {
          // console.error('❌ ConfirmEmailHandler error = ', error);
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
        // console.log('===============aaaa=====================');
        // console.log(body);
        // console.log('====================================');
      
        const { data,status } = await globalAPI.post('/api/User/SignUp', body,{
  headers: {
    "Content-Type": "multipart/form-data",
  }});
        // console.log(data,status);
        
        // console.log('SignUpHandler data = ', data,status);
  
        // if (status == 200) {
        //   dispatch<any>(loginHandler(data.data));
        // }
        cb && cb(data,status);
      } catch (error) {
          // console.log('SignUpHandler error = ', error);
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
      // console.log('CheckActivisonHandler data = ',Platform.OS, data, status);
      
      if (data.status == 200) {
         // console.log('CheckActivisonHandler success - user is valid');
         dispatch<any>(UserIsSeller(data.data));
         cb && cb(data, status);
      } else {
        // Session invalid - logout user
        // console.warn('⚠️ CheckActivison failed - invalid session, logging out:', data);
        dispatch<any>(logoutHandler({}));
        cb && cb(data, status);
      }
    } catch (error) {
      // API error (401, 403, network, etc.) - likely invalid session
      // console.error('❌ CheckActivison error - session invalid, logging out:', error);
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
        // console.log('====================================');
        // console.log(body);
        // console.log('====================================');
        const { data,status } = await globalAPI.post('/api/User/ChangePassword', body);
        // console.log(data,status);
        
        // console.log('ForgetPasswordHandler data = ', data,status);
  
        if (status == 200) {
          cb && cb(data,status);
        }
      } catch (error) {
          // console.log('ForgetPasswordHandler error = ', error);
        cb && cb(error,500);
      }
    };
  };

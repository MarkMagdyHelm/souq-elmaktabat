import { IReduser } from '../../Constants/interfaces';
import { ActionType } from '../actions/actions';

const initialState = {
  userdata: {},
  isLogin: false,
  gusterID: "",
  fcm: "",
  isSeller: false

};

export default (state = initialState, { type, payload }: IReduser) => {
  switch (type) {

    case ActionType.SET_GUSTER_ID:
      return { ...state, gusterID: payload };
    case ActionType.SAVE_USER_DATA:
      // console.log('🔄 Auth Reducer: SAVE_USER_DATA action', {
      //   previousUserdata: state.userdata,
      //   newPayload: payload,
      //   payloadKeys: payload ? Object.keys(payload) : [],
      // });
      return { ...state, userdata: payload };
    case ActionType.USER_LOGIN:
      return { ...state, isLogin: payload };
    case ActionType.USER_LOGOUT:
      return { ...state, isLogin: payload };
    case ActionType.SET_FCM_TOKEN:
      return { ...state, fcm: payload };
    case ActionType.USER_ISRESELLER:
      return { ...state, isSeller: payload };

    default:
      return state;
  }
};

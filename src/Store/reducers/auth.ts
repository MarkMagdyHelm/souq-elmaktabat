import { REHYDRATE } from 'redux-persist';
import { IReduser } from '../../Constants/interfaces';
import { deriveUserRoleFlags } from '../../Helper/userRole';
import { ActionType } from '../actions/actions';

const initialState = {
  userdata: {},
  isLogin: false,
  gusterID: '',
  fcm: '',
  isSeller: false,
  isAdmin: false,
};

const withRoleFlags = (state: typeof initialState, userdata: Record<string, unknown>) => {
  const flags = deriveUserRoleFlags(userdata);
  return {
    ...state,
    userdata,
    isSeller: flags.isSeller,
    isAdmin: flags.isAdmin,
  };
};

export default (state = initialState, action: IReduser) => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.SET_GUSTER_ID:
      return { ...state, gusterID: payload };

    case ActionType.SAVE_USER_DATA:
      return withRoleFlags(state, payload ?? {});

    case ActionType.USER_LOGIN:
      return { ...state, isLogin: payload };

    case ActionType.USER_LOGOUT:
      return {
        ...state,
        isLogin: payload,
        isSeller: false,
        isAdmin: false,
      };

    case ActionType.SET_FCM_TOKEN:
      return { ...state, fcm: payload };

    case ActionType.USER_ISRESELLER:
      // Legacy action: treat boolean as isSeller only; prefer SAVE_USER_DATA.
      if (typeof payload === 'boolean') {
        return { ...state, isSeller: payload };
      }
      return state;

    case REHYDRATE: {
      const inbound = (payload as { auth?: typeof initialState })?.auth;
      if (!inbound) {
        return state;
      }
      return withRoleFlags({ ...state, ...inbound }, inbound.userdata ?? {});
    }

    default:
      return state;
  }
};

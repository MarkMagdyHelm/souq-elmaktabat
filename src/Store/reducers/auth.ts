import { IReduser } from '../../Constants/interfaces';
import { ActionType } from '../actions/actions';

const initialState = {
  userdata:{},
  isLogin:false,
  gusterID: "",

};

export default (state = initialState, { type, payload }: IReduser) => {
  switch (type) {
   
    case ActionType.SET_GUSTER_ID:
      return { ...state, gusterID: payload };
      case ActionType.SAVE_USER_DATA:
        return { ...state, userdata: payload };
        case ActionType.USER_LOGIN:
          return { ...state, isLogin: payload };
          case ActionType.USER_LOGOUT:
          return { ...state, isLogin: payload };
    default:
      return state;
  }
};

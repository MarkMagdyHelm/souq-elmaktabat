import { IReduser } from '../../Constants/interfaces';
import { ActionType } from '../actions/actions';

const initialState = {
  appLoaded: false,
  darkmode: false,
  direction: 'rtl',
  langauge: 'ar',
  forceUpdate: false,

};

export default (state = initialState, { type, payload }: IReduser) => {
  switch (type) {
   
    case ActionType.CHANGE_APP_THEME:
      return { ...state, darkmode: payload };

    case ActionType.CHANGE_APP_DIRECTION:
      return { ...state, direction: payload };

    case ActionType.CHANGE_APP_LANGUAGE:
      return { ...state, langauge: payload };
    default:
      return state;
  }
};

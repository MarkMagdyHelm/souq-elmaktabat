import { IReduser } from '../../Constants/interfaces';
import { roles } from '../../Helper';
import { ActionType } from '../actions/actions';

const initialState = {
  appLoaded: false,
  darkmode: false,
  direction: 'rtl',
  langauge: 'ar',
  appSettings: [],
  forceUpdate: false,
  countries: [],
  activites: [],
  roles: [],
  tools: [],
  payments: [],
  rejectReasons: [],
  offerRequestStatus: []
};

export default (state = initialState, { type, payload }: IReduser) => {
  switch (type) {

    case ActionType.CHANGE_APP_THEME:
      return { ...state, darkmode: payload };

    case ActionType.CHANGE_APP_DIRECTION:
      return { ...state, direction: payload };

    case ActionType.CHANGE_APP_LANGUAGE:
      return { ...state, langauge: payload };
    case ActionType.SET_APP_SETTINGS:
      return { ...state, appSettings: payload };
    case ActionType.SET_FORCE_UPDATE:
      return { ...state, forceUpdate: payload };
    case ActionType.SAVE_COUNTRIES:
      return { ...state, countries: payload };
    case ActionType.SAVE_ACTIVITES:
      return { ...state, activites: payload };
    case ActionType.SAVE_TOOLS:
      return { ...state, tools: payload };
    case ActionType.SAVE_Roles:
      return { ...state, roles: payload };
    case ActionType.SAVE_PAYMENTS:
      return { ...state, payments: payload };
    case ActionType.SAVE_REJECT_REASONS:
      return { ...state, rejectReasons: payload };
        case ActionType.SAVE_OFFER_REQUEST_STATUS:
      return { ...state, offerRequestStatus: payload };
    default:
      return state;
  }
};

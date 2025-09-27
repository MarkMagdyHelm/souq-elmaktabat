import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema2 = yup.object().shape({

    
  City: yup
    .string()
    .required("You must pick a city!"),
    
  Area: yup
    .string()
    .required("You must pick a area!"),
  Addresses: yup
    .string()
    .required('Address is Required')
    .label('Address'),
});

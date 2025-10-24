import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema2 = yup.object().shape({
   
     City: yup
      .string()
    .required("You must pick a city!"),
      Area: yup
      .string()
    .required("You must pick a area!"),
      Activities: yup
      .array(),
       OtherPhoneNumbers: yup
       .string()
       .label('mobilenumber')
       .matches(phoneRegExp, 'It must be numbers and 11 digits')
       .min(11),
           Addresses: yup
           .string()
           .required('Address is Required')
           .label('Address'),
           ImageUrl: yup.object(),
});

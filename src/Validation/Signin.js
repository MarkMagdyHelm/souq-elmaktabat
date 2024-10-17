import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema = yup.object().shape({
    
    Password: yup
    .string()
    .required('Password is Required')
    .label('Password')
    // .matches(passwordRegExp, "Fail Passwords must be at least 6 characters.Passwords must have at least one digit ('0'-'9').")
    // .min(6)
    ,
    PhoneNumber: yup
    .string()
    .required('Mobile Number is Required')
    .label('mobilenumber')
    // .matches(phoneRegExp, 'It must be numbers and 11 digits')
    // .min(11)
});

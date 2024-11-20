import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema = yup.object().shape({
   
  email: yup.string()
//   .required('Email is required')
  .label('Email').email(),
  name: yup
    .string()
    // .required('Fullname is required')
    .label('Full Name')
    .min(2)
    .max(25),
    message: yup
    .string()
    .required('message is Required')
    .label('message')
    
});

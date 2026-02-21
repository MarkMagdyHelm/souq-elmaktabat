import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema = yup.object().shape({
   
  Email: yup.string()
  .required('Email is required')
  .label('Email').email(),   
});

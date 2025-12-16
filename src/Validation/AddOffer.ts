import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema2 = yup.object().shape({
   
    paperId: yup
      .string()
    .required("You must pick a paperId!"),
  
});

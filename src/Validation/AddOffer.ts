import * as yup from 'yup';
import {phoneRegExp, regexwight} from './regex';

export const validationSchema2 = yup.object().shape({
   
    paperId: yup
      .string()
    .required("You must pick a paperId!"),
    paperSizeId:yup
    .string()
  .required("You must pick a paper size!"),
    width:yup.string().required('width is Required')
    .matches(regexwight, 'It must be numbers'),
    width:yup.string().required('width is Required')
    .matches(regexwight, 'It must be numbers'),
    price:yup
    .string()
  .required("price is Required!"),
    description:yup.string()
});

import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema2 = yup.object().shape({
CompanyName: yup
    .string()
    .required('CompanyName is required')
    .label('CompanyName'),
    Description: yup
    .string()
    .required('Description is required')
    .label('Description'),
  ImageUrl: yup.object()
    .test(
      'is-required-and-not-empty',
      'Image is required',
      (value) => {
        return value && Object.keys(value).length > 0;
      }
    ),
    
  City: yup
    .string()
    .required("You must pick a city!"),
    
  Area: yup
    .string()
    .required("You must pick a area!"),
    
  Activities: yup
    .array() .required("You must choose a market!"),
      AvailableTools: yup
    .array() .required("You must pick a tools!"),
          PaymentTypes: yup
    .array() .required("You must choose  payments methods!"),
  Addresses: yup
    .string()
    .required('Address is Required')
    .label('Address'),
      ImageUrl2: yup.object()
    .test(
      'is-required-and-not-empty',
      'Image is required',
      (value) => {
        return value && Object.keys(value).length > 0;
      }
    ),
});

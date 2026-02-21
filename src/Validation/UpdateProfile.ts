import * as yup from "yup";
import { phoneRegExp } from "./regex";

export const UpdateProfile = yup.object().shape({
  Username: yup.string().required("Fullname is required").label('Username'),
  // .min(2)
  // .max(25),

  Phone: yup.string().required("Mobile is required").label('Phone')
   .matches(phoneRegExp, 'It must be numbers and 11 digits')
  .min(11),
  Email: yup.string().required('Email is required').label('Email'),

  CompanyName: yup.string().required('CompanyName is required').label('CompanyName'),
  Description: yup.string().required('Description is required').label('Description'),
  activity: yup.string().required("activity is required").label('activity'),
  servises: yup.string().required("servise is required").label('servises'),
  payment: yup.string().required("payment is required").label('payment'),
  // ImageUrl: yup.object()
  // .test(
  //   'is-required-and-not-empty',
  //   'Image is required',
  //   (value) => {
  //     return value && Object.keys(value).length > 0;
  //   }
  // ),

});
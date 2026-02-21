import * as yup from "yup";
import { phoneRegExp } from "./regex";

export const UpdateProfileUser = yup.object().shape({
  Username: yup.string().required("Fullname is required").label('Username'),
  // .min(2)
  // .max(25),

  Phone: yup.string().required("Mobile is required").label('Phone')
   .matches(phoneRegExp, 'It must be numbers and 11 digits')
  .min(11),
  Email: yup.string().required('Email is required').label('Email'),

  Governmen: yup.string().label('Governmen'),
  Area: yup.string().label('Area'),
  Market: yup.string().label('Market'),
  // ImageUrl: yup.object()
  // .test(
  //   'is-required-and-not-empty',
  //   'Image is required',
  //   (value) => {
  //     return value && Object.keys(value).length > 0;
  //   }
  // ),

});
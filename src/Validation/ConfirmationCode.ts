import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  
  Code: yup.string().required("VerificationCode is required").label('VerificationCode').min(4).max(4),
  })
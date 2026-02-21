import * as yup from 'yup';
export const ChangePassSchema = yup.object().shape({
    Password: yup.string().required('Password is Required').label('Password'),
    NewPassword: yup.string().required('NewPassword is required').label('NewPassword'),
    ConfirmPassword: yup
    .string()
    .required('ConfirmPassword is Required')
    .oneOf([yup.ref('NewPassword')], 'Passwords must match')
    .label('ConfirmPassword')
});
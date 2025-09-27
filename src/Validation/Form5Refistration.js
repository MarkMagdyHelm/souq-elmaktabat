import * as yup from 'yup';
import {phoneRegExp, passwordRegExp} from './regex';

export const validationSchema2 = yup.object().shape({
       OtherPhoneNumbers: yup
       .string()
       .label('mobilenumber')
       .matches(phoneRegExp, 'It must be numbers and 11 digits')
       .min(11),
});

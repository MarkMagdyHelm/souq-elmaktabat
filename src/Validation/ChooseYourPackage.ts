import * as yup from 'yup';
export const validationSchema = yup.object().shape({
    Capacity: yup.string().required('Capacity is Required').label('Capacity'),
    Amount: yup
    .string()
    .required('Amount is Required')
    .label('Amount')
});
import * as yup from "yup";

export const validationSchema = yup.object().shape({
  activity: yup
    .number()
    .required("quntity is required")
});
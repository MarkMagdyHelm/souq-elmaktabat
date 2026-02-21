import * as yup from "yup";

export const validationSchema = yup.object().shape({
  activity: yup
    .string()
    .required("Activity is required")
    .matches(
      /^[\p{Script=Arabic}A-Za-z]+$/u,
      "Activity must contain only letters (Arabic or English)"
    ),
});
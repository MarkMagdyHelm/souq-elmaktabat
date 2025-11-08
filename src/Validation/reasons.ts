import * as yup from "yup";

export const validationSchemaReasons = yup.object().shape({
  activity: yup
    .string()
    .matches(
      /^[\p{Script=Arabic}A-Za-z]+$/u,
      "Reasons must contain only letters (Arabic or English)"
    ),
});
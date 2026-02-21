import * as yup from "yup";

export const AddBranchSchema = yup.object().shape({
  countries: yup.string().required("countries is required").label('countries'),
  regions: yup.string().required("regions is required").label('regions')

});
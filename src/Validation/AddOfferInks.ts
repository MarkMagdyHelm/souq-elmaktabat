import * as yup from "yup";


export const AddOfferInks = yup.object().shape({
  InksType: yup.string().required("inkTypeRequired"),
  Brand: yup.string().required("brandRequired"),
  PaperQuntaity: yup.string().required("paperQuantityRequired"),
  PaperDescription: yup
    .string()
    .label("PaperDescription"),
  Branches: yup
    .string()
    .required("branchesRequired")
    .label("Branches"),
  Color: yup.string().required("colorRequired"),
  InksWidth: yup.string().required("inkCapacityRequired"),
  PaperPrice: yup.string().required("paperPriceRequired"),
  ImageUrl: yup
    .object()
    .nullable()
    .required("imageRequired"),
});
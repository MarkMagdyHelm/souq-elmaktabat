import * as yup from "yup";


export const AddOfferPrinter = yup.object().shape({
  PaperDescription: yup
    .string()
    .required("paperDescriptionRequired")
    .label("PaperDescription"),
  Branches: yup
    .string()
    .required("branchesRequired")
    .label("Branches"),
  PaperPrice: yup.string().required("paperPriceRequired"),
  PaperPrice1: yup.string().required("paperPriceRequired"),
  ImageUrl: yup
    .object()
    .nullable()
    .required("imageRequired"),
});
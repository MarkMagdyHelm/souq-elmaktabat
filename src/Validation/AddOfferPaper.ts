import * as yup from "yup";


export const AddOfferPaper = yup.object().shape({
  PaperType: yup.string().required("paperTypeRequired"),
  PaperQuntaity: yup.string().required("paperQuantityRequired"),
  PaperDescription: yup
    .string()
    .label("PaperDescription"),
  Branches: yup
    .string()
    .required("branchesRequired")
    .label("Branches"),
  PaperWidth: yup.string().required("paperWeightRequired"),
  PaperSize: yup.string().required("paperSizeRequired"),
  PaperPrice: yup.string().required("paperPriceRequired"),
});
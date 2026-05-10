import * as yup from "yup";


export const AddOfferPrinter = yup.object().shape({
  PaperDescription: yup
    .string()
    .label("PaperDescription"),
  Branches: yup
    .string()
    .required("branchesRequired")
    .label("Branches"),
  PaperPrice: yup.string().required("paperPriceRequired"),
  PaperPrice1: yup.string().required("paperPriceRequired"),
// ImageUrl: yup
//   .mixed()
//   .test("valid-image", "imageRequired", (value) => {
//     if (!value) return false;

//     // string case
//     if (typeof value === "string") return true;

//     // object case
//     if (typeof value === "object" && "uri" in value) return true;

//     return false;
//   })
});
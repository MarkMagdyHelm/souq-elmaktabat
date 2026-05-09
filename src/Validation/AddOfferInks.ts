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
  .mixed()
  .required("imageRequired")
  .test("valid-image", "imageRequired", (value) => {
    if (!value) return false;

    // string case
    if (typeof value === "string") return true;

    // object case
    if (typeof value === "object" && "uri" in value) return true;

    return false;
  })
});
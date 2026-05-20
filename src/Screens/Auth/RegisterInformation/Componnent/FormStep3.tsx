import React, { useContext, useEffect, useRef } from "react";
import { Pressable, Text, View, Platform, StyleSheet, Image } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema2 } from "../../../../Validation/Form3Refistration";
import Inputs from "../../../../Components/inputs";
import DropDowenMenu from "../../../../Components/DropDowenMenus/DropDowenMenu";
import MultiChekers from "../../../../Components/PopUps/MultiChekers";
import { ArrowDownIcon, ImageIcon } from "../../../../Assets/Svg";
import { ThemeContext } from "../../../../Constants/theming";
import { t } from "i18next";
import { IFont, ITheme } from "../../../../Constants/interfaces";
import { Colors, PixelPerfect } from "../../../../Constants/styleConstants";
import { openAPPCamera, openAPPPicker } from "../../../../Services/ImageCropPicker";
import FilterOrder from "../../../../Components/PopUps/FilterOrder";

const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]

type SyncStep3AddressesProps = {
  city: any;
  area: any;
  street: string;
  countries: any[];
  areas: any[];
  setstate: React.Dispatch<React.SetStateAction<any>>;
};

/** Updates only `addresses[0]` from Step 3; leaves additional rows (Step 4) unchanged. */
const SyncStep3Addresses = React.memo(function SyncStep3Addresses({
  city,
  area,
  street,
  countries,
  areas,
  setstate,
}: SyncStep3AddressesProps) {
  const prevFieldsRef = useRef<{ city: any; area: any; street: string } | null>(null);

  useEffect(() => {
    const prevFields = prevFieldsRef.current;
    const fieldsChanged =
      prevFields == null ||
      prevFields.city != city ||
      prevFields.area != area ||
      prevFields.street !== street;
    prevFieldsRef.current = { city, area, street };

    setstate((old) => {
      const list = old.addresses || [];
      const rest = list.slice(1);
      const first = list[0];

      if (!fieldsChanged) {
        if (rest.length > 0) {
          return old;
        }
        if (
          first &&
          first.Country != null &&
          first.Region != null &&
          String(first.Street ?? "").trim().length > 0
        ) {
          return old;
        }
      }

      const country = countries.find((el) => el.id == city);
      const region = areas.find((el) => el.id == area);
      const streetTrim = String(street ?? "").trim();
      if (!country || !region || !streetTrim) {
        return old;
      }

      const nextFirst = { Country: country, Region: region, Street: streetTrim };
      if (
        first &&
        first.Street === nextFirst.Street &&
        first.Country?.id == nextFirst.Country?.id &&
        first.Region?.id == nextFirst.Region?.id
      ) {
        return old;
      }

      return { ...old, addresses: [nextFirst, ...rest] };
    });
  }, [city, area, street, countries, areas, setstate]);

  return null;
});

type Props = {
  formikRef: React.RefObject<FormikProps<any>>;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
  GetAreas: (id: number) => void;
  countries: any[];
  tools: any[];
  activites: any[];
  styles: any;
  payments: any[];
  setActiveStep?: any
};

const FormStep3 = ({ formikRef, state, setstate, GetAreas, countries, tools, styles, activites, payments, setActiveStep }: Props) => {

  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styless = useStyles(Fonts, theme, dark, dir);
  const handleCameraPhotos = async (name) => {
    try {
      if (name == "Camera") {
        let file = await openAPPCamera();
        if (file) {
          if (state.whichimage == "logo") {
            formikRef?.current.setFieldValue("ImageUrl", file);
          } else {
            formikRef?.current.setFieldValue("ImageUrl2", file);
          }

        } else {
          if (state.whichimage == "logo") {
            if (!formikRef?.current?.values?.ImageUrl.hasOwnProperty("uri")) {
              formikRef?.current?.setFieldError("ImageUrl", 'Image is required')
            }
          } else {
            if (!formikRef?.current?.values?.ImageUrl2.hasOwnProperty("uri")) {
              formikRef?.current?.setFieldError("ImageUrl2", 'Image is required')
            }
          }
        }
      } else if (name == "Photos") {
        let file = await openAPPPicker();
        console.log('====================================');
        console.log(file);
        console.log('====================================');
        if (file) {
          if (state.whichimage == "logo") {
            formikRef?.current.setFieldValue("ImageUrl", file);
          } else {
            formikRef?.current.setFieldValue("ImageUrl2", file);
          }

        } else {
          if (state.whichimage == "logo") {
            if (!formikRef?.current?.values?.ImageUrl.hasOwnProperty("uri")) {
              formikRef?.current?.setFieldError("ImageUrl", 'Image is required')
            }
          } else {
            if (!formikRef?.current?.values?.ImageUrl2.hasOwnProperty("uri")) {
              formikRef?.current?.setFieldError("ImageUrl2", 'Image is required')
            }
          }
        }
      }
    } catch (error) {
      console.log('===================ssss=================');
      console.log(error);
      console.log('====================================');
      setstate(old => ({ ...old, commercialImage: [...state.commercialImage], ImageData: [...state.ImageData] }))
    }

  }
  return (
    <Formik
      validationSchema={validationSchema2}
      innerRef={formikRef}
      initialValues={{
        ImageUrl: {},
        Addresses: "",
        City: "",
        Area: "",
        Activities: "",
        ImageUrl2: {},
        AvailableTools: "",
        PaymentTypes: "",
        CompanyName: "",
        Description: ""
      }}
      onSubmit={() => { }}
    >
      {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError, values }) => {
        const handleSaveMarkets = (val: any) => {
          setFieldTouched("Activities");
          if (val?.length === 0) {
            setFieldError("Activities", "You must choose a market!");
          } else {
            setFieldValue("Activities", val);
            setstate((old) => ({
              ...old,
              selectedMarket: val,
              forms: { ...state.forms, Markets: "" },
            }));
          }
        };

        const handleCloseMarkets = () => {
          setstate((old) => ({
            ...old,
            shoMarkets: false,
          }));
        };

        const handleSaveTools = (val: any) => {
          setFieldTouched("AvailableTools");
          if (val?.length === 0) {
            setFieldError("AvailableTools", "You must choose a market!");
          } else {
            setFieldValue("AvailableTools", val);
            setstate((old) => ({
              ...old,
              selectedTools: val,
              forms: { ...state.forms, Tools: "" },
            }));
          }
        };

        const handleCloseTools = () => {
          setstate((old) => ({
            ...old,
            showTools: false,
          }));
        };

        const handleSavePayment = (val: any) => {
          setFieldTouched("PaymentTypes");
          if (val?.length === 0) {
            setFieldError("PaymentTypes", "You must choose a payment!");
          } else {
            setFieldValue("PaymentTypes", val);
            setstate((old) => ({
              ...old,
              selectedPayment: val,
              forms: { ...state.forms, payments: "" },
            }));
            console.log('=================hhhhh===================');
            console.log((formikRef?.current?.errors));
            console.log('====================================');
            if (!(formikRef?.current?.errors?.Addresses || formikRef?.current?.errors?.City || formikRef?.current?.errors?.Area)) {
              setActiveStep(3);
            }
          }
        };

        const handleClosePayment = () => {
          setstate((old) => ({
            ...old,
            showPayment: false,
          }));
        };

        return (
          <>
            <SyncStep3Addresses
              city={values.City}
              area={values.Area}
              street={values.Addresses}
              countries={countries}
              areas={state.areas}
              setstate={setstate}
            />
            <View style={styless.logoCon}>
              <Text style={styless.txtin}>{t('input1')}</Text>
              {values?.ImageUrl?.hasOwnProperty("uri") ?
                <Pressable
                  style={styles.imgcon}
                  onPress={() => {
                    setstate((old) => ({
                      ...old,
                      showFiltter: true,
                      whichimage: "logo"
                    }));
                  }}
                >
                  <Image
                    style={styless.img}
                    source={{ uri: `file:///${values?.ImageUrl?.uri}` }}
                  />
                </Pressable>
                : <Pressable style={styless.conIcon}
                  onPress={() => {
                    setstate((old) => ({
                      ...old,
                      showFiltter: true,
                      whichimage: "logo"
                    }));
                  }}
                >

                  <ImageIcon />
                </Pressable>}
              {errors.ImageUrl && touched.ImageUrl && <Text style={[styles.errorText, { marginTop: 7 }]}>{t(errors.ImageUrl as any)}</Text>}
            </View>
            <Inputs
              label={t("CompanyName")}
              options={{
                onBlur: handleBlur("CompanyName"),
                onChangeText: handleChange("CompanyName"),
                placeholder: t("CompanyNamew"),
                maxLength: 100,
              }}
              password={false}
              showErrorr={(errors.CompanyName && touched.CompanyName) as boolean}
              error={errors.CompanyName as any}
            />
            {/* Government */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {
setstate((old) => ({
  ...old,
  showArea: false,
  showGovernemnts: true,
  selectedArea:{ name: "", arName: "", id: "" },
}));
              }}
            >


              <Text style={[layout.textAlign, styles.label]}>{t("Government")}</Text>
              <View style={[layout.rowBox, styles.selectMenue]}>
                <Text style={styles.textselectmenu}>
                  {typeof state.selectedGoverenmet.id !== "string"
                    ? dir === "rtl"
                      ? state.selectedGoverenmet.arName
                      : state.selectedGoverenmet.name
                    : t("Governmentw")}
                </Text>
                <ArrowDownIcon />
              </View>
              {errors.City && touched.City && <Text style={styles.errorText}>{t(errors.City as any)}</Text>}
            </Pressable>

            {/* Area */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {

                if (!state.selectedGoverenmet.id) {
                  setstate((old) => ({
                    ...old,
                    showGovernemnts: false,
                    forms: { ...state.forms, City: "You must pick a city!" },
                  }));
                } else {
                  setstate((old) => ({ ...old, showArea: true }));
                }
              }}
            >
              <Text style={[layout.textAlign, styles.label]}>{t("Area")}</Text>
              <View style={[layout.rowBox, styles.selectMenue]}>
                <Text style={styles.textselectmenu}>
                  {typeof state.selectedArea.id !== "string"
                    ? dir === "rtl"
                      ? state.selectedArea.arName
                      : state.selectedArea.name
                    : t("Areaw")}
                </Text>
                <ArrowDownIcon />
              </View>
              {errors.Area && touched.Area && <Text style={styles.errorText}>{t(errors.Area as any)}</Text>}
            </Pressable>

            {/* Addresses */}
            <Inputs
              label={t("adress")}
              options={{
                onBlur: handleBlur("Addresses"),
                onChangeText: handleChange("Addresses"),
                numberOfLines: 2,
                placeholder: t("adressw"),
                maxLength: 250,
                keyboardType: "default",
                multiline: true,
              }}
              inputCon={{ height: 74, paddingTop: 17 }}
              input={{ height: 74, verticalAlign: "top" }}
              password={false}
              showErrorr={(errors.Addresses && touched.Addresses) as boolean}
              error={errors.Addresses as any}
            />

 {/* Market / Activities */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {

                setstate((old) => ({ ...old, shoMarkets: true }));
              }}
            >
              <Text style={[layout.textAlign, styles.label]}>{t("Actvity")}</Text>
              <View style={[layout.rowBox, styles.selectMenue]}>
                <Text
                  style={[
                    layout.textAlign,
                    styles.textselectmenu,
                    state.selectedMarket.length !== 0 && { width: "80%" },
                  ]}
                  numberOfLines={1}
                >
                  {state.selectedMarket.length !== 0
                    ? dir === "rtl"
                      ? state.selectedMarket.map((item: any) => item.arName).join(",")
                      : state.selectedMarket.map((item: any) => item.name).join(",")
                    : t("Actvityw")}
                </Text>
                <ArrowDownIcon />
              </View>
              {errors.Activities && touched.Activities && (
                <Text style={styles.errorText}>{t(errors.Activities as any)}</Text>
              )}
            </Pressable>

            {/* Tools / Activities */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {

                setstate((old) => ({ ...old, showTools: true }));
              }}
            >
              <Text style={[layout.textAlign, styles.label]}>{t("Tools")}</Text>
              <View style={[layout.rowBox, styles.selectMenue]}>
                <Text
                  style={[
                    layout.textAlign,
                    styles.textselectmenu,
                    state.selectedTools.length !== 0 && { width: "90%" },
                  ]}
                  numberOfLines={1}
                >
                  {state.selectedTools.length !== 0
                    ? dir === "rtl"
                      ? state.selectedTools.map((item: any) => item.arName).join(",")
                      : state.selectedTools.map((item: any) => item.name).join(",")
                    : t("Toolsw")}
                </Text>
                <ArrowDownIcon />
              </View>
              {errors.AvailableTools && touched.AvailableTools && (
                <Text style={styles.errorText}>{t(errors.AvailableTools as any)}</Text>
              )}
            </Pressable>

           

            {/* registration comercial */}
            <Pressable style={styless.registerCon} onPress={() => {
              setstate((old) => ({
                ...old,
                showFiltter: true,
                whichimage: "comercial"
              }));
            }}>
              <Text style={[layout.textAlign, styless.txtin, { marginBottom: PixelPerfect(8) }]}>{t('redestratincom')}</Text>
              <View style={styless.imageCon}>
                {values?.ImageUrl2?.hasOwnProperty("uri") ?

                  <Image
                    style={styless.img2}
                    source={{ uri: `file:///${values?.ImageUrl2?.uri}` }}
                  />
                  :
                  <>
                    <ImageIcon />
                    <Text style={styless.textimage}>{t('addImage')}</Text>
                  </>

                }
              </View>
              {errors.ImageUrl2 && touched.ImageUrl2 && <Text style={[styles.errorText, { marginTop: 7 }]}>{t(errors.ImageUrl2 as any)}</Text>}
            </Pressable>

            {/* Description */}
            <Inputs
              label={t("Description")}
              options={{
                onBlur: handleBlur("Description"),
                onChangeText: handleChange("Description"),
                numberOfLines: 2,
                placeholder: t("Descriptionw"),
                maxLength: 250,
                keyboardType: "default",
                multiline: true,
              }}
              inputCon={{ height: 74, paddingTop: 17 }}
              input={{ height: 74, verticalAlign: "top" }}
              password={false}
              showErrorr={(errors.Description && touched.Description) as boolean}
              error={errors.Description as any}
            />
            {/* Payments  */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {

                setstate((old) => ({ ...old, showPayment: true }));
              }}
            >
              <Text style={[layout.textAlign, styles.label]}>{t("payments")}</Text>
              <View style={[layout.rowBox, styles.selectMenue]}>
                <Text
                  style={[
                    layout.textAlign,
                    styles.textselectmenu,
                    state.selectedPayment.length !== 0 && { width: "80%" },
                  ]}
                  numberOfLines={1}
                >
                  {state.selectedPayment.length !== 0
                    ? dir === "rtl"
                      ? state.selectedPayment.map((item: any) => item.name).join(",")
                      : state.selectedPayment.map((item: any) => item.name).join(",")
                    : t("paymentsw")}
                </Text>
                <ArrowDownIcon />
              </View>
              {errors.PaymentTypes && touched.PaymentTypes && (
                <Text style={styles.errorText}>{t(errors.PaymentTypes as any)}</Text>
              )}
            </Pressable>

            {/* Government dropdown */}
            {state.showGovernemnts && (
              <DropDowenMenu
                onCloseFn={(val) => {
                  setFieldTouched("City");
                  if (typeof val?.id === "string") {
                    setstate((old) => ({
                      ...old,
                      showGovernemnts: false,
                      forms: { ...state.forms, City: "You must pick a city!" },
                    }));
                    setFieldError("City", "You must pick a city!");
                  } else {
                    setFieldValue("City", val.id);
                    GetAreas(val.id);
                    setstate((old) => ({
                      ...old,
                      showGovernemnts: false,
                      selectedGoverenmet: val,
                      forms: { ...state.forms, City: "" },
                    }));
                  }
                }}
                title={t("Choose City")}
                currentFilter={state.selectedGoverenmet}
                items={countries}
                style={{ flex: 0.7 }}
              />
            )}

            {/* Area dropdown */}
            {state.showArea && state.areas.length !== 0 && (
              <DropDowenMenu
                onCloseFn={(val) => {

                  setFieldTouched("Area");
                  if (typeof val?.id === "string") {
                    setstate((old) => ({
                      ...old,
                      showArea: false,
                      forms: { ...state.forms, Area: "You must pick a area!" },
                    }));
                    setFieldError("Area", "You must pick a area!");
                  } else {
                    setFieldValue("Area", val.id);
                    setstate((old) => ({
                      ...old,
                      showArea: false,
                      selectedArea: val,
                      forms: { ...state.forms, Area: "" },
                    }));
                  }
                }}
                title={t("Choose Area")}
                currentFilter={state.selectedArea}
                items={state.areas}
                style={{ flex: 0.7 }}
              />
            )}

            {/* Market MultiSelect */}
            {state.shoMarkets && (
              <MultiChekers
                onSaveFn={handleSaveMarkets}
                onCloseFn={handleCloseMarkets}
                title={t("Actvityw")}
                currentFilter={state.selectedMarket}
                items={activites}
                style={{ flex: 0.6 }}
                type={"activities"}
                hasTextInput={true}
                textinputTitle={t('marketwwww')}
              />
            )}

            {/* Tools MultiSelect */}
            {state.showTools && (
              <MultiChekers
                onSaveFn={handleSaveTools}
                onCloseFn={handleCloseTools}
                title={t("Toolsw")}
                currentFilter={state.selectedTools}
                items={tools}
                style={{ flex: 0.6 }}
                type={"tools"}
                hasTextInput={true}
                textinputTitle={t('toolswww')}
              />
            )}

            {/* PaymentMethode MultiSelect */}
            {state.showPayment && (
              <MultiChekers
                onSaveFn={handleSavePayment}
                onCloseFn={handleClosePayment}
                title={t("payments")}
                currentFilter={state.selectedPayment}
                items={payments}
                style={{ flex: 0.4 }}
                type={"payments"}
                hasTextInput={false}
              />
            )}

            {state.showFiltter && <FilterOrder
              title={t('Filter')}
              items={filterOption}
              currentFilter={filterOption}
              onCloseFn={(val) => {
                if (state.whichimage == "logo") {
                  setFieldTouched("ImageUrl")
                } else {
                  setFieldTouched("ImageUrl2")
                }
                setstate(old => ({ ...old, showFiltter: false }))
                setTimeout(() => {
                  handleCameraPhotos(val.Name);

                }, 300);
              }}
            />}
          </>
        )
      }}

    </Formik>
  );
};

export default FormStep3;


const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
  StyleSheet.create({
    logoCon: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: PixelPerfect(23)
    },
    txtin: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(18),
      color: theme.black,
      lineHeight: 24
    },
    conIcon: {
      alignItems: "center",
      justifyContent: "center",
      width: PixelPerfect(64),
      height: PixelPerfect(64),
      borderRadius: PixelPerfect(64) / 2,
      backgroundColor: theme.gray2,
      marginTop: PixelPerfect(4)
    },
    registerCon: {
      marginBottom: PixelPerfect(20),
    },
    imageCon: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.white,
      borderRadius: PixelPerfect(8),
      paddingVertical: PixelPerfect(9)
    },
    textimage: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(16),
      color: theme.deactive,
      marginTop: PixelPerfect(4)
    },
    imgcon: {

      width: PixelPerfect(64),
      height: PixelPerfect(64),
    },
    img: {
      width: PixelPerfect(64),
      height: PixelPerfect(64),
      borderRadius: PixelPerfect(64) / 2,
    },
    img2: {
      width: PixelPerfect(50),
      height: PixelPerfect(50),
      borderRadius: PixelPerfect(6),
    }
  });
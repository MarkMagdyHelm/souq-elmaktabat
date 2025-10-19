import React, { useContext } from "react";
import { Pressable, Text, View, Platform, Image, StyleSheet } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema2 } from "../../../../Validation/Form2Refistration";
import Inputs from "../../../../Components/inputs";
import DropDowenMenu from "../../../../Components/DropDowenMenus/DropDowenMenu";
import MultiChekers from "../../../../Components/PopUps/MultiChekers";
import { ArrowDownIcon, ImageIcon } from "../../../../Assets/Svg";
import { ThemeContext } from "../../../../Constants/theming";
import { t } from "i18next";
import { openAPPCamera, openAPPPicker } from "../../../../Services/ImageCropPicker";
import FilterOrder from "../../../../Components/PopUps/FilterOrder";
import { PixelPerfect } from "../../../../Constants/styleConstants";
import { IFont, ITheme } from "../../../../Constants/interfaces";
const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]

type Props = {
  formikRef: React.RefObject<FormikProps<any>>;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
  GetAreas: (id: number) => void;
  countries: any[];
  activites: any[];
  styles: any;
};

const FormStep2 = ({ formikRef, state, setstate, GetAreas, countries, activites, styles }: Props) => {
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styless = useStyles(Fonts, theme, dark, dir);
    

  const handleCameraPhotos = async (name) => {
    try {
      if (name == "Camera") {
        let file = await openAPPCamera();
        if (file) {
          if (state.whichimage == "logo") {
            // formikRef?.current.setFieldValue("ImageUrl", file);
          }

        } else {
          if (state.whichimage == "logo") {
            if (!formikRef?.current?.values?.ImageUrl.hasOwnProperty("uri")) {
              // formikRef?.current?.setFieldError("ImageUrl", 'Image is required')
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
          } 

        } else {
          if (state.whichimage == "logo") {
            if (!formikRef?.current?.values?.ImageUrl.hasOwnProperty("uri")) {
              // formikRef?.current?.setFieldError("ImageUrl", 'Image is required')
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
        OtherPhoneNumbers: "",
        Activities: "",
      }}
      onSubmit={() => { }}
    >
      {({ handleChange, handleBlur, errors, touched, setFieldValue, values,setFieldTouched, setFieldError }) => (
        <>
                    <View style={styless.logoCon}>
                      <Text style={styless.txtin}>{t('inputimg1')}</Text>
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
                    </View>
          {/* Government */}
          <Pressable
            style={styles.selectMenueCon}
            onPress={() => {
              setFieldTouched("City");
              setstate((old) => ({ ...old, showGovernemnts: true }));
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
              setFieldTouched("Area");
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
              setFieldTouched("Activities");
              setstate((old) => ({ ...old, shoMarkets: true }));
            }}
          >
            <Text style={[layout.textAlign, styles.label]}>{t("Market")}</Text>
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
                  : t("Marketw")}
              </Text>
              <ArrowDownIcon />
            </View>
            {errors.Activities && touched.Activities && (
              <Text style={styles.errorText}>{t(errors.Activities as any)}</Text>
            )}
          </Pressable>

          {/* Other Phone */}
          <Inputs
            label={t("otherPhoneNumber")}
            options={{
              onBlur: handleBlur("OtherPhoneNumbers"),
              onChangeText: handleChange("OtherPhoneNumbers"),
              placeholder: t("otherPhoneNumberw"),
              maxLength: 11,
              keyboardType: Platform.OS === "android" ? "numeric" : "number-pad",
            }}
            password={false}
            isPhone={true}
            input={{ width: "73%" }}
            showErrorr={(errors.OtherPhoneNumbers && touched.OtherPhoneNumbers) as boolean}
            error={errors.OtherPhoneNumbers as any}
          />

          {/* Government dropdown */}
          {state.showGovernemnts && (
            <DropDowenMenu
              onCloseFn={(val) => {
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
              onCloseFn={(val) => {
                if (val?.length === 0) {
                  setFieldError("Activities", "You must choose a market!");
                  setstate((old) => ({
                    ...old,
                    shoMarkets: false,
                  }));
                } else {
                  setFieldValue("Activities", val);
                  setstate((old) => ({
                    ...old,
                    shoMarkets: false,
                    selectedMarket: val,
                    forms: { ...state.forms, Markets: "" },
                  }));
                }
              }}
              title={t("Marketw")}
              currentFilter={state.selectedMarket}
              items={activites}
              style={{ flex: 0.6 }}
              type="activities"
              hasTextInput={true}
              textinputTitle={t('marketwwww')}
            />
          )}

          {state.showFiltter && <FilterOrder
              title={t('Filter')}
              items={filterOption}
              currentFilter={filterOption}
              onCloseFn={(val) => {
                if (state.whichimage == "logo") {
                  setFieldTouched("ImageUrl")
                }
                setstate(old => ({ ...old, showFiltter: false }))
                setTimeout(() => {
                  handleCameraPhotos(val.Name);

                }, 300);
              }}
            />}
        </>
      )}
    </Formik>
  );
};

export default FormStep2;
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
    img: {
      width: PixelPerfect(64),
      height: PixelPerfect(64),
      borderRadius: PixelPerfect(64) / 2,
    }
  });
import React, { useContext, useState } from "react";
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
import { EMPTY_LOCATION, onAreaSelected, onGovernmentSelected, SyncAreaSelection, canShowAreaDropdown } from "./locationSelectionHelpers";
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
  const [uri, setUri] = useState("");

  const handleCameraPhotos = async (name: string) => {
    try {
      let file = null;

      if (name === "Camera") {
        file = await openAPPCamera();
      } else if (name === "Photos") {
        file = await openAPPPicker();
      }

      console.log('Selected image file:', file);
      console.log('Image URI:', file?.uri);

      if (file?.uri) {
        setUri(file.uri);
        console.log('Updated uri preview =', file.uri);
        
        formikRef.current?.setFieldValue("ImageUrl", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
        formikRef.current?.setFieldTouched("ImageUrl", true);
        
        console.log('ImageUrl set in Formik:', { uri: file.uri, type: file.type, name: file.name });
      } else {
        formikRef.current?.setFieldError(
          "ImageUrl",
          "Image is required"
        );
      }
    } catch (error) {
      console.log('Image selection error:', error);
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
      {({ handleChange, handleBlur, errors, touched, setFieldValue, values,setFieldTouched, setFieldError }) => {
        const governmentId = state.selectedGoverenmet.id;
        const { areas: areaOptions, isLoading: areasLoading, canOpen: canOpenAreas } = canShowAreaDropdown(
          state.areasByCountryId,
          governmentId,
          state.loadingAreasCountryId,
        );

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
       return (
          <>
            <SyncAreaSelection
              areaId={values.Area}
              areas={areaOptions}
              setFieldValue={setFieldValue}
              setSharedState={setstate}
            />
            <View style={styless.logoCon}>
              <Text style={styless.txtin}>{t('inputimg1')}</Text>
              {values?.ImageUrl?.uri || uri ?
                <Pressable
                  style={styles.imgcon}
                  onPress={() => {
                    setstate((old) => ({
                      ...old,
                      showFiltter: true,
                      whichimage: "logo"
                    }));
                  } }
                >
                  <Image
                    style={styless.img}
                    source={{ uri: uri || values?.ImageUrl?.uri }} />
                </Pressable>
                : <Pressable style={styless.conIcon}
                  onPress={() => {
                    setstate((old) => ({
                      ...old,
                      showFiltter: true,
                      whichimage: "logo"
                    }));
                  } }
                >

                  <ImageIcon />
                </Pressable>}
            </View>
            {/* Government */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {
                setFieldTouched("City");
                setstate((old) => ({
                  ...old,
                  showArea: false,
                  showGovernemnts: true,
                }));
              } }
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
                if (!governmentId) {
                  setstate((old) => ({
                    ...old,
                    showGovernemnts: false,
                    forms: { ...old.forms, City: "You must pick a city!" },
                  }));
                } else if (areasLoading) {
                  return;
                } else if (!canOpenAreas) {
                  GetAreas(Number(governmentId));
                } else {
                  setstate((old) => ({ ...old, showArea: true }));
                }
              } }
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
              error={errors.Addresses as any} />

            {/* Market / Activities */}
            <Pressable
              style={styles.selectMenueCon}
              onPress={() => {
                setFieldTouched("Activities");
                setstate((old) => ({ ...old, shoMarkets: true }));
              } }
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
              error={errors.OtherPhoneNumbers as any} />

            {/* Government dropdown */}
            {state.showGovernemnts && (
              <DropDowenMenu
                onCloseFn={(val) => {
                  const result = onGovernmentSelected({
                    val,
                    prevCityId: values.City,
                    setFieldValue,
                    setFieldError,
                    getAreas: GetAreas,
                  });
                  if (result === "invalid") {
                    setstate((old) => ({
                      ...old,
                      showGovernemnts: false,
                      forms: { ...old.forms, City: "You must pick a city!" },
                    }));
                  } else {
                    setstate((old) => ({
                      ...old,
                      showGovernemnts: false,
                      showArea: false,
                      selectedGoverenmet: result.government,
                      selectedArea: result.clearArea ? EMPTY_LOCATION : old.selectedArea,
                      forms: {
                        ...old.forms,
                        City: "",
                        ...(result.clearArea ? { Area: "" } : {}),
                      },
                    }));
                  }
                } }
                title={t("Choose City")}
                currentFilter={state.selectedGoverenmet}
                items={countries}
                style={{ flex: 0.7 }} />
            )}

            {/* Area dropdown */}
            {state.showArea && canOpenAreas && (
              <DropDowenMenu
                key={`area-${governmentId}`}
                onCloseFn={(val) => {
                  const result = onAreaSelected({ val, setFieldValue, setFieldError });
                  if (result === "invalid") {
                    setstate((old) => ({
                      ...old,
                      showArea: false,
                      forms: { ...old.forms, Area: "You must pick a area!" },
                    }));
                  } else {
                    setstate((old) => ({
                      ...old,
                      showArea: false,
                      selectedArea: result,
                      forms: { ...old.forms, Area: "" },
                    }));
                  }
                } }
                title={t("Choose Area")}
                currentFilter={state.selectedArea}
                items={areaOptions}
                style={{ flex: 0.7 }} />
            )}

            {/* Market MultiSelect */}
            {state.shoMarkets && (
              <MultiChekers
                onSaveFn={handleSaveMarkets}
                onCloseFn={handleCloseMarkets}
                title={t("Marketw")}
                currentFilter={state.selectedMarket}
                items={activites}
                style={{ flex: 0.6 }}
                type="activities"
                hasTextInput={true}
                textinputTitle={t('marketwwww')} />
            )}

            {state.showFiltter && <FilterOrder
              title={t('Filter')}
              items={filterOption}
              currentFilter={filterOption}
              onCloseFn={(val) => {
                if (state.whichimage == "logo") {
                  setFieldTouched("ImageUrl");
                }
                setstate(old => ({ ...old, showFiltter: false }));
                setTimeout(() => {
                  handleCameraPhotos(val.Name);

                }, 300);
              } } />}
          </>
        );
      }}
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
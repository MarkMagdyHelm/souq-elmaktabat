import React, { useContext } from "react";
import { Pressable, Text, View, Platform } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema2 } from "../../../../Validation/Form2Refistration";
import Inputs from "../../../../Components/inputs";
import DropDowenMenu from "../../../../Components/DropDowenMenus/DropDowenMenu";
import MultiChekers from "../../../../Components/PopUps/MultiChekers";
import { ArrowDownIcon } from "../../../../Assets/Svg";
import { ThemeContext } from "../../../../Constants/theming";
import { t } from "i18next";

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
  const { layout, dir } = useContext(ThemeContext);

  return (
    <Formik
      validationSchema={validationSchema2}
      innerRef={formikRef}
      initialValues={{
        Addresses: "",
        City: "",
        Area: "",
        OtherPhoneNumbers: "",
        Activities: "",
      }}
      onSubmit={() => {}}
    >
      {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => (
        <>
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
            />
          )}
        </>
      )}
    </Formik>
  );
};

export default FormStep2;

import React, { useContext, useState } from "react";
import { Pressable, Text, View, Platform, StyleSheet } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema2 } from "../../../../Validation/Form5Refistration";
import Inputs from "../../../../Components/inputs";
import { ThemeContext } from "../../../../Constants/theming";
import { t } from "i18next";
import { IFont, ITheme } from "../../../../Constants/interfaces";
import { PixelPerfect } from "../../../../Constants/styleConstants";
import Button from "../../../../Components/touchables/Button";

type Props = {
  formikRef: React.RefObject<FormikProps<any>>;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
  styles: any;
  otherPhones: any[]
};

const FormStep5 = ({ formikRef, state, setstate, styles, otherPhones }: Props) => {
  const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
  const styless = useStyles(Fonts, theme, dark, dir);
  const [showForm, setshowForm] = useState(true);
  console.log('====================================');
  console.log(state.otherPhones);
  console.log('====================================');
  return (
    <Formik
      validationSchema={validationSchema2}
      innerRef={formikRef}
      initialValues={{
        OtherPhoneNumbers: "",
      }}
      onSubmit={(values) => { 
         setstate((old) => ({
                    ...old,
                      otherPhones: [...(old.otherPhones || []), values.OtherPhoneNumbers]
                }));
                 formikRef.current.setFieldValue("OtherPhoneNumbers", "")
                     formikRef.current.setFieldError("OtherPhoneNumbers", "")
                       formikRef.current.setFieldTouched("OtherPhoneNumbers", false)
                        setshowForm(false) 
      }}
    >
      {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError, handleSubmit }) => {
        console.log('====================================');
        console.log(errors);
        console.log('====================================');
        return(
        <>
        {
                                    state.otherPhones.map((el, index) => (
                                        <View key={`index-${index}`} style={styless.adressCon}>
                                            <Text style={[layout.textAlign, styless.countryText]}>+2{el}</Text>
                                        </View>
                                    ))
                                }
          {!showForm &&
            <Button
              title={t('regtxt7')}
              styleTitle={styless.buttonText}
              onPress={() => { setshowForm(true) }}
              style={styless.button}
            />}
          {showForm &&
            <View style={styless.formCon}>
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
              <Button
                title={t('Save')}
                styleTitle={styless.buttonText}
                onPress={handleSubmit}
                style={styless.button}
              />
            </View>
          }
        </>
      )}}
    </Formik>
  );
};

export default FormStep5;
const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
  StyleSheet.create({
    adressCon: {
      paddingVertical: PixelPerfect(8),
      borderBottomColor: theme.black,
      borderBottomWidth: PixelPerfect(0.7)
    },
    countryText: {
      fontFamily: Fonts.medium,
      fontSize: PixelPerfect(20),
      color: theme.black,
      lineHeight: 25
    },
    streetText: {
      fontFamily: Fonts.regular,
      fontSize: PixelPerfect(18),
      color: theme.black,
      lineHeight: 25
    },
    button: {
      backgroundColor: theme.white,
      height: PixelPerfect(50),
      alignItems: "center",
      justifyContent: "center",
      marginTop: PixelPerfect(16),
      borderWidth: PixelPerfect(0.7),
      borderColor: theme.textColor,
    },
    buttonText: {
      fontFamily: Fonts.bold,
      fontSize: PixelPerfect(18),
      color: theme.textColor,
    },
    formCon: {
      marginTop: PixelPerfect(8)
    }
  });
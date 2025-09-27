import React, { useContext, useEffect, useState } from "react";
import { Pressable, Text, View, Platform, StyleSheet, Image } from "react-native";
import { Formik, FormikProps } from "formik";
import { validationSchema2 } from "../../../../Validation/Form4Refistration";
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
import Button from "../../../../Components/touchables/Button";

const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]


type Props = {
    formikRef: React.RefObject<FormikProps<any>>;
    state: any;
    setstate: React.Dispatch<React.SetStateAction<any>>;
    GetAreas: (id: number) => void;
    countries: any[];
    addresses: any[];
    styles: any;
    setActiveStep?: any
};

const FormStep4 = ({ formikRef, state, setstate, GetAreas, countries, addresses, styles, setActiveStep }: Props) => {

    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styless = useStyles(Fonts, theme, dark, dir);
    // const [addreses, setaddreses] = useState(addresses);
    const [showForm, setshowForm] = useState(false);
    const [State, setState] = useState({
        selectedGoverenmet: { name: "", arName: "", id: "" },
        selectedArea: { name: "", arName: "", id: "" },
        showGovernemnts: false,
        showArea: false,
        forms: { City: "", Role: "", Area: "", Markets: "", agreesonTerms: "", Tools: "", payments: "" },
    })

    console.log('================xxxx====================');
    console.log(addresses);
    console.log('====================================');
    return (
        <Formik
            validationSchema={validationSchema2}
            innerRef={formikRef}
            initialValues={{
                Addresses: "",
                City: "",
                Area: "",
            }}
            onSubmit={(values) => {
                setstate((old) => ({
                    ...old,
                    addresses: [
                        ...(old.addresses || []), // Fixed typo and added fallback
                        {
                            Country: countries?.find(el => el.id == values?.City) || null,
                            Region: state.areas?.find(el => el.id == values?.Area) || null,
                            Street: values?.Addresses || ''
                        }
                    ]
                }));
                setState((old) => ({
                    ...old,
                    selectedGoverenmet: { name: "", arName: "", id: "" },
                    selectedArea: { name: "", arName: "", id: "" },
                }));
                formikRef.current.setFieldValue("City", "")
                formikRef.current.setFieldValue("Area", "")
                formikRef.current.setFieldValue("Addresses", "")
                formikRef.current.setFieldError("City", "")
                formikRef.current.setFieldError("Area", "")
                formikRef.current.setFieldError("Addresses", "")
                formikRef.current.setFieldTouched("City", false)
                formikRef.current.setFieldTouched("Area", false)
                formikRef.current.setFieldTouched("Addresses", false)
                setshowForm(false)
            }}
        >
            {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError, values, handleSubmit }) => {

                return (
                    <>
                        {
                            addresses.map((el, index) => (
                                <View key={`index-${index}`} style={styless.adressCon}>
                                    <Text style={[layout.textAlign, styless.countryText]}>{dir === "rtl" ? el?.Country?.arName : el?.Country?.name} / {dir === "rtl" ? el?.Region?.arName : el?.Region?.name}</Text>
                                    <Text style={[layout.textAlign, styless.streetText]}>{el?.Street}</Text>
                                </View>
                            ))
                        }
                        {!showForm &&
                            <Button
                                title={t('regtxt5')}
                                styleTitle={styless.buttonText}
                                onPress={() => { setshowForm(true) }}
                                style={styless.button}
                            />}

                        {
                            showForm &&
                            <View style={styless.formCon}>
                                {/* Government */}
                                <Pressable
                                    style={styles.selectMenueCon}
                                    onPress={() => {

                                        setState((old) => ({ ...old, showGovernemnts: true }));
                                    }}
                                >


                                    <Text style={[layout.textAlign, styles.label]}>{t("Government")}</Text>
                                    <View style={[layout.rowBox, styles.selectMenue]}>
                                        <Text style={styles.textselectmenu}>
                                            {typeof State.selectedGoverenmet.id !== "string"
                                                ? dir === "rtl"
                                                    ? State.selectedGoverenmet.arName
                                                    : State.selectedGoverenmet.name
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

                                        if (!State.selectedGoverenmet.id) {
                                            setState((old) => ({
                                                ...old,
                                                showGovernemnts: false,
                                                forms: { ...State.forms, City: "You must pick a city!" },
                                            }));
                                        } else {
                                            setState((old) => ({ ...old, showArea: true }));
                                        }
                                    }}
                                >
                                    <Text style={[layout.textAlign, styles.label]}>{t("Area")}</Text>
                                    <View style={[layout.rowBox, styles.selectMenue]}>
                                        <Text style={styles.textselectmenu}>
                                            {typeof State.selectedArea.id !== "string"
                                                ? dir === "rtl"
                                                    ? State.selectedArea.arName
                                                    : State.selectedArea.name
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
                                {/* Government dropdown */}
                                {State.showGovernemnts && (
                                    <DropDowenMenu
                                        onCloseFn={(val) => {
                                            setFieldTouched("City");
                                            if (typeof val?.id === "string") {
                                                setState((old) => ({
                                                    ...old,
                                                    showGovernemnts: false,
                                                    forms: { ...State.forms, City: "You must pick a city!" },
                                                }));
                                                setFieldError("City", "You must pick a city!");
                                            } else {
                                                setFieldValue("City", val.id);
                                                GetAreas(val.id);
                                                setState((old) => ({
                                                    ...old,
                                                    showGovernemnts: false,
                                                    selectedGoverenmet: val,
                                                    forms: { ...State.forms, City: "" },
                                                }));
                                            }
                                        }}
                                        title={t("Choose City")}
                                        currentFilter={State.selectedGoverenmet}
                                        items={countries}
                                        style={{ flex: 0.7 }}
                                    />
                                )}

                                {/* Area dropdown */}
                                {State.showArea && state.areas.length !== 0 && (
                                    <DropDowenMenu
                                        onCloseFn={(val) => {

                                            setFieldTouched("Area");
                                            if (typeof val?.id === "string") {
                                                setState((old) => ({
                                                    ...old,
                                                    showArea: false,
                                                    forms: { ...State.forms, Area: "You must pick a area!" },
                                                }));
                                                setFieldError("Area", "You must pick a area!");
                                            } else {
                                                setFieldValue("Area", val.id);
                                                setState((old) => ({
                                                    ...old,
                                                    showArea: false,
                                                    selectedArea: val,
                                                    forms: { ...State.forms, Area: "" },
                                                }));
                                            }
                                        }}
                                        title={t("Choose Area")}
                                        currentFilter={State.selectedArea}
                                        items={state.areas}
                                        style={{ flex: 0.7 }}
                                    />

                                )}
                                <Button
                                    title={t('Save')}
                                    styleTitle={styless.buttonText}
                                    onPress={handleSubmit}
                                    style={styless.button}
                                />
                            </View>
                        }
                    </>
                )
            }}

        </Formik>
    );
};

export default FormStep4;


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
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
import { EMPTY_LOCATION, onAreaSelected, onGovernmentSelected, SyncAreaSelection, canShowAreaDropdown } from "./locationSelectionHelpers";
import { canAddAddress, MAX_ADDRESSES } from "./addressHelpers";

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

    useEffect(() => {
        if (!canAddAddress(addresses)) {
            setshowForm(false);
        }
    }, [addresses.length]);

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
                const street = (values?.Addresses ?? "").trim();
                const country = countries?.find((el) => el.id == values?.City);
                const region = state.areasByCountryId?.[values?.City]?.find((el) => el.id == values?.Area);
                if (!country || !region || !street) {
                    return;
                }
                const newEntry = { Country: country, Region: region, Street: street };
                let appended = false;
                setstate((old) => {
                    const prev = old.addresses || [];
                    if (prev.length >= MAX_ADDRESSES) {
                        return old;
                    }
                    const dup = prev.some(
                        (a) =>
                            a?.Country?.id == country.id &&
                            a?.Region?.id == region.id &&
                            (a?.Street ?? "").trim() === street
                    );
                    if (dup) {
                        return old;
                    }
                    appended = true;
                    return { ...old, addresses: [...prev, newEntry] };
                });
                if (!appended) {
                    return;
                }
                setState((old) => ({
                    ...old,
                    selectedArea: { name: "", arName: "", id: "" },
                }));
                const f = formikRef.current;
                if (f) {
                    f.setFieldValue("Area", "");
                    f.setFieldValue("Addresses", "");
                    f.setFieldError("Area", undefined as any);
                    f.setFieldError("Addresses", undefined as any);
                    f.setFieldTouched("Area", false);
                    f.setFieldTouched("Addresses", false);
                }
                setshowForm(false);
            }}
        >
            {({ handleChange, handleBlur, errors, touched, setFieldValue, setFieldTouched, setFieldError, values, handleSubmit }) => {
                const governmentId = State.selectedGoverenmet.id;
                const { areas: areaOptions, isLoading: areasLoading, canOpen: canOpenAreas } = canShowAreaDropdown(
                    state.areasByCountryId,
                    governmentId,
                    state.loadingAreasCountryId,
                );
                const canAddMoreAddresses = canAddAddress(addresses);

                return (
                    <>
                        <SyncAreaSelection
                            areaId={values.Area}
                            areas={areaOptions}
                            setFieldValue={setFieldValue}
                            setLocalState={setState}
                        />
                        {
                            addresses.map((el, index) => (
                                <View
                                    key={`addr-${el?.Country?.id}-${el?.Region?.id}-${index}`}
                                    style={styless.adressCon}
                                >
                                    <View style={styless.adressRow}>
                                        <View style={styless.adressTexts}>
                                            <Text style={[layout.textAlign, styless.countryText]}>
                                                {dir === "rtl" ? el?.Country?.arName : el?.Country?.name} /{" "}
                                                {dir === "rtl" ? el?.Region?.arName : el?.Region?.name}
                                            </Text>
                                            <Text style={[layout.textAlign, styless.streetText]}>{el?.Street}</Text>
                                        </View>
                                        {index > 0 ? (
                                            <Pressable
                                                accessibilityRole="button"
                                                hitSlop={10}
                                                onPress={() => {
                                                    setstate((old) => ({
                                                        ...old,
                                                        addresses: (old.addresses || []).filter((_, i) => i !== index),
                                                    }));
                                                }}
                                                style={styless.deleteBtn}
                                            >
                                                <Text style={styless.deleteBtnText}>{t("Delete")}</Text>
                                            </Pressable>
                                        ) : (
                                            <View style={styless.deleteBtnSpacer} />
                                        )}
                                    </View>
                                </View>
                            ))
                        }
                        {!showForm && canAddMoreAddresses &&
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
                                        setState((old) => ({
                                            ...old,
                                            showArea: false,
                                            showGovernemnts: true,
                                        }));
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
                                        setFieldTouched("Area");
                                        if (!governmentId) {
                                            setState((old) => ({
                                                ...old,
                                                showGovernemnts: false,
                                                forms: { ...old.forms, City: "You must pick a city!" },
                                            }));
                                        } else if (areasLoading) {
                                            return;
                                        } else if (!canOpenAreas) {
                                            GetAreas(Number(governmentId));
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
                                            const result = onGovernmentSelected({
                                                val,
                                                prevCityId: values.City,
                                                setFieldValue,
                                                setFieldError,
                                                getAreas: GetAreas,
                                                onCityChanged: () => setFieldValue("Addresses", ""),
                                            });
                                            if (result === "invalid") {
                                                setState((old) => ({
                                                    ...old,
                                                    showGovernemnts: false,
                                                    forms: { ...old.forms, City: "You must pick a city!" },
                                                }));
                                            } else {
                                                setState((old) => ({
                                                    ...old,
                                                    showGovernemnts: false,
                                                    showArea: false,
                                                    selectedGoverenmet: result.government as typeof old.selectedGoverenmet,
                                                    selectedArea: (result.clearArea ? EMPTY_LOCATION : old.selectedArea) as typeof old.selectedArea,
                                                    forms: { ...old.forms, City: "" },
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
                                {State.showArea && canOpenAreas && (
                                    <DropDowenMenu
                                        key={`area-${governmentId}`}
                                        onCloseFn={(val) => {
                                            setFieldTouched("Area");
                                            const prevAreaId = values.Area;
                                            const result = onAreaSelected({ val, setFieldValue, setFieldError });
                                            if (result === "invalid") {
                                                setState((old) => ({
                                                    ...old,
                                                    showArea: false,
                                                    forms: { ...old.forms, Area: "You must pick a area!" },
                                                }));
                                            } else {
                                                if (prevAreaId != result.id) {
                                                    setFieldValue("Addresses", "");
                                                }
                                                setState((old) => ({
                                                    ...old,
                                                    showArea: false,
                                                    selectedArea: result as typeof old.selectedArea,
                                                    forms: { ...old.forms, Area: "" },
                                                }));
                                            }
                                        }}
                                        title={t("Choose Area")}
                                        currentFilter={State.selectedArea}
                                        items={areaOptions}
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
            borderBottomWidth: PixelPerfect(0.7),
        },
        adressRow: {
            flexDirection: dir === "rtl" ? "row-reverse" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: PixelPerfect(12),
        },
        adressTexts: {
            flex: 1,
        },
        deleteBtn: {
            paddingVertical: PixelPerfect(6),
            paddingHorizontal: PixelPerfect(8),
        },
        deleteBtnSpacer: {
            minWidth: PixelPerfect(56),
        },
        deleteBtnText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(16),
            color: Colors.warning,
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
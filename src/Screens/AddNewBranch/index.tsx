import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../Constants/theming';
import { useDispatch, useSelector } from 'react-redux';
import useToastNotification from '../../Components/CustomHooks/useToastNotification';
import { RootState } from '../../Store/store';
import { Container, Content } from '../../Components/containers/Containers';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { Formik } from 'formik';
import { ArrowDownIcon, ArrowUpIcon } from '../../Assets/Svg';
import { t } from 'i18next';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import Button from '../../Components/touchables/Button';
import { IFont, ITheme } from '../../Constants/interfaces';
import { validationSchema } from '../../Validation/Signup';
import Inputs from '../../Components/inputs';
import { AddBranch, GetAllRegionsByCountryIdHandler } from '../../Apis/Appinfo';
import DropDowenMenu from '../../Components/DropDowenMenus/DropDowenMenu';
import { AddBranchSchema } from '../../Validation/AddBranch';
type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    //   const {  } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const showToast = useToastNotification();

    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        loading: false,
        showCountries: false,
        showReion: false,

        isdelervable: false,
        date: new Date(),
        selectedCountries: { name: "", arName: "", id: "" },
        selectedRegion: { name: "", arName: "", id: "" },
        regions:[]
       
    });



    const { countries, paperSize } = useSelector((state: RootState) => state.settings);
    console.log('====================================');
    console.log(state.selectedRegion.arName);
    console.log('====================================');

    const GetRegions = (id) => {
        dispatch<any>(GetAllRegionsByCountryIdHandler(id, (res, status) => {
            if (res.status == 200) {
                setstate(old => ({ ...old, regions: res.data,loading:false }))
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }

        }))
    }
    const handleSubmit = (values) => {
        setstate(old => ({ ...old, loading: true }))
        console.log("dssssssssssssssss");
        console.log(values);
        dispatch<any>(AddBranch({
            country:values.countries,region:values.regions,street:"street"
        }, (res, status) => {
            if (res.status == 200) {
                setstate(old => ({ ...old, loading:false}))
                showToast({ type: 'ok', message: res?.message })
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }

        }))
    }
    

    return (
        <Container showHint={false}>
            <HeaderWithText title={t("اضافة فرع جديد")} />
            <View style={styles.con}>
                <Formik
                    validationSchema={AddBranchSchema}
                    initialValues={{
                        countries:"",
                        regions:"",
                        address:""
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => {

                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={true}>

                                    <Pressable
                                        style={styles.selectMenueCon}
                                        onPress={() => {
                                            setstate((old) => ({ ...old, showCountries: true }));
                                        }}
                                    >
                                        <Text style={[layout.textAlign, styles.label]}>{t("المحافظة*")}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>
                                                {typeof state.selectedCountries.id !== "string"
                                                    ? dir === "rtl"
                                                        ? state.selectedCountries.arName
                                                        : state.selectedCountries.name
                                                    : t("اختار المحافظة")}
                                            </Text>
                                            {state.showCountries ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </View>
                                        {errors.countries && touched.countries && <Text style={styles.errorText}>{t(errors.countries as any)}</Text>}
                                    </Pressable>

                                    <Pressable
                                        style={styles.selectMenueCon}
                                        onPress={() => {

                                            setstate((old) => ({ ...old, showReion: true }));
                                        }}
                                    >
                                        <Text style={[layout.textAlign, styles.label]}>{t("المنطقة*")}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>
                                                {typeof state.selectedRegion.id !== "string"
                                                    ? dir === "rtl"
                                                        ? state.selectedRegion.arName
                                                        : state.selectedRegion.name
                                                    : t("المنطقة")}
                                            </Text>
                                            {state.showReion ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </View>
                                        {errors.regions && touched.regions && <Text style={styles.errorText}>{t(errors.regions as any)}</Text>}
                                    </Pressable>

                                    <Inputs
                                        label={t("العنوان*")}
                                        options={{
                                            onBlur: handleBlur("address"),
                                            onChangeText: handleChange("address"),
                                            numberOfLines: 2,
                                            placeholder: t("اكتب العنوان"),
                                            maxLength: 250,
                                            keyboardType: "default",
                                            multiline: true,
                                        }}
                                        inputCon={{ height: 74, paddingTop: 17 }}
                                        input={{ height: 74, verticalAlign: "top" }}
                                        password={false}
                           
                                    />



                                    <Button
                                        title={t('حفظ')}
                                        styleTitle={styles.buttonText}
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        loader={state.loading}
                                        disable={state.loading}
                                    />


                                    {state.showCountries && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                             
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showCountries: false,
                                                    }));
                                                    setFieldError("countries", "You must pick a city!");
                                                   
                                                } else {
                                                    setFieldValue("countries", val.id);
                                                    setFieldTouched("countries", true);
                                                    GetRegions(val.id)
                                                    setstate((old) => ({
                                                        ...old,
                                                        showCountries: false,
                                                        selectedCountries: val,
                                                        regions:[]
                                                    }));
                                                }
                                            }}
                                            title={t("اختار المحافظة")}
                                            currentFilter={state.selectedCountries}
                                            items={countries}
                                            style={{ flex: 0.4 }}
                                        />
                                    )}
                                    {state.showReion && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showReion: false,

                                                    }));
                                                    setFieldError("regions", "You must pick a city!");
                                                } else {
                                                    setFieldValue("regions", val.id);
                                                    setFieldTouched("regions", true);
                                                    setstate((old) => ({
                                                        ...old,
                                                        showReion: false,
                                                        selectedRegion: val,
                                                    }));
                                                }
                                            }}
                                            title={t("اختار المنطقة")}
                                            currentFilter={state.selectedRegion}
                                            items={state.regions}
                                            style={{ flex: 0.4}}
                                        />
                                    )}
                                </Content>

                            </>
                        )
                    }}

                </Formik>

            </View>
        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        con: {
            flex: 0.9,
            paddingHorizontal: PixelPerfect(16)
        },
        body: {
            marginTop: PixelPerfect(8),
            flex: 0.9
        },
        selectMenueCon: {

        },
        label: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(18),
            color: theme.black,
            marginBottom: PixelPerfect(10),
            lineHeight: PixelPerfect(20)
        },
        selectMenue: {
            justifyContent: "space-between",
            backgroundColor: Colors.white,
            height: PixelPerfect(50),
            alignItems: "center",
            borderRadius: PixelPerfect(8),
            paddingHorizontal: PixelPerfect(10),
            marginBottom: PixelPerfect(20),
            borderWidth: PixelPerfect(1),
            borderColor: theme.optionText
        },
        textselectmenu: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(16),
            color: theme.deactive,
        },
        errorText: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(14),
            color: theme.red_yellow,
            textAlign: dir === "rtl" ? "right" : "left",
            marginBottom: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(10)
        },
        hint: {
            fontFamily: Fonts.extraLight,
            fontSize: PixelPerfect(12),
            color: theme.black,
            marginBottom: PixelPerfect(20),
        },
        button: {
            borderWidth: PixelPerfect(1),
            borderColor: "#3D4A78",
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(16),
            marginHorizontal: PixelPerfect(10)
        },
        buttonText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: "#3D4A78"

        },


    });
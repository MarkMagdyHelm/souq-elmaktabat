import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import { useKeyboard } from '../../../Constants/UseKayboard';
import Button from '../../../Components/touchables/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import { Formik, FormikProps } from 'formik';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { validationSchema } from '../../../Validation/Form1Refistration';
import Section from './Componnent/Section';
import Inputs from '../../../Components/inputs/index'
import { roles } from '../../../Helper'
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import { ArrowDownIcon, ArrowUpIcon } from '../../../Assets/Svg';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        showGovernemnts: false,
        showArea: false,
        shoMarkets: false,
        forms: { City: "", Role: "", Area: "", Markets: "" },
        selectedGoverenmet: { name: "", arName: "", id: "" },
        selectedArea: { name: "", arName: "", id: "" },
        selectedMarket: { name: "", arName: "", id: "" },
        goverements: [],
        loading: false,
        selectedRole: { name: "", arName: "", id: "" } as any,
        roles: roles,
        showRols: false,
        loadingSignin: false,

    });
    const keyboard = useKeyboard();
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const [activeStep, setActiveStep] = useState<number | null>(null);

    // ✅ force step 1 open on mount
    useEffect(() => {
        setActiveStep(1);
    }, []);
      const formikRef1 = useRef<FormikProps<any>>(null);

    return (
        <Container
        noSafeArea
        
        >
            <HeaderWithText title={t("signtxt1")} />
            <Content
                noPadding
                style={styles.body}
            >
                <Section
                    title={t("regtxt1")}
                    step={1}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                >
                    <Formik
                        validationSchema={validationSchema}
                          innerRef={formikRef1}
                        initialValues={{
                            Name: "",
                            Email: "",
                            Password: "",
                            ConfirmPassword: "",
                            PhoneNumber: "",
                            Role: "",
                        }}
                        onSubmit={(values) => { }} >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {
                            console.log('====================================');
                            console.log(errors);
                            console.log('====================================');
                            return (
                                <>
                                    <Inputs label={t('fullname')}
                                        options={{
                                            onBlur: handleBlur("Name"),
                                            onChangeText: handleChange("Name"),
                                            placeholder: t("fullnamew"),
                                            maxLength: 100,
                                            keyboardType: 'default',
                                        }}
                                        password={false}
                                        showErrorr={(errors.Name && touched.Name) as boolean}
                                        error={errors.Name as any}
                                    />
                                    <Inputs label={t('Phone')}
                                        options={{
                                            onBlur: handleBlur("PhoneNumber"),
                                            onChangeText: handleChange("PhoneNumber"),
                                            placeholder: t("Phonew"),
                                            maxLength: 11,
                                            keyboardType: Platform.OS === 'android' ? "numeric" : "number-pad",
                                        }}
                                        password={false}
                                        isPhone={true}
                                        input={{ width: "73%" }}
                                        showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean}
                                        error={errors.PhoneNumber as any}
                                    />
                                    <Inputs label={t('Email')}
                                        options={{
                                            onBlur: handleBlur("Email"),
                                            onChangeText: handleChange("Email"),
                                            placeholder: "example@email.com",
                                            maxLength: 30,
                                            keyboardType: 'email-address',
                                            placeholderTextColor: theme.black
                                        }}
                                        password={false}
                                        showErrorr={(errors.Email && touched.Email) as boolean}
                                        error={errors.Email as any}
                                    />
                                    <Inputs label={t('pasword')}
                                        options={{
                                            onBlur: handleBlur("Password"),
                                            onChangeText: handleChange("Password"),
                                            placeholder: t("paswordw"),
                                            keyboardType: 'default',
                                            maxLength: 30,
                                        }}
                                        password={true}
                                        showErrorr={(errors.Password && touched.Password) as boolean}
                                        error={errors.Password as any}
                                    />
                                    <Inputs label={t('confirmpasword')}
                                        options={{
                                            onBlur: handleBlur("ConfirmPassword"),
                                            onChangeText: handleChange("ConfirmPassword"),
                                            placeholder: t("confirmpaswordw"),
                                            keyboardType: 'default',
                                            maxLength: 30,
                                        }}
                                        password={true}
                                        showErrorr={(errors.ConfirmPassword && touched.ConfirmPassword) as boolean}
                                        error={errors.ConfirmPassword as any}
                                    />
                                    <Pressable style={styles.selectMenueCon} onPress={() => { setstate(old => ({ ...old, showRols: true })); }}>
                                        <Text style={[layout.textAlign, styles.label]}>{t("AccountType")}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>{typeof state.selectedRole.id != "string" ?
                                                (dir == "rtl" ? state.selectedRole.arName : state.selectedRole.name) : t("AccountTypew")}</Text>
                                            {state.showRols ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </View>
                                        {state.forms.Role.length != 0 && <Text style={styles.errorText}>{t(state.forms.Role)}</Text>}
                                    </Pressable>
                                    {state.showRols && <DropDowenMenu
                                        onCloseFn={(val) => {
                                            if (typeof val?.id == 'string') {
                                                setstate(old => ({
                                                    ...old, showRols: false, forms: {
                                                        ...state.forms, Role: "You must pick a role!"
                                                    }
                                                }));
                                            } else {
                                                setFieldValue("Role", val.id);
                                                setstate(old => ({
                                                    ...old, showRols: false, selectedRole: val, forms: {
                                                        ...state.forms, Role: ""
                                                    }
                                                }));
                                                setActiveStep(2)
                                            }

                                        }}
                                        title={t('Choose Account Type')}
                                        currentFilter={state.selectedRole}
                                        items={state.roles}
                                        style={{ flex: 0.2, }}
                                    />}
                                </>
                            )
                        }}

                    </Formik>

                </Section>
                <View style={{ paddingVertical: PixelPerfect(8) }} />
                <Section
                    title={t("regtxt2")}
                    step={2}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    onSubmmit={()=>{formikRef1.current?.handleSubmit()}}
                >
                    <Formik
                        validationSchema={validationSchema}

                        initialValues={{
                            Address: "",
                            City: "",
                            Area: "",
                            OtherPhoneNumber: "",
                        }}
                        onSubmit={(values) => { }} >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {
                            console.log('====================================');
                            console.log(errors);
                            console.log('====================================');
                            return (
                                <>
                                    <Pressable style={styles.selectMenueCon} onPress={() => { setstate(old => ({ ...old, showGovernemnts: true })); }}>
                                        <Text style={[layout.textAlign, styles.label]}>{t('Government')}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>{typeof state.selectedGoverenmet.id != "string" ?
                                                (dir == "rtl" ? state.selectedGoverenmet.arName : state.selectedGoverenmet.name) : t("Governmentw")}</Text>
                                            <ArrowDownIcon />
                                        </View>
                                        {state.forms.City.length != 0 && <Text style={styles.errorText}>{t(state.forms.City)}</Text>}
                                    </Pressable>
                                    <Pressable style={styles.selectMenueCon} onPress={() => { setstate(old => ({ ...old, showArea: true })); }}>
                                        <Text style={[layout.textAlign, styles.label]}>{t('Area')}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>{typeof state.selectedArea.id != "string" ?
                                                (dir == "rtl" ? state.selectedArea.arName : state.selectedArea.name) : t("Areaw")}</Text>
                                            <ArrowDownIcon />
                                        </View>
                                        {state.forms.Area.length != 0 && <Text style={styles.errorText}>{t(state.forms.Area)}</Text>}
                                    </Pressable>
                                    <Inputs label={t('adress')}
                                        options={{
                                            onBlur: handleBlur("Address"),
                                            onChangeText: handleChange("Address"),
                                            numberOfLines: 2,
                                            placeholder: t("adressw"),
                                            maxLength: 250,
                                            keyboardType: 'default',
                                            multiline: true,
                                        }}
                                        inputCon={{ height: PixelPerfect(74), paddingTop: PixelPerfect(17) }}
                                        input={{ height: PixelPerfect(74), verticalAlign: "top" }}
                                        password={false}
                                        showErrorr={(errors.Address && touched.Address) as boolean}
                                        error={errors.Address as any}
                                    />
                                    <Pressable style={styles.selectMenueCon} onPress={() => { setstate(old => ({ ...old, shoMarkets: true })); }}>
                                        <Text style={[layout.textAlign, styles.label]}>{t('Market')}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>{typeof state.selectedMarket.id != "string" ?
                                                (dir == "rtl" ? state.selectedMarket.arName : state.selectedMarket.name) : t("Marketw")}</Text>
                                            <ArrowDownIcon />
                                        </View>
                                        {state.forms.Markets.length != 0 && <Text style={styles.errorText}>{t(state.forms.Markets)}</Text>}
                                    </Pressable>
                                     <Inputs label={t('otherPhoneNumber')}
                                        options={{
                                            onBlur: handleBlur("OtherPhoneNumber"),
                                            onChangeText: handleChange("OtherPhoneNumber"),
                                            placeholder: t("otherPhoneNumberw"),
                                            maxLength: 11,
                                            keyboardType: Platform.OS === 'android' ? "numeric" : "number-pad",
                                        }}
                                        password={false}
                                        isPhone={true}
                                        input={{ width: "73%" }}
                                        showErrorr={(errors.OtherPhoneNumber && touched.OtherPhoneNumber) as boolean}
                                        error={errors.OtherPhoneNumber as any}
                                    />
                                </>
                            )
                        }}

                    </Formik>
                </Section>
                <Pressable style={[layout.rowBox,styles.checkcon]}>

                </Pressable>
                <View style={{height:PixelPerfect(30)}}/>
            </Content>
        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        body: {
            // marginTop: PixelPerfect(30),
            flex: 0.9,
            paddingHorizontal: PixelPerfect(16),
        },
        selectMenueCon: {

        },
        label: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(18),
            color: theme.black,
            marginBottom: PixelPerfect(10)
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
        checkcon:{
            
        }
    });
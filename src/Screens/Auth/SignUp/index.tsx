import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import Inputs from '../../../Components/inputs';
import Button from '../../../Components/touchables/Button';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { Formik } from 'formik';
import { validationSchema } from '../../../Validation/Signup';
import { GetCitiesHandler, GetAllActivitiesHandler, GetAllRolesHandler, GetAllAvailableToolsHandler, GetSettingsHandler } from '../../../Apis/Appinfo';
import { SendOTPByEmailHandler } from '../../../Apis/User';
import { useNavigationState, useRoute } from '@react-navigation/native';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { isForgetPassword } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);


    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        showRols: false,
        loadingSignin: false
    });
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    useEffect(() => {
        getSettings();
    }, []);
    const getSettings = () => {
        dispatch<any>(GetSettingsHandler({ lookupIds: [2, 3, 4, 5, 6, 7, 9] },"signup"))
    }
    const handleSubmit = (values) => {
        setstate(old => ({ ...old, loadingSignin: true }))
        dispatch<any>(SendOTPByEmailHandler(values.Email, (res, status) => {
            if (res.status == 200) {
                showToast({ type: 'ok', message: res?.message });
                navigation.navigate("ConfirmtionCode", { email: values.Email, isForgetPassword: isForgetPassword })
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loadingSignin: false }))
        }))
    }
    return (
        <Container showHint={false}>
            <HeaderWithText title={t(isForgetPassword ? "signtxt2" : "signtxt1")} />
            <View style={styles.con}>
                <View style={styles.conhit1}>
                    <Text style={[layout.textAlign, styles.txthit1]}>{t("signtxthint1")}</Text>
                </View>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        Email: "",
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {

                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={false}>
                                    <Inputs label={t('Email')}
                                        options={{
                                            onBlur: handleBlur("Email"),
                                            onChangeText: handleChange("Email"),
                                            placeholder: t("Emailw"),
                                            // maxLength: 30,
                                            keyboardType: 'email-address',
                                        }}
                                        password={false}
                                        showErrorr={(errors.Email && touched.Email) as boolean}
                                        error={errors.Email as any}
                                    />
                                    <View style={{ backgroundColor: theme.mainColor }}>
                                        <Button
                                            title={t('Next')}
                                            loader={state.loadingSignin}
                                            styleTitle={styles.buttonText}
                                            onPress={() => {
                                                handleSubmit();

                                            }}
                                            style={styles.button}
                                        />
                                    </View>
                                    <Pressable style={styles.signUpCon} onPress={() => { navigation.navigate("Signin") }}>
                                        <Text style={styles.signUpText}>{t("Do you have account")}
                                            <Text style={[styles.signUpText1]}>  {t("Sign in")}</Text>
                                        </Text>
                                    </Pressable>
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
        conhit1: {
            marginTop: PixelPerfect(27),
        },
        txthit1: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
        },
        body: {
            marginTop: PixelPerfect(30),
            flex: 0.9
        },
        button: {
            backgroundColor: Colors.secondColor,
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(16)
        },
        buttonText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.mainColor,
        },
        signUpCon: {
            backgroundColor: theme.mainColor,
            paddingTop: PixelPerfect(16),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: PixelPerfect(50)
        },
        signUpText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.deactive,
        },
        signUpText1: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(16),
            color: Colors.secondColor,
        },
    });
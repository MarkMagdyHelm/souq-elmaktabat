import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import Inputs from '../../../Components/inputs';
import Button from '../../../Components/touchables/Button';
import { useDispatch, useSelector } from 'react-redux';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { Formik } from 'formik';
import { validationSchema } from '../../../Validation/Signup';
import { useRoute } from '@react-navigation/native';
import { ForgetPasswordHandler } from '../../../Apis/User';
import { AddOfferICon } from '../../../Assets/Svg';
import { RootState } from '../../../Store/store';
import { ChangePassSchema } from '../../../Validation/ChangePass';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;

    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { userdata } = useSelector((state: RootState) => state.auth);

    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        showRols: false,
        loadingSignin: false
    });
    const dispatch = useDispatch();
    const showToast = useToastNotification();

    const handleSubmit = (values) => {
        console.log("hhhhhh");
        setstate(old => ({ ...old, loadingSignin: true }))
        dispatch<any>(ForgetPasswordHandler({
            email:userdata.email,
            oldPassword:values.Password,
            password:values.NewPassword,
            confirmPassword:values.ConfirmPassword
        }, (res, status) => {
            if (res.status == 200) {
                showToast({ type: 'ok', message: res?.message });
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'Signin' },
                    ],
                });
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loadingSignin: false }))
        }))
    }
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("signtxt3")} />
            <View style={styles.con}>
                <Formik
                    validationSchema={ChangePassSchema}
                    initialValues={{
                        Password: "",
                        NewPassword: "",
                        ConfirmPassword: "",
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {

                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={false}>
                                    <Inputs
                                        label={t("current_password")}
                                        options={{
                                            onBlur: handleBlur("Password"),
                                            onChangeText: handleChange("Password"),
                                            placeholder: t("current_password"),
                                            maxLength: 30,
                                        }}
                                        password={true}
                                        showErrorr={(errors.Password && touched.Password) as boolean}
                                        error={errors.Password as any}
                                    />

                                    <Inputs
                                        label={t("new_password")}
                                        options={{
                                            onBlur: handleBlur("NewPassword"),
                                            onChangeText: handleChange("NewPassword"),
                                            placeholder: t("new_password"),
                                            maxLength: 30,
                                        }}
                                        password={true}
                                        showErrorr={(errors.NewPassword && touched.NewPassword) as boolean}
                                        error={errors.NewPassword as any}
                                    />

                                    <Inputs
                                        label={t("confirm_new_password")}
                                        options={{
                                            onBlur: handleBlur("ConfirmPassword"),
                                            onChangeText: handleChange("ConfirmPassword"),
                                            placeholder: t("confirm_new_password"),
                                            maxLength: 30,
                                        }}
                                        password={true}
                                        showErrorr={(errors.ConfirmPassword && touched.ConfirmPassword) as boolean}
                                        error={errors.ConfirmPassword as any}
                                    />
                                    <View style={{ backgroundColor: theme.mainColor }}>
                                        <Button
                                            title={t('Next')}
                                            loader={state.loadingSignin}
                                            styleTitle={styles.buttonText}
                                            onPress={handleSubmit}  
                                            style={styles.button}
                                        />
                                    </View>

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
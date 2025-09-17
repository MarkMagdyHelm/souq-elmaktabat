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
import { FormikProps } from 'formik';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import Section from './Componnent/Section';
import {  CheckBoxEmptyIconBig, CheckBoxIconBig } from '../../../Assets/Svg';
import { GetAllRegionsByCountryIdHandler } from '../../../Apis/Appinfo';
import { useRoute } from '@react-navigation/native';
import FormStep1 from './Componnent/FormStep1';
import FormStep2 from './Componnent/FormStep2';
import { SignUpHandler } from '../../../Apis/User';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { countries, activites, roles } = useSelector((state: RootState) => state.settings);
    const styles = useStyles(Fonts, theme, dark, dir);
    const { email } = useRoute().params as any;
    const [state, setstate] = useState({
        showGovernemnts: false,
        showArea: false,
        shoMarkets: false,
        forms: { City: "", Role: "", Area: "", Markets: "", agreesonTerms: "" },
        selectedGoverenmet: { name: "", arName: "", id: "" },
        selectedArea: { name: "", arName: "", id: "" },
        selectedMarket: [],
        goverements: [],
        loading: false,
        selectedRole: { name: "", arName: "", id: null } as any,
        roles: roles,
        showRols: false,
        loadingSignin: false,
        areas: [],
        isAgreeOnTerms: false
    });
    const keyboard = useKeyboard();
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const GetAreas = (id) => {
        dispatch<any>(GetAllRegionsByCountryIdHandler(id, (res, status) => {
            if (res.status == 200) {
                setstate(old => ({ ...old, areas: res.data }))
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }

        }))
    }
    // ✅ force step 1 open on mount
    useEffect(() => {
        setActiveStep(1);
    }, []);
    const handleagreeonterms = () => {
        setstate(old => {
            let forms = old.forms;
            if (!old.isAgreeOnTerms) {
                forms.agreesonTerms = "";
            }
            return ({ ...old, isAgreeOnTerms: !old.isAgreeOnTerms, forms: forms })
        })
    }
    const formikRef1 = useRef<FormikProps<any>>(null);
    const formikRef2 = useRef<FormikProps<any>>(null);
    const handleForms = () => {
        formikRef1.current?.handleSubmit();
        formikRef2.current?.handleSubmit();
        const isFormik1IsEmpty = Object.keys(formikRef1?.current?.errors).length === 0;
        const isFormik2IsEmpty = Object.keys(formikRef2?.current?.errors).length === 0;

        if (!isFormik1IsEmpty) {
            setActiveStep(1);
            return false
        } else if (!isFormik2IsEmpty) {
            setActiveStep(2);
            return false
        }
        return true;
    }
    const handleBody = () => {
        let body = { ...formikRef1?.current?.values };
        body.OtherPhoneNumbers = formikRef2?.current?.values?.OtherPhoneNumbers?.length != 0 ? [formikRef2?.current?.values?.OtherPhoneNumbers] : [];
        body.Activities = formikRef2?.current?.values?.Activities.filter(item => item.id !== undefined) || [];
        body.OtherActivities = formikRef2?.current?.values?.Activities.filter(item => item.id === undefined) || [];
        body.Addresses = [{
            Country: formikRef2?.current?.values?.City,
            Region: formikRef2?.current?.values?.Area,
            Street: formikRef2?.current?.values?.Address
        }];
        delete body.ConfirmPassword;
        return body;
    }
    const handleSubmmit = () => {
        const isFormsValid = handleForms();
        let body = {};
        if (!state.isAgreeOnTerms) {
            setstate(old => ({
                ...old, forms: {
                    ...state.forms, agreesonTerms: "You must agree on terms"
                }
            }));
            return;
        }
        if (!isFormsValid) {
            return
        } else {
            body = handleBody()
        }
         console.log('===============final=====================');
        console.log(formikRef1?.current?.values, formikRef2?.current?.values);
        console.log('====================================');
        console.log('===============final========body=============');
        console.log(body);
        console.log('====================================');
        setstate(old => ({ ...old, loading: true }));
        dispatch<any>(SignUpHandler(body, (res, status) => {
            if (res.status == 200) {
                showToast({ type: 'ok', message: res?.message });
                console.log('===========res=========================');
                console.log(res);
                console.log('====================================');
            } else {
                showToast({ type: 'error', message: t("Some Fields has incorrect Values!") });
                handleBackendErrors(res?.message )
            }
            setstate(old => ({ ...old, loading: false }))
        }))
       
    }

  const handleBackendErrors = (message: string) => {
  const errorsArray = message.split(" , ").map(err => err.trim());

  // Collect errors for each form
  const errors1: Record<string, string> = {};
  const errors2: Record<string, string> = {};

  errorsArray.forEach(err => {
    const match = err.match(/The (.+?) field/);
    if (match) {
      const fieldName = match[1]; 
      const key = fieldName.charAt(0) + fieldName.slice(1);

      if (["Name", "Email", "Password","PhoneNumber"].includes(key)) {
        errors1[key] = err; 
      } else if (["Addresses"].includes(key)) {
        
        errors2[key] = err; 
      }
    }
  });
console.log('====================================');
console.log(errors1,errors2);
console.log('====================================');
formikRef1.current?.setErrors(errors1);
  formikRef2.current?.setErrors(errors2);
  if (Object.keys(errors1).length > 0) {
    setActiveStep(1)
  }

  if (Object.keys(errors2).length > 0) {
    setActiveStep(2)
  }
 
};

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
                    setActiveStep={setActiveStep}>
                    <FormStep1
                        formikRef={formikRef1}
                        email={email}
                        state={state}
                        setstate={setstate}
                        setActiveStep={setActiveStep}
                        roles={roles}
                        styles={styles}
                    />
                </Section>
                <View style={{ paddingVertical: PixelPerfect(8) }} />
                <Section
                    title={t("regtxt2")}
                    step={2}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    onSubmmit={() => { }}
                >
                    <FormStep2
                        formikRef={formikRef2}
                        state={state}
                        setstate={setstate}
                        GetAreas={GetAreas}
                        countries={countries}
                        activites={activites}
                        styles={styles}
                    />
                </Section>
                <Pressable style={[layout.rowBox, styles.checkcon]} onPress={handleagreeonterms}>
                    {state.isAgreeOnTerms ? <CheckBoxIconBig /> : <CheckBoxEmptyIconBig />}
                    <Text style={styles.agreeText}

                    >{t("Agree on")}
                        <Text style={[styles.agreeText1]} onPress={() => console.log("gagfagafgafga")}> {t("Privcy and terms")}</Text>
                    </Text>
                </Pressable>
                {state.forms.agreesonTerms.length != 0 && <Text style={[styles.errorText, { marginTop: 5 }]}>{t(state.forms.agreesonTerms)}</Text>}
                <Button
                    title={t('signtxt1')}
                    styleTitle={styles.buttonText}
                    onPress={handleSubmmit}
                    style={styles.button}
                    loader={state.loading}
                    disable={state.loading}
                />
                <Pressable style={styles.signUpCon} onPress={() => { navigation.navigate("Signin") }}>
                    <Text style={styles.signUpText}>{t("Do you have account")}
                        <Text style={[styles.signUpText1]}>  {t("Sign in")}</Text>
                    </Text>
                </Pressable>
                <View style={{ height: PixelPerfect(30) }} />
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
        checkcon: {
            marginTop: PixelPerfect(16),
            alignItems: "center"
        },
        button: {
            backgroundColor: Colors.secondColor,
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(16),
            marginHorizontal: PixelPerfect(10)
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
            marginBottom: PixelPerfect(10)
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
        agreeText: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
            paddingHorizontal: PixelPerfect(6)
        },
        agreeText1: {
            textDecorationLine: "underline"
        }
    });
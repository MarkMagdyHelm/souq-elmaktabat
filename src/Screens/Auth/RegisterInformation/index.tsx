import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IFont, ITheme } from '../../../Constants/interfaces';
import { ThemeContext } from '../../../Constants/theming';
import { Colors, PixelPerfect } from '../../../Constants/styleConstants';
import { t } from 'i18next';
import { Container, Content } from '../../../Components/containers/Containers';
import { useKeyboard } from '../../../Constants/UseKayboard';
import Button from '../../../Components/touchables/Button';
import {  useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import useToastNotification from '../../../Components/CustomHooks/useToastNotification';
import { FormikProps } from 'formik';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import Section from './Componnent/Section';
import { CheckBoxEmptyIconBig, CheckBoxIconBig } from '../../../Assets/Svg';
import { GetAllRegionsByCountryIdHandler } from '../../../Apis/Appinfo';
import { useRoute } from '@react-navigation/native';
import FormStep1 from './Componnent/FormStep1';
import FormStep2 from './Componnent/FormStep2';
// import FormStep3 from './Componnent/FormStep3';

import {  SignUpHandler } from '../../../Apis/User';
import FormStep4 from './Componnent/FormStep4';
import FormStep5 from './Componnent/FormStep5';
import SignUpSuccess from '../../../Components/PopUps/SignUpSuccess';
import FormStep3 from './Componnent/FormStep3';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { countries, activites, roles,tools,payments } = useSelector((state: RootState) => state.settings);
    console.log('=======countries=============================');
    console.log(countries, activites, roles,tools,payments );
    console.log('====================================');
    const styles = useStyles(Fonts, theme, dark, dir);
    const { email } = useRoute().params as any;
    const [state, setstate] = useState({
        showGovernemnts: false,
        showArea: false,
        shoMarkets: false,
        forms: { City: "", Role: "", Area: "", Markets: "", agreesonTerms: "",Tools:"",payments:"" },
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
        isAgreeOnTerms: false,
        IsRorleCustommer: true,
        showTools:false,
        selectedTools:[],
                showPayment:false,
        selectedPayment:[],
        showFiltter:false,
        whichimage:"logo",
        addresses:[],
        otherPhones:[],
        showSuccess:false
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
    const formikRef3 = useRef<FormikProps<any>>(null);
    const formikRef4 = useRef<FormikProps<any>>(null);
    const formikRef5 = useRef<FormikProps<any>>(null);

    const handleForms = () => {

        formikRef1.current?.handleSubmit();
        if (state.IsRorleCustommer) {
            formikRef2.current?.handleSubmit();
            
        }else{
             formikRef3.current?.handleSubmit();
        }
        const isFormik1IsEmpty = Object.keys(formikRef1?.current?.errors).length === 0;
        const isFormik2IsEmpty = Object.keys(state.IsRorleCustommer?formikRef2?.current?.errors:formikRef3?.current?.errors).length === 0;

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
        const bodyFormData = new FormData();
        let body = { ...formikRef1?.current?.values };
        if (state.IsRorleCustommer) {
            body.OtherPhoneNumbers = formikRef2?.current?.values?.OtherPhoneNumbers?.length != 0 ? [formikRef2?.current?.values?.OtherPhoneNumbers] : [];
            body.Activities = formikRef2?.current?.values?.Activities.filter(item => item.id !== undefined) || [];
            body.OtherActivities = formikRef2?.current?.values?.Activities.filter(item => item.id === undefined) || [];
            body.Addresses = [{
                Country: formikRef2?.current?.values?.City,
                Region: formikRef2?.current?.values?.Area,
                Street: formikRef2?.current?.values?.Addresses
            }];
            body.Description = ""
            body.ImageUrl2 = ""
            body.ImageUrl = formikRef2?.current?.values?.ImageUrl
            body.CompanyName = ""
        }else{
               body.OtherPhoneNumbers = state.otherPhones;
            body.Activities = formikRef3?.current?.values?.Activities.filter(item => item.id !== undefined) || [];
            body.OtherActivities = formikRef3?.current?.values?.Activities.filter(item => item.id === undefined) || [];
            body.AvailableTools = formikRef3?.current?.values?.AvailableTools.filter(item => item.id !== undefined) || [];
            body.OtherAvailebleTools = formikRef3?.current?.values?.AvailableTools.filter(item => item.id === undefined) || [];
            body.PaymentTypes = formikRef3?.current?.values?.PaymentTypes.filter(item => item.id !== undefined) || [];
           body.Addresses = state.addresses.map(address => ({
    ...address,
    Country: address.Country?.id || address.Country, 
    Region: address.Region?.id || address.Region     
}));
              body.Description = formikRef3?.current?.values?.Description
            body.ImageUrl2 = formikRef3?.current?.values?.ImageUrl2
            body.ImageUrl = formikRef3?.current?.values?.ImageUrl
            body.CompanyName = formikRef3?.current?.values?.CompanyName
        }
        delete body.ConfirmPassword;
        console.log('====================================');
        console.log(body);
        console.log('====================================');
        const appendFormData = (data, parentKey = "") => {
            if (Array.isArray(data)) {
                data.forEach((value, index) => {
                    appendFormData(value, `${parentKey}[${index}]`);
                });
            } else if (typeof data === "object" && data !== null) {
                Object.keys(data).forEach(key => {
                    appendFormData(data[key], parentKey ? `${parentKey}.${key}` : key);
                });
            } else {
                bodyFormData.append(parentKey, data ?? "");
            }
        };

        appendFormData(body);
        console.log('====================================');
        console.log(bodyFormData);
        console.log('====================================');
        return bodyFormData;
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
             setstate(old => ({ ...old, showSuccess: true }));
          
                    setTimeout(() => {
                setstate(old => ({ ...old, showSuccess: false }));
                navigation.reset({
                index:0,
                routes: [
                    { name: "Signin" }as any,
                  ],
              });
             }, 2000);
           
             console.log('===========xxxx====hgjhgjggj=====================');
             console.log(res);
             console.log('====================================');
            } else {
                showToast({ type: 'error', message:res?.message?? t("Some Fields has incorrect Values!") });
                // handleBackendErrors(res?.message)
            }
            setstate(old => ({ ...old, loading: false }))
        }))

    }

    return (
        <Container
            noSafeArea

        >
                <SignUpSuccess
                show={state.showSuccess}
                title={t("regtxt8")}
                />
            <HeaderWithText title={t("signtxt1")} />
            <Content
                noPadding
                style={styles.body}
            >
                {/* form1 */}
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
                        onSelectRole={(val) => { setstate(old => ({ ...old, IsRorleCustommer: val })) }}
                    />
                </Section>
                <View style={{ paddingVertical: PixelPerfect(8) }} />
                {/* form2 */}
                {state.IsRorleCustommer ?
                    <>
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
                        <View style={{ paddingVertical: PixelPerfect(8) }} />
                    </>
                    :
                    <>
                        {/* form3 */}
                        <Section
                            title={t("regtxt3")}
                            step={2}
                            activeStep={activeStep}
                            setActiveStep={setActiveStep}
                            onSubmmit={() => { }}
                        >
                            <FormStep3
                                formikRef={formikRef3}
                                state={state}
                                setstate={setstate}
                                GetAreas={GetAreas}
                                countries={countries}
                                tools={tools}
                                 activites={activites}
                                styles={styles}
                                payments={payments}
                                   setActiveStep={setActiveStep}
                            />
                        </Section>
                    </>
                }
              
    {!state?.IsRorleCustommer&&
        <>
          <View style={{ paddingVertical: PixelPerfect(8) }} />
        {/* form4 */}
                       <Section
                           title={t("regtxt4")}
                           step={3}
                           activeStep={!(formikRef3?.current?.errors?.Addresses || formikRef3?.current?.errors?.City || formikRef3?.current?.errors?.Area)?activeStep:null}
                           setActiveStep={setActiveStep}
                           onSubmmit={() => { }}
                       >
                           <FormStep4
                                formikRef={formikRef4}
                                state={state}
                                setstate={setstate}
                                GetAreas={GetAreas}
                                countries={countries}
                                styles={styles}
                              addresses={state.addresses}
                                   setActiveStep={setActiveStep}
                            />
                       </Section>
        </>
    }
     {!state?.IsRorleCustommer&&
        <>
          <View style={{ paddingVertical: PixelPerfect(8) }} />
        {/* form5 */}
                       <Section
                           title={t("regtxt6")}
                           step={4}
                           activeStep={activeStep}
                           setActiveStep={setActiveStep}
                           onSubmmit={() => { }}
                       >
                           <FormStep5
                                formikRef={formikRef5}
                                state={state}
                                setstate={setstate}
                                styles={styles}
                              otherPhones={state.otherPhones}
                                  
                            />
                       </Section>
        </>
    }

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
            marginBottom: PixelPerfect(10),
             lineHeight:PixelPerfect(20)
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
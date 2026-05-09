import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { Formik, FormikProps } from 'formik';
import { useRoute } from '@react-navigation/native';
import { AddOfferICon, ArrowDownIcon, ArrowUpIcon, EditProfileIcon } from '../../../Assets/Svg';
import { RootState } from '../../../Store/store';
import { imageUrl, mainUrl } from '../../../Constants/config';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import { GetAllActivities, GetAllAvailableTools } from '../../../Apis/CommonApi';
import axios from 'axios';
import { UpdateProfile } from '../../../Validation/UpdateProfile';
import DoneRate from '../../../Components/PopUps/DoneRate';
import FilterOrder from '../../../Components/PopUps/FilterOrder';
import { openAPPCamera, openAPPPicker } from '../../../Services/ImageCropPicker';
import ImageWithFallback from '../../../Components/ImageWithFallback/ImageWithFallback';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { countries, activites, roles, tools, payments } = useSelector((state: RootState) => state.settings);
    const { item } = useRoute().params as any;
    const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]
    const styles = useStyles(Fonts, theme, dark, dir);
    const { userdata } = useSelector((state: RootState) => state.auth);
    const [isSccusse, setSccusse] = useState(false)
    const [uri, setUri] = useState(imageUrl + userdata.imageUrl)

    const formikRef = useRef<FormikProps<any>>(null);
    const [state, setstate] = useState({
        loading: false,
        showActivities: false,
        showServies: false,
        showPayment: false,
        showFiltter: false,
        selectedActivities: { name: "", arName: "", id: "" },
        selecteServies: { name: "", arName: "", id: "" },
        selectePayment: { name: "", arName: "", id: "" },
        activities: [],
        servies: [],
        payments: [],
    });


    const dispatch = useDispatch();
    const showToast = useToastNotification();


    useEffect(() => {
        getAllActivities()
        getAllAvailableTools()


        setstate(old => ({
            ...old, payments: payments, selectedActivities: item.info.activities[0],
            selecteServies: item.info.tools[0], selectePayment: item.info.payments[0]
        }))

    }, [])

    const handleCameraPhotos = async (name) => {
        try {
            let file = null;

            if (name === "Camera") {
                file = await openAPPCamera();
            } else if (name === "Photos") {
                file = await openAPPPicker();
            }

            console.log(file?.uri);
            
            if (file?.uri) {
                setUri(file.uri);
                console.log('Updated uri = ', file.uri);
                formikRef.current?.setFieldValue("ImageUrl", {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                });
                formikRef.current?.setFieldTouched("ImageUrl", true);
                
            } else {
                formikRef.current?.setFieldError(
                    "ImageUrl",
                    "Image is required"
                );
            }
        } catch (e) {
            console.log(e);
        }
    };


    const updateUserProfile = async (values: any) => {

        console.log("---------------------values-------------------");
        console.log([state.selectedActivities.id]);
        console.log([state.selecteServies.id]);
        console.log([state.selectePayment.id]);
        console.log(values.Description);
        console.log(values.PhoneNumber);
        console.log(values.CompanyName);
        console.log(values.Phone);
        console.log(values.Username);

        console.log("---------------------values-------------------");
        setstate(old => ({
            ...old, loading: false
        }));
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('UserName', values.Username);
            bodyFormData.append('PhoneNumber', values.Phone);
            bodyFormData.append('CompanyName', values.CompanyName);
            bodyFormData.append('ActivityIds', [state.selectedActivities.id]);
            bodyFormData.append('AvailableToolsIds', [state.selecteServies.id]);
            bodyFormData.append('PaymentMethodIds', [state.selectePayment.id]);
            bodyFormData.append('Description', values.Description);
            bodyFormData.append('AnotherPhoneNumber', values.PhoneNumber);
            if (values.ImageUrl?.uri) {
              bodyFormData.append(
                'ImageURL',
                {
                  uri: values.ImageUrl.uri,
                  type: values.ImageUrl.type || 'image/jpeg',
                  name: values.ImageUrl.name || `image_${Date.now()}.jpg`,
                } as any,
              );
            }

            axios.put(mainUrl + "api/User/UpdateUserProfile", bodyFormData, {
                headers: {
                    Accept: 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                    'Access-Control-Allow-Headers':
                        'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                    'Content-Type': 'multipart/form-data',
                    'Accept-Language': dir == "rtl" ? 'ar' : 'en',
                    Authorization: `bearer ${userdata.token}`,
                },

            }
            ).then((res: any) => {
                console.log(res.data);
                console.log(res.status);
                setstate(old => ({
                    ...old, loading: false
                }));
                if (res.data.status == 200) {
                    /// showToast({ type: 'ok', message: res.data.message });
                    setSccusse(true)

                } else {
                    showToast({ type: 'error', message: res.data.message ?? t("Something Went wrong") });
                }
            })
                .catch((err: any) => {
                    console.log(err);
                    setstate(old => ({
                        ...old, loading: false
                    }));
                    showToast({ type: 'error', message: t("Something Went wrong") });
                });
        } catch (error) {

        }
    }
    const getAllActivities = () => {
        setstate(old => ({ ...old, loading: true }))
        dispatch<any>(GetAllActivities((res, status) => {
            if (res.status == 200) {
                setstate(old => ({ ...old, loading: false, activities: res.data }))

            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    }
    const getAllAvailableTools = () => {
        setstate(old => ({ ...old, loading: true }))
        dispatch<any>(GetAllAvailableTools((res, status) => {
            if (res.status == 200) {
                setstate(old => ({ ...old, loading: false, servies: res.data }))
                console.log("---------------------GetAllAvailableToolsHandler-------------------");
                console.log(res.data);
                console.log("---------------------GetAllAvailableToolsHandler-------------------");
            } else {
                showToast({ type: 'error', message: res?.message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    }



    return (
        <Container showHint={false} >
            <View style={styles.body}>
                <HeaderWithText title={t("UpdateProfile")} />
                <Content style={{ marginTop: PixelPerfect(20) }}>

                    <DoneRate
                        visible={isSccusse}
                        onClose={() => {
                            setSccusse(false)
                            navigation.goBack()
                        }}
                        onSubmit={() => {
                            setSccusse(false)
                            navigation.goBack()
                        }}
                        message={t("Success")}
                    />

                    <Formik
                        innerRef={formikRef}
                        validationSchema={UpdateProfile}
                        initialValues={{
                            Username: userdata.name,
                            Phone: userdata.phoneNumber,
                            Email: userdata.email,
                            CompanyName: item.companyName,
                            Description: item.info.description,
                            activity: dir == "rtl" ? item.info.activities[0].arName : item.info?.activities[0]?.name,
                            servises: dir == "rtl" ? item.info?.tools[0]?.arName : item.info?.tools[0]?.name,
                            payment: dir == "rtl" ? item.info?.payments[0]?.arName : item.info?.payments[0]?.name,
                            PhoneNumber: ""
                        }}
                        onSubmit={updateUserProfile} >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => {
                            return (
                                <>
                                    <Content
                                        noPadding
                                        style={styles.body}
                                        scrollEnabled={false}>
                                        <View style={{ alignItems: "center" }}>
                                            <Text style={{ color: theme.black, fontSize: PixelPerfect(18), fontFamily: Fonts.medium }}>
                                                {t("logoCompany")}
                                            </Text>

                                            <Pressable style={styles.logoWrapper} onPress={() => setstate(old => ({ ...old, showFiltter: true }))}>
                                           <ImageWithFallback
                                           key={uri}
                uri={ uri}
                type={uri}//to set default
                style={styles.avatar}
              />
                                                {/* <Image
                                                    source={{ uri:uri }}
                                                    style={styles.avatar} resizeMode="contain" /> */}
                                                <EditProfileIcon style={styles.editBtn} />
                                            </Pressable>

                                        </View>


                                        <Inputs
                                            label={t("fullname")}
                                            options={{
                                                onBlur: handleBlur("Username"),
                                                onChangeText: handleChange("Username"),
                                                placeholder: t("fullnamew"),
                                                maxLength: 30,
                                                value: values.Username
                                            }}
                                            password={false}
                                            showErrorr={(errors.Username && touched.Username) as boolean}
                                            error={errors.Username as any}
                                        />
                                        <Inputs label={t('Phone')}
                                            options={{
                                                onBlur: handleBlur("Phone"),
                                                onChangeText: handleChange("Phone"),
                                                placeholder: t("Phonew"),
                                                maxLength: 11,
                                                keyboardType: Platform.OS === 'android' ? "numeric" : "number-pad",
                                                value: values.Phone
                                            }}
                                            password={false}
                                            isPhone={true}
                                            input={{ width: "75%" }}
                                            showErrorr={(errors.Phone && touched.Phone) as boolean}
                                            error={errors.Phone as any}
                                        />
                                        <Inputs
                                            label={t("Email")}
                                            options={{
                                                onBlur: handleBlur("Email"),
                                                onChangeText: handleChange("Email"),
                                                placeholder: t("Emailw"),
                                                maxLength: 30,
                                                value: values.Email
                                            }}
                                            password={false}
                                            showErrorr={(errors.Email && touched.Email) as boolean}
                                            error={errors.Email as any}
                                        />
                                        <Inputs
                                            label={t("CompanyName")}
                                            options={{
                                                onBlur: handleBlur("CompanyName"),
                                                onChangeText: handleChange("CompanyName"),
                                                placeholder: t("confirmpaswordw"),
                                                maxLength: 30,
                                                value: values.CompanyName
                                            }}
                                            password={false}
                                            showErrorr={(errors.CompanyName && touched.CompanyName) as boolean}
                                            error={errors.CompanyName as any}
                                        />
                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showActivities: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("companyActivityw")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state.selectedActivities.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedActivities.arName
                                                            : state.selectedActivities.name
                                                        : values.activity}
                                                </Text>
                                                {state.showActivities ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.activity && touched.activity && <Text style={styles.errorText}>{t(errors.activity as any)}</Text>}
                                        </Pressable>
                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showServies: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("companyTools")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state?.selecteServies?.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state?.selecteServies?.arName
                                                            : state?.selecteServies?.name
                                                        : values.servises}
                                                </Text>
                                                {state.showServies ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.servises && touched.servises && <Text style={styles.errorText}>{t(errors.servises as any)}</Text>}
                                        </Pressable>


                                        <Inputs
                                            label={t("Description")}
                                            options={{
                                                onBlur: handleBlur("Description"),
                                                onChangeText: handleChange("Description"),
                                                placeholder: t("Descriptionw"),
                                                maxLength: 100,
                                                value: values.Description
                                            }}
                                            password={false}
                                            showErrorr={(errors.Description && touched.Description) as boolean}
                                            error={errors.Description as any}
                                        />
                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showPayment: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("payments")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state?.selectePayment?.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state?.selectePayment?.arName
                                                            : state?.selectePayment?.name
                                                        : values.payment}
                                                </Text>
                                                {state.showPayment ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.payment && touched.payment && <Text style={styles.errorText}>{t(errors.payment as any)}</Text>}
                                        </Pressable>

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
                                            input={{ width: "75%" }}
                                            showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean}
                                            error={errors.PhoneNumber as any}
                                        />
                                        <View style={{ backgroundColor: theme.mainColor }}>
                                            <Button
                                                title={t('Save')}
                                                loader={state.loading}
                                                styleTitle={styles.buttonText}
                                                onPress={() => {
                                                    handleSubmit();

                                                }}
                                                style={styles.button}
                                            />
                                        </View>
                                        {state.showActivities && (
                                            <DropDowenMenu
                                                onCloseFn={(val) => {
                                                    if (typeof val?.id === "string") {
                                                        setstate((old) => ({
                                                            ...old,
                                                            showActivities: false,

                                                        }));
                                                        setFieldError("activity", "You must pick a activity!");
                                                    } else {
                                                        setFieldValue("activity", val.id);
                                                        setFieldTouched("activity", true);
                                                        setstate((old) => ({
                                                            ...old,
                                                            showActivities: false,
                                                            selectedActivities: val,
                                                        }));
                                                    }
                                                }}
                                                title={t("Actvityww")}
                                                currentFilter={state.selectedActivities}
                                                items={state.activities}
                                                style={{ flex: 0.4 }}
                                            />
                                        )}
                                        {state.showServies && (
                                            <DropDowenMenu
                                                onCloseFn={(val) => {
                                                    if (typeof val?.id === "string") {
                                                        setstate((old) => ({
                                                            ...old,
                                                            showServies: false,

                                                        }));
                                                        setFieldError("servises", "You must pick a servises!");
                                                    } else {
                                                        setFieldValue("servises", val.id);
                                                        setFieldTouched("servises", true);
                                                        setstate((old) => ({
                                                            ...old,
                                                            showServies: false,
                                                            selecteServies: val,
                                                        }));
                                                    }
                                                }}
                                                title={t("Toolsww")}
                                                currentFilter={state.selecteServies}
                                                items={state.servies}
                                                style={{ flex: 0.4 }}
                                            />
                                        )}

                                        {state.showPayment && (
                                            <DropDowenMenu
                                                onCloseFn={(val) => {
                                                    if (typeof val?.id === "string") {
                                                        setstate((old) => ({
                                                            ...old,
                                                            showPayment: false,

                                                        }));
                                                        setFieldError("payment", "You must pick a payment!");
                                                    } else {
                                                        setFieldValue("payment", val.id);
                                                        setFieldTouched("payment", true);
                                                        setstate((old) => ({
                                                            ...old,
                                                            showPayment: false,
                                                            selectePayment: val,
                                                        }));
                                                    }
                                                }}
                                                title={t("paymentsww")}
                                                currentFilter={state.selectePayment}
                                                items={payments}
                                                style={{ flex: 0.4 }}
                                            />
                                        )}
                                        {state.showFiltter && <FilterOrder
                                            title={t('Filter')}
                                            items={filterOption}
                                            currentFilter={filterOption}
                                            onCloseFn={(val) => {
                                                // if (val) {
                                                //   setFieldTouched("ImageUrl")
                                                // }
                                                setstate(old => ({ ...old, showFiltter: false }))
                                                setTimeout(() => {
                                                    handleCameraPhotos(val.Name);

                                                }, 300);
                                            }}
                                        />}
                                    </Content>
                                </>
                            )
                        }}

                    </Formik>

                </Content>
            </View>

        </Container>
    );
};

export default Index;

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string) =>
    StyleSheet.create({
        body: {
            marginTop: PixelPerfect(30),
            flex: 1
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

        signUpText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.deactive,
        },

        avatar: {
            width: PixelPerfect(64), height: PixelPerfect(64),
            borderRadius: PixelPerfect(32),
            marginRight: PixelPerfect(19)
        },

        logoWrapper: {
            width: PixelPerfect(64), height: PixelPerfect(64),

            marginTop: PixelPerfect(8)
        },
        editBtn: {
            position: "absolute",
            top: PixelPerfect(-8),
            right: PixelPerfect(0),
            backgroundColor: "#fff",
            padding: PixelPerfect(8),
            borderRadius: PixelPerfect(20),
            elevation: 2,
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
    });
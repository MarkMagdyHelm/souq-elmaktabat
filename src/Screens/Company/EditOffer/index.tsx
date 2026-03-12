import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { validationSchema } from '../../../Validation/Signup';
import { AddPhotoImage, ArrowDownIcon, ArrowUpIcon, CalenderIcon, ImageIcon } from '../../../Assets/Svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RootState } from '../../../Store/store';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import RadiobuttonChoice from '../../../Components/PopUps/RadiobuttonChoice';
import { amounts } from '../../../Helper';
import { GetMyBranches } from '../../../Apis/CommonApi';
import { AddOfferPrinter } from '../../../Validation/AddOfferPrinter';
import { AddInkOffer, AddPaperOffer, AddPrintingPressOffer } from '../../../Apis/Request';
import { useRoute } from '@react-navigation/native';
import { openAPPCamera, openAPPPicker } from '../../../Services/ImageCropPicker';
import FilterOrder from '../../../Components/PopUps/FilterOrder';
import { GetAllPapersV2 } from '../../../Apis/Appinfo';
import { AddOfferPaper } from '../../../Validation/AddOfferPaper';
import { AddOfferInks } from '../../../Validation/AddOfferInks';
const filterOption = [{ ID: 1, Name: "Camera", Value: "Camera" }, { ID: 2, Name: "Photos", Value: "Photos" },]

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { type, item } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const { inks, colors, paperwidth, paperSize } = useSelector((state: RootState) => state.settings);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        loading: false,
        showtype: false,
        showSize: false,
        showWight: false,
        showQuntity: false,
        showColor: false,
        showInks: false,
        showDate: false,
        showBranches: false,
        isdelervable: false,
        date: new Date(),
        branches: [],
        paperTypeList: [],
        selectedPaperType: { name: "", arName: "", id: "" },
        selectedInks: { name: "", arName: "", id: "" },
        selectedColor: { name: "", arName: "", id: "" },
        selectedPaperSize: { name: "", arName: "", id: "" },
        selectedPaperQuntaity: { name: "", arName: "", id: "" },
        selectedBranches: { branchName: "", branchId: "", countryName: "", regionName: "" },
        image: {} as any,
        showFiltter: false,
        isImediatePrinting: false,
    });
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const formikRef = useRef<FormikProps<any>>(null);

    const handelDelery = () => {
        setstate(old => ({ ...old, isdelervable: !old.isdelervable }))
    }
    const handelImediatePrinting = (value: boolean) => {
        setstate(old => ({ ...old, isImediatePrinting:!value }))
    }
    const handleBody = () => {
        const bodyFormData = new FormData();
        let body = {} as any;
        if (type == "Inks") {
            body.InkId = formikRef?.current?.values?.InksType,
                body.Brand = formikRef?.current?.values?.Brand,
                body.Size = formikRef?.current?.values?.InksWidth,
                body.ColorId = formikRef?.current?.values?.Color,
                body.Price = formikRef?.current?.values?.PaperPrice,
                body.Min = formikRef?.current?.values?.PaperQuntaity,
                body.Description = formikRef?.current?.values?.PaperDescription,
                body.EndDate = state.date,
                body.Branches = [formikRef?.current?.values?.Branches],
                body.IncludeDelivery = state.isdelervable,
                body.ImageUrl = formikRef?.current?.values?.ImageUrl
        } else if (type == "Printers") {
            {
                body.EndDate = state.date,
                    body.Branches = [formikRef?.current?.values?.Branches],
                    body.ImageUrl = formikRef?.current?.values?.ImageUrl,
                    body.Description = formikRef?.current?.values?.PaperDescription,
                       body.ColoredPrice= formikRef?.current?.values?.PaperPrice1,
                      body.NonColoredPrice= formikRef?.current?.values?.PaperPrice,
                     body.ImediatePrinting=state.isImediatePrinting,
                    body.IncludeDelivery = state.isdelervable
            }
        }
        console.log('==========saasasasasasas==========================');
        console.log("body", body);
        console.log('====================================');
       const appendFormData = (data, parentKey = "") => {
  // ✅ Image / File (React Native)
  if (
    data &&
    typeof data === "object" &&
    data.uri &&
    data.name &&
    data.type
  ) {
    bodyFormData.append(parentKey, {
      uri: data.uri.startsWith("file://")
        ? data.uri
        : `file://${data.uri}`,
      name: data.name,
      type: data.type,
    });
    return;
  }

  // Array
  if (Array.isArray(data)) {
    data.forEach((value, index) => {
      appendFormData(value, `${parentKey}[${index}]`);
    });
    return;
  }

  // Object
  if (typeof data === "object" && data !== null) {
    Object.keys(data).forEach(key => {
      appendFormData(
        data[key],
        parentKey ? `${parentKey}.${key}` : key
      );
    });
    return;
  }

  // Primitive
  bodyFormData.append(parentKey, data ?? "");
};

        appendFormData(body);
        console.log('====================================');
        console.log(bodyFormData);
        console.log('====================================');
        return bodyFormData;
    }
    const handleSubmit = (values: any) => {
      console.log('====================================');
      console.log(values);
      console.log('====================================');

        setstate(old => ({ ...old, loading: true }))

        if (type === "Paper") {
            dispatch<any>(AddPaperOffer({
                paperId: values.PaperType,
                paperSizeId: values.PaperSize,
                width: values.PaperWidth,
                min: values.PaperQuntaity.name,
                price: values.PaperPrice,
                description: values.PaperDescription,
                endDate: state.date,
                branches: [values.Branches],
                includeDelivery: state.isdelervable
            }, (res, status) => {
                if (res.status === 200) {
                    console.log('===============ggg=====================');
                    console.log(res);
                    console.log('====================================');
                    navigation.goBack()
                    showToast({ type: 'ok', message: res?.Message ?? t("Successfully Added Offer") });
                } else {
                    showToast({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
                }
                setstate(old => ({ ...old, loading: false }))
            }))
        } else if (type === "Inks") {
            const data = handleBody();
            console.log('============AddInkOffer=======AddInkOffer=================');
            console.log("data", data);
            console.log('====================================');
            dispatch<any>(AddInkOffer(data, (res, status) => {
                if (res.status === 200) {
                  showToast({ type: 'ok', message: res?.Message ?? t("Successfully Added Offer") });
                    navigation.goBack()
                } else {
                    showToast({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
                }
                setstate(old => ({ ...old, loading: false }))
            }))
        } else {
            let data = handleBody();
            dispatch<any>(AddPrintingPressOffer(data, (res, status) => {
                if (res.status === 200) {
                     showToast({ type: 'ok', message: res?.Message ?? t("Successfully Added Offer") });
                    navigation.goBack()
                } else {
                    showToast({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
                }
                setstate(old => ({ ...old, loading: false }))
            }))
        }
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const onChange = (event, selectedDate) => {
        setstate(old => ({ ...old, showDate: Platform.OS === 'ios' }));
        if (selectedDate && selectedDate >= new Date()) {
            setstate(old => ({ ...old, date: selectedDate }));
        }
    };


    useEffect(() => {
        getMyBranches();
        if( type === "Paper"){
            getAllPapersV2()
        }
    }, [])
    const getMyBranches = () => {
        setstate(old => ({ ...old, loading: true }))


        dispatch<any>(GetMyBranches((res, status) => {
            if (res.status === 200) {
                setstate(old => ({ ...old, branches: res.data }))
            
            } else {
                showToast({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };
    const getAllPapersV2 = () => {
        setstate(old => ({ ...old, loading: true }))


        dispatch<any>(GetAllPapersV2((res, status) => {
            if (res.status === 200) {
                setstate(old => ({ ...old, paperTypeList: res.data }))
           

            } else {
                showToast({ type: 'error', message: res?.Message ?? t("Something Went wrong") });
            }
            setstate(old => ({ ...old, loading: false }))
        }))
    };
    

    const handleCameraPhotos = async (name) => {
        try {
            let file = null;

            if (name === "Camera") {
                file = await openAPPCamera();
            } else if (name === "Photos") {
                file = await openAPPPicker();
            }

            if (file?.uri) {
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



console.log('====================================');
console.log(item);
console.log('====================================');



    return (
        <Container showHint={false}>

            <HeaderWithText
                title={
                    type === "Paper"
                        ? t("addoffer1")
                        : type === "Inks"
                            ? t("inkOfferTitle")
                            : type === "Printers"
                                ? t("printerOfferTitle")
                                : ""
                }
            />

            <View style={styles.con}>
                <Formik
                    innerRef={formikRef}
                    validationSchema={type === "Paper" ? AddOfferPaper :( type === "Inks" ? AddOfferInks : AddOfferPrinter ) }
                    initialValues={{
                        PaperType: "",
                        InksType: "",
                        Brand: "",
                        Color: "",
                        PaperSize: "",
                        PaperQuntaity: "",
                        Branches: "",
                        PaperWidth: "",
                        InksWidth: "",
                        PaperPrice: "",
                        PaperPrice1: "",
                        PaperDescription: "",
                        PaperFinish: "",
                        PaperDelevery: true,
                        ImageUrl: null,
                        ImediatePrinting: false,
                    }}
                    onSubmit={handleSubmit} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched, setFieldError }) => {
                    
                      console.log(errors,values);
                      
                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={true}>

                                    {type === "Paper" && <View>


                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {
                                                setstate((old) => ({ ...old, showtype: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("paperType")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state.selectedPaperType.id !== "string"
                                                        ? dir === "rtl"
                                                            ? (state.selectedPaperType.arName??state.selectedPaperType.name)
                                                            : state.selectedPaperType.name
                                                        : t("paperTypew")}
                                                </Text>
                                                {state.showtype ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.PaperType && touched.PaperType && <Text style={styles.errorText}>{t(errors.PaperType as any)}</Text>}
                                        </Pressable>

                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showSize: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("paperSize")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state.selectedPaperSize.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedPaperSize.arName
                                                            : state.selectedPaperSize.name
                                                        : t("paperSizew")}
                                                </Text>
                                                {state.showSize ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.PaperSize && touched.PaperSize && <Text style={styles.errorText}>{t(errors.PaperSize as any)}</Text>}
                                        </Pressable>

                                        <Inputs
                                            label={t("paperWight")}
                                            options={{
                                                onBlur: handleBlur("PaperWidth"),
                                                onChangeText: handleChange("PaperWidth"),
                                                placeholder: t("paperWightw"),
                                                maxLength: 5,
                                                keyboardType: "number-pad",
                                            }}
                                            password={false}
                                            isPhone={false}
                                            input={{}}
                                            showErrorr={(errors.PaperWidth && touched.PaperWidth) as boolean}
                                            error={errors.PaperWidth as any}
                                        />
                                    </View>
                                    }


                                    {type === "Inks" && <View>


                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {
                                                setstate((old) => ({ ...old, showInks: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("inkType")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {item?.name??(typeof state.selectedInks.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedInks.arName
                                                            : state.selectedInks.name
                                                        : t("inkTypew"))}
                                                </Text>
                                                {state.showInks ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.InksType && touched.InksType && <Text style={styles.errorText}>{t(errors.InksType as any)}</Text>}
                                        </Pressable>
                                        <Inputs
                                            label={t("inkBrand")}
                                            options={{
                                                onBlur: handleBlur("Brand"),
                                                onChangeText: handleChange("Brand"),
                                                placeholder: item?.,
                                                maxLength: 5,
                                                keyboardType: "number-pad",
                                            }}
                                            password={false}
                                            isPhone={false}
                                            input={{}}
                                            showErrorr={(errors.Brand && touched.Brand) as boolean}
                                            error={errors.Brand as any}
                                        />

                                        <Inputs
                                            label={t("inkCapacity")}
                                            options={{
                                                onBlur: handleBlur("InksWidth"),
                                                onChangeText: handleChange("InksWidth"),
                                                placeholder: t("inkCapacityw"),
                                                maxLength: 5,
                                                keyboardType: "number-pad",
                                            }}
                                            password={false}
                                            isPhone={false}
                                            input={{}}
                                            showErrorr={(errors.InksWidth && touched.InksWidth) as boolean}
                                            error={errors.InksWidth as any}
                                        />



                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {
                                                setstate((old) => ({ ...old, showColor: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("inkColor")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state.selectedColor.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedColor.arName
                                                            : state.selectedColor.name
                                                        : t("inkColorw")}
                                                </Text>
                                                {state.showColor ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.Color && touched.Color && <Text style={styles.errorText}>{t(errors.Color as any)}</Text>}
                                        </Pressable>
                                    </View>
                                    }

                                        {type === "Printers" && <View>

                                        {<View style={{ marginBottom: PixelPerfect(20) }}>
                                            <Text style={[layout.textAlign, styles.label]}>{t("productImages")}</Text>
                                            <Pressable style={{ justifyContent: "center", alignItems: "center" }}
                                                onPress={(() => {
                                                    setstate(old => ({ ...old, showFiltter: true }))
                                                })}>
                                                {values?.ImageUrl?.uri ? (
                                                    <Image
                                                        source={{ uri: values.ImageUrl.uri }}
                                                        style={styles.imagePreview}
                                                    />
                                                ) : (
                                                    <AddPhotoImage />
                                                )}
                                            </Pressable>
                                        </View>}



                                        <Inputs
                                            label={t("printerColorPrice")}
                                            options={{
                                                onBlur: handleBlur("PaperPrice1"),
                                                onChangeText: handleChange("PaperPrice1"),
                                                placeholder: t("printerColorPricew"),
                                                maxLength: 5,
                                                keyboardType: "number-pad",
                                            }}
                                            password={false}
                                            isPhone={false}
                                            input={{}}
                                            showErrorr={(errors.PaperPrice1 && touched.PaperPrice1) as boolean}
                                            error={errors.PaperPrice1 as any}
                                        />
                                    </View>
                                    }

                                    <Inputs
                                        label={
                                            type === "Paper"
                                                ? t("paperPrice")
                                                : type === "Inks"
                                                    ? t("inkPriceUnit")
                                                    : t("printerBWPrice")
                                        }
                                        options={{
                                            onBlur: handleBlur("PaperPrice"),
                                            onChangeText: handleChange("PaperPrice"),
                                            placeholder:
                                                type === "Paper"
                                                    ? t("paperPricew")
                                                    : type === "Inks"
                                                        ? t("paperPricew")
                                                        : t("printerBWPricew"),
                                            maxLength: 5,
                                            keyboardType: "number-pad",
                                        }}
                                        password={false}
                                        isPhone={false}
                                        input={{}}
                                        showErrorr={(errors.PaperPrice && touched.PaperPrice) as boolean}
                                        error={errors.PaperPrice as any}
                                    />
                                    <View>
                                        {(type === "Paper" || type === "Inks") && <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showQuntity: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("papermintoorder")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>
                                                    {typeof state.selectedPaperQuntaity.id !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedPaperQuntaity.arName
                                                            : state.selectedPaperQuntaity.name
                                                        : t("papermintoordew")}
                                                </Text>
                                                {state.showQuntity ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.PaperQuntaity && touched.PaperQuntaity && <Text style={styles.errorText}>{t(errors.PaperQuntaity as any)}</Text>}

                                        </Pressable>
                                        }

                                        {type === "Printers" && <View
                                            style={styles.selectMenueCon}>
                                            <Text style={[layout.textAlign, styles.label]}>{t("printingType")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue, { borderWidth: 0, marginBottom: 0 }]}>
                                                <Pressable style={[layout.rowBox, styles.yesNocon]}
                                                    onPress={()=>handelImediatePrinting(true)}
                                                >
                                                    <View style={[styles.radioButton, { borderColor: !state.isImediatePrinting ? theme.active : theme.gray }]}>
                                                        {!state.isImediatePrinting ? <View style={styles.radioButtonSelected} /> : null}
                                                    </View>
                                                    <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                                        {t("printingImmediate")}
                                                    </Text>
                                                </Pressable>
                                                <Pressable style={[layout.rowBox, styles.yesNocon]}
                                                    onPress={()=>handelImediatePrinting(false)}
                                                >
                                                    <View style={[styles.radioButton, { borderColor: state.isImediatePrinting ? theme.active : theme.gray }]}>
                                                        {state.isImediatePrinting ? <View style={styles.radioButtonSelected} /> : null}
                                                    </View>
                                                    <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                                        {t("printingScheduled")}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                            {errors.PaperDelevery && touched.PaperDelevery && <Text style={styles.errorText}>{t(errors.PaperDelevery as any)}</Text>}
                                        </View>
                                        }
                                        <Inputs
                                            label={t("paperdis")}
                                            options={{
                                                onBlur: handleBlur("PaperDescription"),
                                                onChangeText: handleChange("PaperDescription"),
                                                numberOfLines: 2,
                                                placeholder: t("paperdisw"),
                                                maxLength: 250,
                                                keyboardType: "default",
                                                multiline: true,
                                            }}
                                            inputCon={{ height: 74, paddingTop: 17 }}
                                            input={{ height: 74, verticalAlign: "top" }}
                                            password={false}
                                            showErrorr={(errors.PaperDescription && touched.PaperDescription) as boolean}
                                            error={errors.PaperDescription as any}
                                        />

                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {
                                                setstate((old) => ({ ...old, showDate: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("paperDate")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue, { marginBottom: PixelPerfect(4), }]}>
                                                {state.showDate ?
                                                    <DateTimePicker
                                                        value={state.date}
                                                        mode="date"
                                                        minimumDate={tomorrow}
                                                        locale="ar"
                                                        onChange={onChange}

                                                    />
                                                    : (Platform.OS == "android" && !state.showDate && state.date != new Date()) ? <View style={styles.dateCon}>
                                                        <Text style={[styles.textselectmenu, { color: theme.black }]}>
                                                            {moment(state.date).locale("en").format("YYYY/MM/DD")}
                                                        </Text>
                                                    </View> :
                                                        <Text style={styles.textselectmenu}>
                                                            {t("paperDate")}
                                                        </Text>}

                                                <CalenderIcon />
                                            </View>
                                            <Text style={[layout.textAlign, styles.hint]}>{t("paperDatew")}</Text>
                                            {errors.PaperFinish && touched.PaperFinish && <Text style={[styles.errorText, {}]}>{t(errors.PaperFinish as any)}</Text>}
                                        </Pressable>

                                        <Pressable
                                            style={styles.selectMenueCon}
                                            onPress={() => {

                                                setstate((old) => ({ ...old, showBranches: true }));
                                            }}
                                        >
                                            <Text style={[layout.textAlign, styles.label]}>{t("paperBranch")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue]}>
                                                <Text style={styles.textselectmenu}>

                                                    {typeof state.selectedBranches.branchId !== "string"
                                                        ? dir === "rtl"
                                                            ? state.selectedBranches.branchName
                                                            : state.selectedBranches.branchName
                                                        : t("paperBranchw")}
                                                </Text>
                                                {state.showBranches ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                            </View>
                                            {errors.Branches && touched.Branches && <Text style={styles.errorText}>{t(errors.Branches as any)}</Text>}
                                        </Pressable>


                                        <View
                                            style={styles.selectMenueCon}>
                                            <Text style={[layout.textAlign, styles.label]}>{t("paperDelivery")}</Text>
                                            <View style={[layout.rowBox, styles.selectMenue, { borderWidth: 0, marginBottom: 0 }]}>
                                                <Pressable style={[layout.rowBox, styles.yesNocon]}
                                                    onPress={handelDelery}
                                                >
                                                    <View style={[styles.radioButton, { borderColor: state.isdelervable ? theme.active : theme.gray }]}>
                                                        {state.isdelervable ? <View style={styles.radioButtonSelected} /> : null}
                                                    </View>
                                                    <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                                        {t("yes")}
                                                    </Text>
                                                </Pressable>
                                                <Pressable style={[layout.rowBox, styles.yesNocon]}
                                                    onPress={handelDelery}
                                                >
                                                    <View style={[styles.radioButton, { borderColor: !state.isdelervable ? theme.active : theme.gray }]}>
                                                        {!state.isdelervable ? <View style={styles.radioButtonSelected} /> : null}
                                                    </View>
                                                    <Text style={[styles.textselectmenu, { paddingHorizontal: PixelPerfect(5) }]}>
                                                        {t("no")}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                            {errors.PaperDelevery && touched.PaperDelevery && <Text style={styles.errorText}>{t(errors.PaperDelevery as any)}</Text>}
                                        </View>
                                        {type == "Inks" && <View>
                                            <Text style={[layout.textAlign, styles.label]}>{t("productImages")}</Text>
                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                <Pressable style={{ justifyContent: "center", alignItems: "center" }}
                                                    onPress={(() => {
                                                        setstate(old => ({ ...old, showFiltter: true }))
                                                    })}>
                                                    {values.ImageUrl && values.ImageUrl.uri ?<Image
                                                        source={{ uri: values.ImageUrl.uri }}
                                                        style={styles.imagePreview}
                                                    /> : <AddPhotoImage />}
                                                </Pressable>
                                            </View>

                                        </View>}


                                    </View>
                                    <Button
                                        title={t('addoffer')}
                                        styleTitle={styles.buttonText}
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        loader={state.loading}
                                        disable={state.loading}
                                    />
                                    {state.showtype && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showtype: false,

                                                    }));
                                                    setFieldError("PaperType", "You must pick a city!");
                                                } else {
                                                    setFieldValue("PaperType", val.id);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showtype: false,
                                                        selectedPaperType: val,
                                                    }));
                                                }
                                            }}
                                            title={t("paperTypew")}
                                            currentFilter={state.selectedPaperType}
                                            items={state.paperTypeList}
                                            style={{ flex: 0.3 }}
                                        />
                                    )}
                                    {state.showColor && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showColor: false,

                                                    }));
                                                    setFieldError("Color", "You must pick a city!");
                                                } else {
                                                    setFieldValue("Color", val.id);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showColor: false,
                                                        selectedColor: val,
                                                    }));
                                                }
                                            }}
                                            title={t("paperTypew")}
                                            currentFilter={state.selectedColor}
                                            items={colors}
                                            style={{ flex: 0.3 }}
                                        />
                                    )}

                                    {state.showInks && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showInks: false,

                                                    }));
                                                    setFieldError("InksType", "You must pick a city!");
                                                } else {
                                                    setFieldValue("InksType", val.id);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showInks: false,
                                                        selectedInks: val,
                                                    }));
                                                }
                                            }}
                                            title={t("paperTypew")}
                                            currentFilter={state.selectedInks}
                                            items={inks}
                                            style={{ flex: 0.3 }}
                                        />
                                    )}

                                    {state.showSize && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.id === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showSize: false,

                                                    }));
                                                    setFieldError("PaperSize", "You must pick a city!");
                                                } else {
                                                    setFieldValue("PaperSize", val.id);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showSize: false,
                                                        selectedPaperSize: val,
                                                    }));
                                                }
                                            }}
                                            title={t("paperSizew")}
                                            currentFilter={state.selectedPaperSize}
                                            items={paperSize}
                                            style={{ flex: 0.3 }}
                                        />
                                    )}
                                    {state.showQuntity && (
                                        <RadiobuttonChoice
                                            onCloseFn={(val) => {

                                                setFieldTouched("PaperQuntaity");
                                                if (!val?.hasOwnProperty("isSelected")) {

                                                    setFieldError("PaperQuntaity", "You must choose a market!");
                                                    setstate((old) => ({
                                                        ...old,
                                                        showQuntity: false,
                                                    }));
                                                } else {
                                                    console.log('==============dddddd======================');
                                                    console.log(val, val.hasOwnProperty("id"));
                                                    console.log(typeof val);
                                                    console.log('====================================');

                                                    setFieldValue("PaperQuntaity", val.name);
                                                    setstate((old) => ({
                                                        ...old,
                                                        showQuntity: false,
                                                        selectedPaperQuntaity: val,
                                                        forms: { selectedPaperQuntaity: "" },
                                                    }));
                                                }
                                            }}
                                            title={t("lessOffer")}
                                            currentFilter={state.selectedPaperQuntaity}
                                            items={amounts}
                                            style={{ flex: 0.6 }}
                                            type={"activities"}
                                            hasTextInput={false}
                                            textinputTitle={t('lessOfferw')}
                                        />
                                    )}

                                    {state.showBranches && (
                                        <DropDowenMenu
                                            onCloseFn={(val) => {
                                                if (typeof val?.branchId === "string") {
                                                    setstate((old) => ({
                                                        ...old,
                                                        showBranches: false,

                                                    }));
                                                    setFieldError("Branches", "You must pick a city!");
                                                } else {
                                                    setFieldValue("Branches", val.branchId);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showBranches: false,
                                                        selectedBranches: val,
                                                    }));
                                                }
                                            }}
                                            title={t("Branches")}
                                            currentFilter={state.selectedBranches}
                                            items={state.branches}
                                            style={{ flex: 0.3 }}
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
        radioButton: {
            height: PixelPerfect(20),
            width: PixelPerfect(20),
            borderRadius: PixelPerfect(20) / 2,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioButtonSelected: {
            height: PixelPerfect(10),
            width: PixelPerfect(10),
            borderRadius: PixelPerfect(10) / 2,
            backgroundColor: theme.active,
        },
        yesNocon: {
            alignItems: "center",
            flex: 0.5
        },
        dateCon: {
            backgroundColor: theme.optionText,
            padding: PixelPerfect(5),
            borderRadius: PixelPerfect(5)
        },
        imagePreview: {
            width: PixelPerfect(100),
            height: PixelPerfect(100),
            borderRadius: PixelPerfect(8),
            resizeMode: "cover"
        }
    });
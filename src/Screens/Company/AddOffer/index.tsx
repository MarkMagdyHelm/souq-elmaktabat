import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { ArrowDownIcon, ArrowUpIcon, CalenderIcon } from '../../../Assets/Svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { RootState } from '../../../Store/store';
import DropDowenMenu from '../../../Components/DropDowenMenus/DropDowenMenu';
import RadiobuttonChoice from '../../../Components/PopUps/RadiobuttonChoice';
import { amounts } from '../../../Helper';

type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    //   const {  } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);


    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        loading: false,
        showtype: false,
        showSize: false,
        showWight: false,
        showQuntity: false,
        showDate: false,
        showBranches: false,
        isdelervable: false,
        date: new Date(),
        selectedPaperType: { name: "", arName: "", id: "" },
        selectedPaperSize: { name: "", arName: "", id: "" },
        selectedPaperQuntaity: { name: "", arName: "", id: "" },
    });
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const handelDelery = () => {
        setstate(old => ({ ...old, isdelervable: !old.isdelervable }))
    }
    const handleSubmit = (values) => {
        setstate(old => ({ ...old, loading: true }))

    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const onChange = (event, selectedDate) => {
        setstate(old => ({ ...old, showDate: Platform.OS === 'ios' }));
        if (selectedDate && selectedDate >= new Date()) {
            setstate(old => ({ ...old, date: selectedDate }));
        }
    };
    const { paperwidth, paperSize } = useSelector((state: RootState) => state.settings);
    console.log('====================================');
    console.log(state.selectedPaperSize.arName);
    console.log('====================================');
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("addoffer1")} />
            <View style={styles.con}>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{

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

                                            setstate((old) => ({ ...old, showtype: true }));
                                        }}
                                    >
                                        <Text style={[layout.textAlign, styles.label]}>{t("paperType")}</Text>
                                        <View style={[layout.rowBox, styles.selectMenue]}>
                                            <Text style={styles.textselectmenu}>
                                                {typeof state.selectedPaperType.id !== "string"
                                                    ? dir === "rtl"
                                                        ? state.selectedPaperType.arName
                                                        : state.selectedPaperType.name
                                                    : t("paperTypew")}
                                            </Text>
                                            {state.showtype ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </View>
                                        {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
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
                                        {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
                                    </Pressable>

                                    <Inputs
                                        label={t("paperWight")}
                                        options={{
                                            onBlur: handleBlur("PhoneNumber"),
                                            onChangeText: handleChange("PhoneNumber"),
                                            placeholder: t("paperWightw"),
                                            maxLength: 5,
                                            keyboardType: "number-pad",
                                        }}
                                        password={false}
                                        isPhone={false}
                                        input={{}}
                                        showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean}
                                        error={errors.PhoneNumber as any}
                                    />

                                    <Inputs
                                        label={t("paperPrice")}
                                        options={{
                                            onBlur: handleBlur("PhoneNumber"),
                                            onChangeText: handleChange("PhoneNumber"),
                                            placeholder: t("paperPricew"),
                                            maxLength: 5,
                                            keyboardType: "number-pad",
                                        }}
                                        password={false}
                                        isPhone={false}
                                        input={{}}
                                        showErrorr={(errors.PhoneNumber && touched.PhoneNumber) as boolean}
                                        error={errors.PhoneNumber as any}
                                    />



                                    <Pressable
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
                                        {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
                                    </Pressable>

                                    <Inputs
                                        label={t("paperdis")}
                                        options={{
                                            onBlur: handleBlur("Addresses"),
                                            onChangeText: handleChange("Addresses"),
                                            numberOfLines: 2,
                                            placeholder: t("paperdisw"),
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
                                        {errors.Role && touched.Role && <Text style={[styles.errorText, {}]}>{t(errors.Role as any)}</Text>}
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
                                                {t("paperBranchw")}
                                            </Text>
                                            {state.showBranches ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        </View>
                                        {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
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
                                        {errors.Role && touched.Role && <Text style={styles.errorText}>{t(errors.Role as any)}</Text>}
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
                                                    setFieldError("City", "You must pick a city!");
                                                } else {
                                                    setFieldValue("City", val.id);

                                                    setstate((old) => ({
                                                        ...old,
                                                        showtype: false,
                                                        selectedPaperType: val,
                                                    }));
                                                }
                                            }}
                                            title={t("paperTypew")}
                                            currentFilter={state.selectedPaperType}
                                            items={paperwidth}
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
                                                    setFieldError("City", "You must pick a city!");
                                                } else {
                                                    setFieldValue("City", val.id);

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
                                             
                                                setFieldTouched("Activities");
                                                if (!val?.hasOwnProperty("isSelected")) {

                                                    setFieldError("Activities", "You must choose a market!");
                                                    setstate((old) => ({
                                                        ...old,
                                                        showQuntity: false,
                                                    }));
                                                } else {
                                                    console.log('==============dddddd======================');
                                                    console.log(val,val.hasOwnProperty("id"));
                                                    console.log(typeof val);
                                                    console.log('====================================');

                                                    setFieldValue("Activities", val);
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
        }
    });
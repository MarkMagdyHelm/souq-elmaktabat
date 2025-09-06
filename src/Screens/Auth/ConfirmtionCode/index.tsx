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
import { Formik } from 'formik';
import HeaderWithText from '../../../Components/Headers/HeaderWithText';
import { validationSchema } from '../../../Validation/ConfirmationCode';
import { OtPIcone, TimerIcone } from '../../../Assets/Svg';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
type Props = {
    navigation: any
};

const Index = (props: Props) => {
    const { navigation } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        loading: false
    });
    const keyboard = useKeyboard();
    const dispatch = useDispatch();
    const showToast = useToastNotification();
    const CELL_COUNT = 4;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [propss, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [timeLeft, setTimeLeft] = useState(120);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }

        // cleanup interval when paused or finished
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            setTimeLeft(120)
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [timeLeft]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("confirmtxt1")} />
            <View style={styles.con}>
                <View style={styles.conhit1}>
                    <Text style={[layout.textAlign, styles.txthittitle1]}>{t("confirmtxt1")}</Text>
                    <Text style={[layout.textAlign, styles.txthit1]}>{t("contxthint1")}</Text>
                </View>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        Code: "",
                    }}
                    onSubmit={(values) => { navigation.navigate("RegisterInformation") }} >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {

                        return (
                            <>
                                <Content
                                    noPadding
                                    style={styles.body}
                                    scrollEnabled={false}  >
                                    <View style={[layout.center]}>
                                        <OtPIcone />
                                    </View>
                                    <CodeField
                                        ref={ref}
                                        {...props}
                                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                        value={value}
                                        onBlur={handleBlur('Code')}
                                        onChangeText={(val) => {
                                            setValue(val)
                                            setFieldValue('Code', val)
                                        }}
                                        onSubmitEditing={() => {
                                            handleSubmit()
                                            Keyboard.dismiss();
                                        }}
                                        cellCount={CELL_COUNT}
                                        rootStyle={styles.codeFieldRoot}
                                        keyboardType="number-pad"
                                        textContentType="oneTimeCode"
                                        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                                        testID="my-code-input"
                                        renderCell={({ index, symbol, isFocused }) => (
                                            <Text
                                                key={index}
                                                style={[styles.cell, isFocused && styles.focusCell]}
                                                onLayout={getCellOnLayoutHandler(index)}>
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        )}
                                    />
                                    {(errors.Code && touched.Code) && <Text style={styles.errorText}>{t(errors.Code)}</Text>}
                                    {isRunning&&<View style={[layout.rowBox, layout.center]}>

                                        <TimerIcone />
                                        <Text style={styles.timertxt}>
                                            {formatTime(timeLeft)}
                                        </Text>
                                    </View>}
                                    <Pressable style={styles.signUpCon} onPress={() => { setIsRunning(true) }}
                                        disabled={isRunning}>
                                        <Text style={[styles.signUpText,isRunning&&{color:theme.deactive}]}>{t("confirmtxt3")}
                                            <Text style={[styles.signUpText1,isRunning&&{color:theme.deactive}]}>{t("confirmtxt4")}</Text>
                                        </Text>
                                    </Pressable>
                                    <View style={{ backgroundColor: theme.mainColor }}>
                                        <Button
                                            title={t('Next')}
                                            loader={state.loading}
                                            styleTitle={styles.buttonText}
                                            onPress={() => {
                                                handleSubmit();

                                            }}
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
            flex: 1,
            paddingHorizontal: PixelPerfect(16)
        },
        conhit1: {
            marginTop: PixelPerfect(30),
        },
        txthittitle1: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.textColor,
        },
        txthit1: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
            marginTop: PixelPerfect(8)
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
        root: {
            flex: 1,
            //   padding: 20
        },
        codeFieldRoot: {
            marginVertical: PixelPerfect(24),
            paddingHorizontal: PixelPerfect(21)
        },
        cell: {
            width: PixelPerfect(60),
            height: PixelPerfect(60),
            lineHeight: PixelPerfect(58),
            fontSize: 24,
            borderWidth: PixelPerfect(1),
            borderRadius: PixelPerfect(8),
            borderColor: theme.deactive,
            textAlign: 'center',
            color: Colors.secondColor,

        },
        focusCell: {
            borderColor: Colors.secondColor,
        },
        timertxt: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(20),
            color: theme.black,
            textAlign: "center",
            paddingHorizontal: PixelPerfect(2),
            marginTop: PixelPerfect(5),

        },
        errorText: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(14),
            color: theme.red_yellow,
            textAlign: dir === "rtl" ? "right" : "left",
            marginBottom: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(10)
        }
    });
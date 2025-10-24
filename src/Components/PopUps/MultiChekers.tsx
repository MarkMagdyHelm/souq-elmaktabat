import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import Modal from 'react-native-modal';
import { CheckBoxEmptyIcon, CheckBoxIcon, CloseIcon } from '../../Assets/Svg'
import Button from '../touchables/Button'
import { Formik } from 'formik'
import { validationSchema } from '../../Validation/activity'
import Inputs from '../inputs/index'
import { useKeyboard } from '../../Constants/UseKayboard'
import { SetActivites, SetPayments, SetRoles, SetTools } from '../../Store/actions/settings'
import { useDispatch } from 'react-redux'
type Props = {
    onCloseFn: (val: any) => void,
    currentFilter: any,
    items: any,
    title: string,
    style: ViewStyle,
    hasTextInput?: boolean,
    type: string;
    textinputTitle?: string
}

const MultiChekers = (props: Props) => {
    const {
        onCloseFn,
        currentFilter,
        items,
        title,
        style,
        hasTextInput,
        type,
        textinputTitle
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    console.log('============currentFilter========================');
    console.log(currentFilter);
    console.log('====================================');
    const [state, setstate] = useState({
        items: items,
        selectFilter: currentFilter,
        isScroll: false
    });
    const dispatch = useDispatch();
    const flatListRef = useRef(null);

    const handelCheck = (index: number) => {
        if (type == "activities") {
            setstate((old) => {
                const updatedItems = old.items.map((item, i) =>
                    i === index ? { ...item, isSelected: !item.isSelected } : item
                );

                const ActivitesSelected = updatedItems.filter((el) => el.isSelected);
                dispatch(SetActivites(updatedItems));
                return {
                    ...old,
                    items: updatedItems,
                    selectFilter: ActivitesSelected,
                    isScroll: false
                };
            });
        }

        if (type == "tools") {
            setstate((old) => {
                const updatedItems = old.items.map((item, i) =>
                    i === index ? { ...item, isSelected: !item.isSelected } : item
                );

                const ToolsSelected = updatedItems.filter((el) => el.isSelected);
                dispatch(SetTools(updatedItems));
                return {
                    ...old,
                    items: updatedItems,
                    selectFilter: ToolsSelected,
                    isScroll: false
                };
            });
        }
        if (type == "payments") {
            setstate((old) => {
                const updatedItems = old.items.map((item, i) =>
                    i === index ? { ...item, isSelected: !item.isSelected } : item
                );

                const PaymentsSelected = updatedItems.filter((el) => el.isSelected);
                dispatch(SetPayments(updatedItems));
                return {
                    ...old,
                    items: updatedItems,
                    selectFilter: PaymentsSelected,
                    isScroll: false
                };
            });
        }
    };

    const keyboard = useKeyboard();

    const handleSubmmit = (values) => {
        setstate((old) => {
            if (values.activites != 0) {

                const newItem = {
                    arName: values.activity,
                    isSelected: true,
                    name: values.activity,
                };

                // check if it already exists (by arName or name)
                const exists = old.items.some(
                    (el) => el.arName == values.activity || el.name == values.activity
                );

                // if exists, return old state without changes
                if (exists) {
                    return old;
                }

                const updatedItems = [...old.items, newItem] as any;
                if (type == "activities") {

                    dispatch(SetActivites(updatedItems));
                    const ActivitesSelected = updatedItems.filter((el) => el.isSelected);

                    return {
                        ...old,
                        items: updatedItems,
                        selectFilter: ActivitesSelected,
                        isScroll: true,
                    };
                }

                if (type == "tools") {

                    dispatch(SetTools(updatedItems));
                    const ToolsSelected = updatedItems.filter((el) => el.isSelected);

                    return {
                        ...old,
                        items: updatedItems,
                        selectFilter: ToolsSelected,
                        isScroll: true,
                    };
                }

            }
        });
        //   handleSubmit2()
    };
    useEffect(() => {
        if (state.isScroll) {

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });

            }, 100);
        }
    }, [state.items])
    const handleSubmit2 = () => {
        onCloseFn && onCloseFn(state.selectFilter)
    }
    return (
        <Modal
            backdropOpacity={0.2}
            //    backdropColor='#00000'
            onBackButtonPress={() => {
                onCloseFn && onCloseFn(state.selectFilter)
            }}
            onBackdropPress={() => {
                onCloseFn && onCloseFn(state.selectFilter)
            }}
            isVisible={true}
            style={{ margin: 0, justifyContent: keyboard ? "flex-start" : "flex-end", marginTop: keyboard ? PixelPerfect(40) : 0 }}
        >
            <View style={[styles.con, style, (Platform.OS == "android" && keyboard) && { flex: 1 }]}>
                <View style={[layout.rowBox, styles.headerCon]}>
                    <Text style={styles.title}>{title}</Text>
                    <Pressable style={styles.CloseCon}
                        unstable_pressDelay={100}
                        onPress={() => { onCloseFn && onCloseFn(state.selectFilter) }}>
                        <CloseIcon />
                    </Pressable>
                </View>
                <View style={[styles.listCon, !hasTextInput && { flex: 0.7 }]}>
                    <FlatList
                        ref={flatListRef}
                        showsVerticalScrollIndicator={false}
                        //   onRefresh={() =>{}}
                        //   refreshing={isFetching}
                        style={styles.list}
                        data={state.items}

                        keyExtractor={(items, index: number) => index.toString()}
                        ItemSeparatorComponent={() => (<View style={{ height: PixelPerfect(18) }} />)}
                        renderItem={({ item, index }) => {
                            console.log('==========sss==========================');
                            console.log(hasTextInput, item.name);
                            console.log('====================================');
                            return (
                                <Pressable style={[layout.rowBox, styles.filterCon]} onPress={() => { handelCheck(index) }}>
                                    {item.isSelected ? <CheckBoxIcon /> : <CheckBoxEmptyIcon />}
                                    <Text style={styles.filterText}>{!hasTextInput ? item.name : (dir == "rtl" ? item.arName : item.name)}</Text>
                                </Pressable>
                            );
                        }}
                        ListFooterComponent={() => (<View style={{ height: PixelPerfect(10) }} />)}
                    />
                </View>
                {hasTextInput ? <ScrollView
                    automaticallyAdjustKeyboardInsets
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 0.05, paddingHorizontal: PixelPerfect(20) }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{
                            activity: "",
                        }}
                        onSubmit={handleSubmmit} >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => {
                            console.log('====================================');
                            console.log(errors);
                            console.log('====================================');
                            return (
                                <>
                                    <Inputs
                                        // label={t('Email')}
                                        options={{
                                            onBlur: handleBlur("activity"),
                                            onChangeText: handleChange("activity"),
                                            placeholder: textinputTitle,
                                            maxLength: 30,
                                            keyboardType: 'email-address',
                                            // onSubmitEditing:handleSubmmit
                                        }}
                                        password={false}
                                        showErrorr={(errors.activity && touched.activity) as boolean}
                                        error={errors.activity as any}

                                    />
                                    <Button
                                        title={t('Save')}
                                        styleTitle={styles.buttonText}
                                        onPress={handleSubmit}
                                        style={styles.button}
                                    />
                                </>
                            )
                        }}

                    </Formik>

                </ScrollView>
                    :
                    <View style={{ flex: 0.2, paddingHorizontal: PixelPerfect(16) }}>

                        <Button
                            title={t('Save')}
                            styleTitle={styles.buttonText}
                            onPress={handleSubmit2}
                            style={styles.button}
                        />
                    </View>
                }
            </View>
        </Modal>
    )
}

export default MultiChekers

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        con: {

            backgroundColor: Colors.white,
            borderTopRightRadius: PixelPerfect(8),
            borderTopLeftRadius: PixelPerfect(8),
            paddingVertical: PixelPerfect(20)
        },
        title: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(20),
            color: theme.black,
            marginBottom: PixelPerfect(20),
            textAlign: dir == "rtl" ? "right" : "left",
  lineHeight:PixelPerfect(25)
        },
        filterCon: {
            alignItems: "center",
            marginBottom: PixelPerfect(10),
            paddingHorizontal: PixelPerfect(24),
            paddingVertical: PixelPerfect(3),
        },
        filterText: {
            fontFamily: Fonts.regular,
            fontSize: PixelPerfect(16),
            color: theme.black,
            paddingHorizontal: PixelPerfect(5),
            paddingTop: Platform.OS == "ios" ? PixelPerfect(3) : 0
        },
        listCon: {
            flex: 0.99
        },
        list: {

        },
        headerCon: {
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: PixelPerfect(16),

        },
        CloseCon: {
            height: PixelPerfect(50),
            width: PixelPerfect(50)
        },
        button: {
            backgroundColor: Colors.secondColor,
            height: PixelPerfect(50),
            alignItems: "center",
            justifyContent: "center",
            marginTop: PixelPerfect(10),

        },
        buttonText: {
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(18),
            color: theme.mainColor,
        },
    })
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect } from '../../Constants/styleConstants';


import { AddressIcon, Call2Icon, CancelIcon, CheckIcon, CheckIcon1, RateIcon } from '../../Assets/Svg';

import { Container, Content } from '../../Components/containers/Containers';
import { useRoute } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { CallNumber, GetNamesByLang } from '../../Helper';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import MultiChekers from '../../Components/PopUps/MultiChekers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { UpdateRequest } from '../../Apis/Request';
import { useToast } from 'react-native-toast-notifications';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import RatingScreen from '../../Components/PopUps/RatingScreen';
type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props;

    const { item } = useRoute().params as any;
    const [state, setstate] = useState({
        loading: false,
     
        requestStatus: 0,

    });
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir, state.requestStatus);

    const [visibleCancel, setVisibleCancel] = useState(false);
    const [visibleCancelResones, setVisibleCancelResones] = useState(false);
    const [rejectReasonId, setRejectReasonId] = useState(null);
    const [statusId, setStatusIds] = useState(0);
    const [requestId, setRequestId] = useState(0);
    const [viewRate, setViewRate] = useState(false);
    const [rejectReason, setRejectReason] = useState(null);
    const { rejectReasons, offerRequestStatus } = useSelector((state: RootState) => state.settings);
    const { isSeller } = useSelector((state: RootState) => state.auth);


    const dispatch = useDispatch();
    const toast = useToast();


    const toastNotfication = (config: any) => {
        toast.hideAll();
        toast.show(config.message, {
            type: config.type,
            duration: 3000,
            offset: 50,
            animationType: "slide-in",
            placement: "top",
        } as any);
    };

    const translateStatus = (status: any) => {
        switch (status) {
            case "قيد الانتظار":
                return 0;
            case "طلب مقبول":
                return 1;
            case "طلب ملغي":
                return 2;
            case "تم التسليم":
                return 3;
            case "طلب منتهي":
                return 4;
            case "طلب جديد":
                return 5;

        }
    };


 

    const [date, time] = (item?.date ?? "").split("T");


    useEffect(() => {

        setstate(old => ({ ...old, requestStatus: translateStatus(item.status) }));

    }, []);

    const body = Object.fromEntries(
        Object.entries({
            requestId,
            statusId,
            rejectReasonId,
            rejectReason,
        }).filter(([_, value]) => value !== null && value !== undefined && value !== 0)
    );
    const updateRequest = (
        requestId?: number,
        statusId?: number,
        rejectReasonId?: number,
        rejectReason?: string
    ) => {
        setstate(old => ({ ...old, loading: true }));
        console.log('==================dddffffff==================');
        console.log(statusId);
        console.log('====================================');
        dispatch<any>(
            UpdateRequest(
                { requestId, statusId, rejectReasonId, rejectReason, },
                (res, status) => {
                    if (res.status === 200) {
                        console.log('==================dddddddd==================');
                        console.log(res.data);
                        console.log('====================================');
                    } else {
                        toastNotfication({
                            type: "error",
                            message: res?.Message ?? "حدث خطأ ما",
                        });
                    }

                    setstate(old => ({ ...old, loading: false }));
                }
            )
        );
    };

    //const reasons=  rejectReasons.filter(item => item.isDisplayed && !isSeller);

    return (
        <Container showHint={false}>
            <HeaderWithText title={"تفاصيل الطلب"} />
           
            {visibleCancelResones && <MultiChekers
                onCloseFn={(val) => {
                    setVisibleCancelResones(false)
                    console.log('=================rejectReasons===================');
                    console.log(rejectReasons.filter(item => item.isSelected));
                    console.log('====================================');

                }}
                title={"حدد اسباب الالغاء "}
                currentFilter={""}
                items={rejectReasons}
                style={{ flex: 0.6 }}
                type="rejectReasons"
                hasTextInput={true}
                textinputTitle={'اكتب اسباب الالغاء'}
            />}
            <CancelOrder visible={visibleCancel} onClose={() => setVisibleCancel(false)} onSubmit={() => {
                setVisibleCancelResones(true)
                setVisibleCancel(false)
            }} />
            <Content style={styles.formCon} noPadding >
                <View style={styles.card}>

                    <View style={[layout.dirRow, styles.row]}>
                        <View style={styles.con1}>
                            <View style={[layout.dirRow, { justifyContent: "space-between", alignItems: "center" }]}>
                                <TouchableOpacity style={styles.statusBtn} onPress={() => { }}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </TouchableOpacity>
                                <View style={[layout.rowBox, { alignItems: "center" }]}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
                                    <View>
                                        <Text style={[layout.textAlign, styles.name]}>{item.userName}</Text>
                                        <View style={[layout.rowBox]}>
                                            <Text style={{ color: theme.currenctText }}>{"⭐"}</Text>
                                            <Text style={[styles.rateText]}>{"(" + item.userRateCount + ")"}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                            <View style={[layout.rowBox, styles.actions, { alignItems: "center" }]}>

                                <AddressIcon color={Colors.white} />

                                <Text style={[layout.textAlign, styles.date1, { marginHorizontal: PixelPerfect(8) }]}>{item.branch}</Text>
                            </View>
                            <Text style={styles.product}>{item.category + " " + item.paperName + " " + item.paperSize}</Text>



                            <View style={styles.actions}>
                                <Text style={styles.date}>التاريخ: </Text>
                                <Text style={styles.date1}>{date}</Text>
                            </View>

                            <View style={styles.actions}>
                                <Text style={styles.date}>الكمية: </Text>
                                <Text style={styles.date1}>{item.quentity} كرتونه </Text>
                            </View>

                            <View style={styles.actions}>
                                <Text style={styles.date}>الاجمالي: </Text>
                                <Text style={styles.total}>{item.price} جنيها</Text>
                            </View>

                            {state.requestStatus === 1 && <View style={[layout.dirRow, styles.actions]}>
                                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => { CallNumber(item.phoneNumber) }} >
                                    <View style={[styles.icon]}>
                                        <Call2Icon />
                                    </View>
                                    <Text style={styles.acceptText}>تواصل الان</Text>

                                </TouchableOpacity>

                            </View>}

                            {state.requestStatus === 1 && <View style={[styles.actions]}>

                                <TouchableOpacity style={[layout.rowBox, styles.receiveBtn]} onPress={() => {

                                    updateRequest(item.requestId, 5, null, null)
                                }} >
                                    <View style={[styles.icon]}>
                                        <CheckIcon />
                                    </View>

                                    <Text style={styles.receiveText}>تم التسليم</Text>

                                </TouchableOpacity>
                                <Text style={styles.deliveryNote}>{"في حاله استلام الطلب اضغط علي تم التسليم"}</Text>

                            </View>}



                            {state.requestStatus === 5 && <View style={[layout.dirRow, styles.actions]}>
                                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => { CallNumber(item.phoneNumber) }} >
                                    <View style={[styles.icon]}>
                                        <CheckIcon1 />
                                    </View>
                                    <Text style={styles.acceptText}>قبول</Text>

                                </TouchableOpacity>

                            </View>}
                            {(state.requestStatus === 5) && (<View style={[layout.dirRow, styles.actions]}>

                                <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} >
                                    <View style={[styles.icon]}>
                                        <CancelIcon />
                                    </View>
                                    <Text style={styles.cancelText}>رفض</Text>

                                </TouchableOpacity>
                            </View>
                            )}

                            {(state.requestStatus === 0) && (<View style={[layout.dirRow, styles.actions]}>

                                <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => setVisibleCancel(true)} >
                                    <View style={[styles.icon]}>
                                        <CancelIcon />
                                    </View>
                                    <Text style={styles.cancelText}>الغاء الطلب</Text>

                                </TouchableOpacity>
                            </View>
                            )}
                            {state.requestStatus === 3 && <View style={[layout.dirRow, styles.actions]}>
                                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => {
                                setViewRate(true)
                                }} >
                                    <View style={[styles.icon]}>
                                        <RateIcon />
                                    </View>
                                    <Text style={styles.acceptText}>قيم البائع</Text>

                                </TouchableOpacity>

                            </View>}
                            {/* وصف المنتج */}
                            <View style={styles.actions}>
                                <Text style={styles.description}>وصف المنتج </Text>
                                <Text style={styles.description1}>{item.description}</Text>
                            </View>
                            {/* <View >

                                <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                    <Text style={styles.note}>النوع</Text>
                                    <Text style={styles.note1}>{item.paperName}</Text>
                                </View>
                                <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                    <Text style={styles.note}>الحجم</Text>
                                    <Text style={styles.note1}>{item.paperSize}</Text>
                                </View>
                                <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                    <Text style={styles.note}>الوزن</Text>
                                    <Text style={styles.note1}>{item.width}</Text>
                                </View>

                            </View>
                             */}

                            {state.requestStatus === 2 && <View >
                                <Text style={styles.cancel}>{item.rejectBy}</Text>
                                <Text style={styles.cancel}>{"سبب الالغاء:"}</Text>

                            </View>
                            }
                            {(state.requestStatus === 2 || state.requestStatus === 4) &&
                                <Text style={styles.date1}>{item.rejectReason}</Text>
                            }
                            {/*التقييم*/}
                            {/* <Text style={styles.rate}>تقييمك للبائع : </Text>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.rating}>{"(5)"} ⭐⭐⭐⭐ </Text>
                                <Text style={styles.dateRate}>18 مايو 2025</Text>

                            </View>

                            <Text style={styles.rateNote}>جودة ممتازة وسعر مناسب. الورق أبيض نقي والطباعة عليه واضحة جداً. أنصح بالشراء.</Text> */}
                        </View>
                    </View>
                </View>


            </Content>
            <RatingScreen
                visible={viewRate}
                onClose={() => setViewRate(false)}
                onSubmit={() => setViewRate(false)}
             />
        </Container>
    )
    // return (

    //     <View style={{ flex: 1, justifyContent: 'center' }}>

    //         <DoneRate
    //             visible={visible}
    //             onClose={() => setVisible(false)}
    //             onSubmit={handleSubmit}
    //         />

    //     </View>
    // )
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string, requestStatus: number) =>
    StyleSheet.create({
        container: {
            flex: 1,

        },
        formCon: {
            flex: 1,
            backgroundColor: theme.mainColor,
            marginTop: PixelPerfect(36),
            paddingHorizontal: PixelPerfect(8),

        },
        card: {
            backgroundColor: theme.white,

            flexDirection: "column",
            ...Platform.select({
                ios: {
                    shadowColor: theme.black,
                    shadowOpacity: 0.06,
                    shadowOffset: { width: 0, height: 6 },
                    shadowRadius: PixelPerfect(10),
                },
                android: {
                    elevation: PixelPerfect(3),
                },
            }),
        },
        icon: {
            paddingHorizontal: PixelPerfect(2)
        },
        time: { fontSize: PixelPerfect(14), textAlign: "left", color: theme.deactive, fontFamily: Fonts.medium },
        row: { alignItems: "center" },
        avatar: { width: PixelPerfect(32), height: PixelPerfect(32), borderRadius: PixelPerfect(20) },
        name: { fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, paddingHorizontal: PixelPerfect(4) },
        rating: { fontSize: PixelPerfect(12), color: theme.currenctText, paddingEnd: PixelPerfect(8), paddingTop: PixelPerfect(4) },
        product: { fontSize: PixelPerfect(18), marginTop: PixelPerfect(8), color: theme.babyBlue, fontFamily: Fonts.bold },
        date: { fontSize: PixelPerfect(16), color: theme.textColor, fontFamily: Fonts.regular },
        date1: {
            fontSize: PixelPerfect(16), color: theme.black, fontFamily: Fonts.medium
            , textAlign: "right"
        },

        description: { fontSize: PixelPerfect(18), color: theme.babyBlue, fontFamily: Fonts.medium },
        description1: {
            fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.regular
            , textAlign: "right",

        },
        deliveryNote: {
            fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight
            , textAlign: "right",

        },
        rate: { fontSize: PixelPerfect(16), color: theme.babyBlue, fontFamily: Fonts.medium },
        rateNote: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight, paddingVertical: PixelPerfect(4) },
        dateRate: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight },

        note: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.textColor, marginTop: PixelPerfect(8) },

        note1: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.black, marginTop: PixelPerfect(8) },

        cancel: { fontSize: PixelPerfect(16), fontFamily: Fonts.medium, color: theme.red, marginTop: PixelPerfect(8) },

        total: {
            fontSize: PixelPerfect(16), color: theme.textColor, fontFamily: Fonts.medium
            , textAlign: "right"
        },
        quantity: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.medium },
        con1: { flex: 1, marginHorizontal: PixelPerfect(16) },
        price: { fontSize: PixelPerfect(14), color: theme.textColor, fontFamily: Fonts.bold },

        actions: { marginTop: PixelPerfect(8) },
        acceptBtn: {
            flex: 1,
            backgroundColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },
        receiveBtn: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },

        cancelBtn: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.red,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },

        callBtn: {

            marginLeft: PixelPerfect(6),
            height: PixelPerfect(20),
            width: PixelPerfect(20),

        },

        statusText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.white
        },

        statusBtn: {
            flex: 0.40,
            backgroundColor:
                requestStatus === 0
                    ? theme.currenctText
                    : requestStatus === 1
                        ? theme.green
                        : requestStatus === 2
                            ? theme.red
                            : requestStatus === 3
                                ? theme.textColor
                                : requestStatus === 4
                                    ? theme.deactive
                                    : theme.currenctText,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(4),
            alignItems: "center",
        },
        rejectBtn: {
            flex: 1,
            marginRight: PixelPerfect(5),
            borderWidth: PixelPerfect(1),
            borderColor: theme.youtube,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(10),
            alignItems: "center",
        },
        acceptText: {
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.white
        },
        receiveText: {
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.babyBlue
        },
        cancelText: {
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.red
        },
        rejectText: { fontSize: PixelPerfect(16), color: theme.youtube, fontFamily: Fonts.bold, },


        rateText: {
            color: theme.currenctText,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            textAlign: "right"
        },

    });
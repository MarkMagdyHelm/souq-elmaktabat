import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';


import { AddressIcon, Call2Icon, CancelIcon, CheckIcon, CheckIcon1, RateIcon, RateIcone } from '../../Assets/Svg';

import { Container, Content } from '../../Components/containers/Containers';
import { useRoute } from '@react-navigation/native';
import { CallNumber, GetNamesByLang } from '../../Helper';
import CancelOrder from '../../Components/PopUps/CancelOrder';
import MultiChekers from '../../Components/PopUps/MultiChekers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { AddRate, UpdateRequest } from '../../Apis/Request';
import { useToast } from 'react-native-toast-notifications';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import RatingScreen from '../../Components/PopUps/RatingScreen';
import { number } from 'yup';
import SignUpSuccess from '../../Components/PopUps/SignUpSuccess';
import Stars from '../../Helper/Stars';
import Space from '../../Helper/Space';
type Props = {
    navigation: any
}

const Index = (props: Props) => {
    const {
        navigation
    } = props;

    const { item: routeItem } = useRoute().params as any;
    const { source } = useRoute().params as any;
    const [item, setItem] = useState(routeItem);
    const [state, setstate] = useState({
        loading: false,
status:"",
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
    const [showSuccess, setShowSuccess] = useState(false);

    const [rejectReason, setRejectReason] = useState(null);
    const { rejectReasons, offerRequestStatus } = useSelector((state: RootState) => state.settings);
       const { isLogin, userdata, isSeller } = useSelector((state: RootState) => state.auth);
   
    const { onGoBack } = useRoute().params as any;

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
            case t("statusPending"):
            case "قيد الانتظار":
                return 0;
            case t("statusNew"):
            case "طلب جديد":
            case t("statusNew"):
            case "طلب جديد":
                return 1;
            case t("statusAccepted"):
            case "طلب مقبول":
                return 2;
            case t("statusCancelled"):
            case "طلب ملغي":
                return 3;
            case t("statusDelivered"):
            case "تم التسليم":
                return 5;
            case t("statusCompleted"):
            case "طلب منتهي":
                return 4;


        }
    };

const translateStatusById = (id: number) => {
  switch (id) {
    case 0:
      return t("statusPending");     // قيد الانتظار
    case 1:
      return t("statusNew");         // طلب جديد
    case 2:
      return t("statusAccepted");    // طلب مقبول
    case 3:
      return t("statusCancelled");   // طلب ملغي
    case 4:
      return t("statusCompleted");   // طلب منتهي
    case 5:
      return t("statusDelivered");   // تم التسليم
    default:
      return "";
  }
};

    const [date, time] = (item?.date ?? "").split("T");
  
    useEffect(() => {
        
        setstate(old => ({ ...old, requestStatus: translateStatus(item.status) }));
    }, [item.status]);
    useEffect(() => {
        const filteredList = (rejectReasons || []).filter(
          item => !item.isMerchant && item.isDisplayed
        );

      
        setRejectReason(filteredList)
      }, []);


    const updateRequest = (
        requestId?: number,
        statusId?: number,
        rejectReasonId?: number,
        rejectReason?: string,

    ) => {
        setstate(old => ({ ...old, loading: true }));
        dispatch<any>(
            UpdateRequest(
                { requestId, statusId, rejectReasonId, rejectReason, type: 1 },
                (res, status) => {
                    if (res.status === 200) {
                      // console.log('====================================');
                      // console.log("UpdateRequest",res,status);
                      // console.log('====================================');
                        setItem((old: any) => ({
                            ...old,
                            status:translateStatusById(statusId), 
                            requestStatus: statusId, 
                            rejectReason:rejectReason
                        }));
                        // handleBack(statusId)
                    } else {
                        toastNotfication({
                            type: "error",
                            message: res?.Message ?? t("Something Went wrong"),
                        });
                    }

                    setstate(old => ({ ...old, loading: false }));
                }
            )
        );
    };
    // const handleBack = (statusId: any) => {
    //     onGoBack?.(statusId);
    //     navigation.goBack();
    // };
    const addRate = (
        number?: string,
        description?: string,
        toUserId?: string,
        paperOfferRequestId?: string
    ) => {
        setstate(old => ({ ...old, loading: true }));

        dispatch<any>(
            AddRate(
                { number: number, description: description, toUserId: toUserId, paperOfferRequestId: paperOfferRequestId },
                (res, status) => {
                    if (res.status === 200) {
                        setShowSuccess(true)
                         setItem((old: any) => ({
    ...old,
    isRated: true,
  }));
                        setTimeout(() => {
                            setShowSuccess(false)
                            // navigation.reset({
                            //     index: 0,
                            //     routes: [
                            //         { name: 'Home2' },
                            //     ],
                            // });
                        }, 2000);
                    } else {
                        toastNotfication({
                            type: "error",
                            message: res?.Message ?? t("Something Went wrong"),
                        });
                    }

                    setstate(old => ({ ...old, loading: false }));
                }
            )
        );
    };
console.log('==========dddd==========================');
console.log(item);
console.log('====================================');

    return (
        <Container showHint={false}>
            <HeaderWithText title={t("orderDetailsTitle")} />

            {visibleCancelResones && <MultiChekers
                onCloseFn={(val) => {
                    // console.log('=======val=============================');
                    // console.log("val", val,val[0]?.id??null,val[0]?.id?null:val[0]?.name);
                    // console.log('====================================');
                    setVisibleCancelResones(false)
                   updateRequest(item.requestId, 3, val[0]?.id??null,val[0]?.name); }}
                title={t("selectCancelReasons")}
                currentFilter={""}
                items={rejectReason}
                style={{ flex: 0.6 }}
                type="rejectReasons"
                hasTextInput={true}
                textinputTitle={t("writeCancelReasons")}
            />}
            <SignUpSuccess show={showSuccess} title={t("ratingSuccess")} />
            <Content style={styles.formCon} noPadding >
                <View >


                    {/* userDetails */}
                    <View style={styles.con1} >
                        <View style={[layout.dirRow, {
                            justifyContent: "space-between",
                            alignItems: "center"
                        }]}>
                            <TouchableOpacity style={styles.statusBtn}>
                                <Text style={[layout.textAlign, styles.statusText]}>{
                                (item.status === "طلب جديد" && source === "orders") ? "قيد الانتظار" :
                         (item.status === "new order" && source === "orders") ? "pinging" : item.status} </Text>
                            </TouchableOpacity>
                            <View style={[layout.rowBox, { alignItems: "center" }]}>
                                <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
                                <View>
                                    <Text style={[layout.textAlign, styles.name]}>{item.userName}</Text>
                                    <Stars rating={item.userRateAverage} rateCount={item.userRateCount} />
                                </View>

                            </View>
                        </View>
                        {/* address */}
                        <View style={[layout.rowBox, styles.actions, { alignItems: "center" }]}>
                            <AddressIcon color={Colors.white} />
                            <Text style={[layout.textAlign, styles.date1,
                            { marginHorizontal: PixelPerfect(8) }]}>{item.branch}</Text>
                        </View>
                        <Text style={[layout.textAlign, styles.date,
                        { marginHorizontal: PixelPerfect(8) }]}>{item.branch}</Text>
                    </View>
                    <Space />
                    {/* productDetails */}
                    <View style={styles.con1} >
                        <Text style={[layout.textAlign, styles.product]}>{item.category + " " + item.paperName + " " + item.paperSize}</Text>

                        <View style={styles.actions}>
                            <Text style={[layout.textAlign, styles.date]}>{t("date")}</Text>
                            <Text style={[layout.textAlign, styles.date1]}>{date}</Text>
                        </View>

                        <View style={styles.actions}>
                            <Text style={[layout.textAlign, styles.date]}>{t("quantity")}</Text>
                            <Text style={[layout.textAlign, styles.date1]}>{item.quentity} {t("carton")} </Text>
                        </View>

                        <View style={styles.actions}>
                            <Text style={[layout.textAlign, styles.date]}>{t("total")}</Text>
                            <Text style={[layout.textAlign, styles.total]}>{item.price} {t("pound")}</Text>
                        </View>

                        {(state.requestStatus === 2 && userdata.id != item.userId)&& <View style={[layout.dirRow, styles.actions]}>
                            <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => { CallNumber(item.phoneNumber) }} >
                                <View style={[styles.icon]}>
                                    <Call2Icon />
                                </View>
                                <Text style={[layout.textAlign, styles.acceptText]}>{t("contactNow")}</Text>

                            </TouchableOpacity>

                        </View>}

                        {(state.requestStatus === 2&&item.sellerId !=userdata.id) && <View style={[styles.actions]}>
                            <TouchableOpacity style={[layout.rowBox, styles.receiveBtn]} onPress={() => {
                                updateRequest(item.requestId, 5, null, null)
                            }} >
                                <View style={[styles.icon]}>
                                    <CheckIcon />
                                </View>

                                <Text style={styles.receiveText}>{t("delivered")}</Text>

                            </TouchableOpacity>
                            <Text style={[layout.textAlign, styles.deliveryNote]}>{t("deliveryNote")}</Text>

                        </View>}



                        {(state.requestStatus === 1 && source != "orders") && <View style={[layout.dirRow, styles.actions]}>
                            <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]}
                                onPress={() => {
                                    updateRequest(item.requestId, 2, null, null)
                                }} >
                                <View style={[styles.icon]}>
                                    <CheckIcon1 />
                                </View>
                                <Text style={[layout.textAlign, styles.acceptText]}>{t("accept")}</Text>

                            </TouchableOpacity>

                        </View>}
                        {(state.requestStatus === 1 && source != "orders") && (<View style={[layout.dirRow, styles.actions]}>

                            <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => {
                             setVisibleCancelResones(true)
                            }}>
                                <View style={[styles.icon]}>
                                    <CancelIcon />
                                </View>
                                <Text style={[layout.textAlign, styles.cancelText]}>{t("reject")}</Text>

                            </TouchableOpacity>
                        </View>
                        )}
                        {(state.requestStatus === 1 && source === "orders") && (<View style={[layout.dirRow, styles.actions]}>

                            <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => {
                                   // console.log('====================================');
                                // console.log("adsjjhsdjkjfhsjdsdkjfhsdh");
                                // console.log('====================================');
                                setVisibleCancelResones(true)}} >
                                <View style={[styles.icon]}>
                                    <CancelIcon />
                                </View>
                                <Text style={[layout.textAlign, styles.cancelText]}>{t("cancelOrder")}</Text>

                            </TouchableOpacity>

                        </View>
                        )}


                        {(state.requestStatus === 0) && (<View style={[layout.dirRow, styles.actions]}>

                            <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() =>{
                             
                                setVisibleCancelResones(true)}} >
                                <View style={[styles.icon]}>
                                    <CancelIcon />
                                </View>
                                <Text style={[layout.textAlign, styles.cancelText]}>{t("cancelOrder")}</Text>

                            </TouchableOpacity>
                        </View>
                        )}
                        {state.requestStatus === 5 && !item.isRated && source=="orders" && <View style={[layout.dirRow, styles.actions]}>
                            <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => {
                                setViewRate(true)
                            }} >
                                <View style={[styles.icon]}>
                                    <RateIcon />
                                </View>
                                <Text style={[layout.textAlign, styles.acceptText]}>{!isSeller ? t("rateSeller") : t("rateBuyer")}</Text>

                            </TouchableOpacity>

                        </View>}
                        {state.requestStatus === 5 && item.isRated && (
  <View style={[layout.dirRow, styles.actions]}>
    <View style={[layout.rowBox, styles.receiveBtn]}>
      <View style={styles.icon}>
        <CheckIcon />
      </View>
      <Text style={styles.receiveText}>{t("rated")}</Text>
    </View>
  </View>
)}
                    </View>
                    <Space />

                    {/* وصف المنتج */}
                    <View style={styles.con1} >
                        <View style={styles.actions}>
                            <Text style={[layout.textAlign, styles.description]}>{t("productDescription")}</Text>
                            <Text style={[layout.textAlign, styles.description1]}>{item.description}</Text>
                        </View>
                        {state.requestStatus === 3 && <View >
                            <Text style={[layout.textAlign, styles.cancel]}>{item?.rejectBy}</Text>
                            <Text style={[layout.textAlign, styles.cancel]}>{t("cancelReason")}</Text>

                        </View>
                        }
                        {(state.requestStatus === 4 || state.requestStatus === 3) &&
                            <Text style={[layout.textAlign, styles.date1,{color:"red"}]}>{item.rejectReason}</Text>
                        }
                    
                    </View>

                </View>


            </Content>
            <RatingScreen
                visible={viewRate}
                onClose={() => setViewRate(false)}
                item={item}
                onSubmit={(val) => {
                    addRate(val.rating, val.comment, item.sellerId, item.requestId)
                }}
            />
        </Container >
    )
    
}

export default Index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string, requestStatus: number) =>
    StyleSheet.create({

        formCon: {
            flex: 1,

        },

        icon: {
            paddingHorizontal: PixelPerfect(2)
        },
        time: { fontSize: PixelPerfect(14), textAlign: "left", color: theme.deactive, fontFamily: Fonts.medium },
        row: { alignItems: "center" },
        avatar: { width: PixelPerfect(32), height: PixelPerfect(32), borderRadius: PixelPerfect(20) },
        name: { lineHeight: PixelPerfect(25), fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.black, paddingHorizontal: PixelPerfect(4) },
        rating: { fontSize: PixelPerfect(12), color: theme.currenctText, paddingEnd: PixelPerfect(8), paddingTop: PixelPerfect(4) },
        product: { lineHeight: PixelPerfect(25), fontSize: PixelPerfect(18), color: theme.babyBlue, fontFamily: Fonts.bold },
        date: { lineHeight: PixelPerfect(25), fontSize: PixelPerfect(16), color: theme.textColor, fontFamily: Fonts.regular },
        date1: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16), color: theme.black, fontFamily: Fonts.medium
            , textAlign: "right"
        },

        description: { lineHeight: PixelPerfect(25), fontSize: PixelPerfect(18), color: theme.babyBlue, fontFamily: Fonts.medium },
        description1: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.regular
            , textAlign: "right",

        },
        deliveryNote: {
            lineHeight: PixelPerfect(20),
            fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight
            , textAlign: "right",

        },
        rate: { fontSize: PixelPerfect(16), color: theme.babyBlue, fontFamily: Fonts.medium },
        rateNote: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight, paddingVertical: PixelPerfect(4) },
        dateRate: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.extraLight },

        note: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.textColor, marginTop: PixelPerfect(8) },

        note1: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.black, marginTop: PixelPerfect(8) },

        cancel: { lineHeight: PixelPerfect(20), fontSize: PixelPerfect(16), fontFamily: Fonts.medium, color: theme.red, marginTop: PixelPerfect(8) },

        total: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16), color: theme.textColor, fontFamily: Fonts.medium
            , textAlign: "right"
        },
        quantity: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.medium },
        con1: { flex: 1, marginHorizontal: PixelPerfect(16) },
        price: { fontSize: PixelPerfect(14), color: theme.textColor, fontFamily: Fonts.bold },

        actions: { marginTop: PixelPerfect(8) },
        acceptBtn: {
            flex: 1,
            height: PixelPerfect(50),
            backgroundColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },
        receiveBtn: {
            flex: 1,
            height: PixelPerfect(50),
            borderWidth: 1,
            borderColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },

        cancelBtn: {
            flex: 1,
            height: PixelPerfect(50),
            borderWidth: 1,
            borderColor: theme.red,
            borderRadius: PixelPerfect(6),
            paddingVertical: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },



        statusText: {
            lineHeight: PixelPerfect(25),
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.white
        },

        statusBtn: {
            flex: 0.35,
            height: PixelPerfect(34),
            backgroundColor:
                requestStatus === 0
                    ? theme.currenctText
                    : requestStatus === 1
                        ? theme.currenctText
                        : requestStatus === 2
                            ? theme.green
                            : requestStatus === 3
                                ? theme.red
                                : requestStatus === 4
                                    ? theme.deactive
                                    : theme.textColor,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(4),
            alignItems: "center",
        },
        rejectBtn: {
            flex: 1,
            height: PixelPerfect(50),
            marginRight: PixelPerfect(5),
            borderWidth: PixelPerfect(1),
            borderColor: theme.youtube,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(10),
            alignItems: "center",
        },
        acceptText: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.white
        },
        receiveText: {
            lineHeight: PixelPerfect(25),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.babyBlue
        },
        cancelText: {
            lineHeight: PixelPerfect(25),
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
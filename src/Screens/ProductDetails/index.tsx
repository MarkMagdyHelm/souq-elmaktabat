import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../Constants/theming'
import { IFont, ITheme } from '../../Constants/interfaces'
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
    I18nManager,
    Platform,
    ScrollView,
    FlatList,
} from "react-native";
import { PixelPerfect } from '../../Constants/styleConstants';
import SellerBranches from '../../Components/Cards/SellerBranches';
import { Container, Content } from '../../Components/containers/Containers';
import { useRoute } from '@react-navigation/native';
import { AddPaperOfferRequest } from '../../Apis/Request';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import SignUpSuccess from '../../Components/PopUps/SignUpSuccess';
import { t } from 'i18next';
import HeaderWithText from '../../Components/Headers/HeaderWithText';
import { RateIcone } from '../../Assets/Svg';

type Props = {
    navigation: any
}
const Index = (props: Props) => {
    const {
        navigation
    } = props

    const { item } = useRoute().params as any;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    const pricePerUnit = item.price;
    const minQty = 1;
    const maxQty = 1500;
    const [qty, setQty] = useState(1);
    const [totalPrice, setTotalPrice] = useState(item.price);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);


    const dispatch = useDispatch();
    const [state, setState] = useState({
        loading: false,
        showSuccess: false
    });

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

    const total = useMemo(() => pricePerUnit * qty, [pricePerUnit, qty]);

    const decrease = () => {
        setQty((prev) => {
            const next = prev - 1;
            if (next < minQty) {
                Alert.alert(t("alert"), `${t("minQuantityAlert")} ${minQty}.`);
                return prev;
            }
            setTotalPrice(next * item.price)
            return next;
        });
    };

    const increase = () => {
        setQty((prev) => {
            const next = prev + 1;

            if (next > maxQty) {
                Alert.alert(t("alert"), `${t("maxQuantityAlert")} ${maxQty}.`);
                return prev;
            }
            setTotalPrice(next * item.price)
            return next;
        });
    };





    const addPaperOfferRequest = () => {
        setState((old) => ({ ...old, loading: true }));

        dispatch<any>(
            AddPaperOfferRequest({
                paperOfferId: item.id, paperOfferBranchId: selectedBranchId,
                quantity: qty, totalPrice: totalPrice
            }, (res, status) => {
                if (res.status === 200) {
                    setState((old) => ({
                        ...old,
                        requests: res.data.items ?? [],
                        loading: false, showSuccess: true
                    }));

                    setTimeout(() => {
                        setState(old => ({ ...old, showSuccess: false }));
                        navigation.navigate("MyOrders")
                    }, 2000);

                } else {
                    toastNotfication({
                        type: "error",
                        message: res?.Message ?? t("Something Went wrong"),
                    });
                    setState((old) => ({ ...old, loading: false }));
                }
            })
        );
    };


    const fullDate = item.endDate;
    const [date, time] = fullDate.split("T");
    return (
        <Container showHint={false}>
            <HeaderWithText title={t("productDetailsTitle")} />
            <Content style={styles.formCon} noPadding >
                <View >
                    <Image source={item.paperPhoto} style={styles.productImage} resizeMode="contain" />

                    <View style={styles.info}>
                        <Text style={[layout.textAlign,styles.title]}>{item.title}</Text>
                        <Text style={[layout.textAlign,styles.priceText]}>{item.categoryName + " " + item.paperName + " " + item.width + t("GM") + " " + item.paperSize}</Text>
                        <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                            <Text style={[layout.dirRow,styles.text1]}>{"(" + item.userRateCount + ")"}</Text>
                            <View style={[layout.rowBox]}>
                            <RateIcone/>
                                <Text style={[layout.textAlign,styles.text1]}>{"(" + item.userRateCount + ")"}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={[layout.textAlign,styles.sellerTitle]}>{t("sellerInfo")}</Text>
                            <View style={styles.sellerRow}>
                                <Image
                                    source={{ uri: item.userImages }}
                                    style={styles.sellerImage}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={[layout.textAlign,styles.sellerName]}>{item.userName}</Text>

                                </View>
                                <View style={[layout.rowBox]}>
                                <RateIcone/>
                                    <Text style={[layout.textAlign,styles.text1]}>{"(" + item.userRateAverage + ")"}</Text>
                                </View>
                            </View>

                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            //   onRefresh={() =>{}}
                            //   refreshing={isFetching}
                            style={styles.list}
                            data={item.paperOffersBranches}
                            keyExtractor={(items, index: number) => index.toString()}
                            // ItemSeparatorComponent={() => (state.loading ? null : <View style={styles.separator} />)}
                            renderItem={({ item }) => {
                                return (
                                    <>

                                        <SellerBranches item={item} onPress={() => setSelectedBranchId(item.id)}
                                            selected={selectedBranchId === item.id} />
                                        {/* } */}
                                    </>
                                );
                            }} />
                        {/* تحديد الكمية */}
                        <View>


                            <View style={[layout.rowBox, { justifyContent: "space-between", alignItems: "center" }]}>
                                <Text style={styles.sectionTitle}>{t("selectQuantity")}</Text>
                                <View style={[layout.dirRow, styles.quantityRow]}>
                                    <TouchableOpacity style={styles.qtyBtn} onPress={decrease} >
                                        <Text style={styles.qtyText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.qtyValue}>{qty}</Text>
                                    <TouchableOpacity style={styles.qtyBtn} onPress={increase}>
                                        <Text style={styles.qtyText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" ,marginVertical:PixelPerfect(4)}]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("minOrderQuantity")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{item.min}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("offerEndDate")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{date + " " + t("orUntilOutOfStock")}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("deliveryMethods")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>   {item.includeDelivery ? t("deliveryAvailable") : t("deliveryNotAvailable")}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginTop:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.totalPrice]}>{t("totalPrice")}</Text>
                                <Text style={[layout.textAlign,styles.totalPriceValue]}>{totalPrice + " " + t("pound")}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between"}]}>
                                <Text style={[layout.textAlign,styles.note]}>{""}</Text>
                                <Text style={[layout.textAlign,styles.note2]}>{t("excludingOtherFees")}</Text>
                            </View>


                            <TouchableOpacity style={styles.orderBtn} onPress={() => {

                                if (qty < item.min) {
                                    toastNotfication({
                                        type: "error",
                                        message:"Quantity less than min quantity"
                                    });
                                }
                                else if (selectedBranchId === null) {
                                    toastNotfication({
                                        type: "error",
                                        message:"Please select Branch"
                                    });
                                }
                                else {
                                    // navigation.navigate("MyOrders")
                                     addPaperOfferRequest()
                                }
                            }}>
                                <Text style={[layout.textAlign,styles.orderBtnText]}>{t("sendOrder")}</Text>
                            </TouchableOpacity>

                        </View>

                        {/* وصف المنتج */}
                        <View >
                            <Text style={[layout.textAlign,styles.sectionTitle]}>{t("productDescription")}</Text>
                            <Text style={[layout.textAlign,styles.description]}>
                                {item.description}
                            </Text>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("type")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{item.paperName}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("size")}</Text>
                                <Text style={[layout.textAlign,styles.note1]}>{item.paperSize}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between",marginVertical:PixelPerfect(4) }]}>
                                <Text style={[layout.textAlign,styles.note]}>{t("weight")}</Text>
                                <Text style={[layout.textAlign,styles.note1, { paddingBottom: PixelPerfect(8) }]}>{item.width + t("GM") + " "}</Text>
                            </View>

                        </View>
                    </View>
                </View>
                <SignUpSuccess show={state.showSuccess} title={t("orderSentSuccess")} />
            </Content>
        </Container>



    );
}
export default Index
const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        formCon: {
            flex: 1,
            backgroundColor: theme.mainColor,

            paddingHorizontal: PixelPerfect(8),

        },
        container: {
            flex: 1,
            padding: PixelPerfect(12),
        },
        card: {
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(14),
            padding: PixelPerfect(12),
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
        list: {
            marginHorizontal: PixelPerfect(4)
        },
        productImage: {
            width: "100%",
            height: PixelPerfect(187),
            borderRadius: PixelPerfect(8),

            marginBottom: PixelPerfect(10),
        },
        info: {
            paddingHorizontal: PixelPerfect(4),
        },
        title: {
            fontSize: PixelPerfect(16),
            color: theme.black,
            fontFamily: Fonts.bold,
       
            marginBottom: PixelPerfect(4),
        },
        rowSpace: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: PixelPerfect(8),

        },
        priceText: {
            fontSize: PixelPerfect(16),
            color: theme.babyBlue,
            fontFamily: Fonts.medium,
        },

        sellerRow: {
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: PixelPerfect(8),
        },
        sellerTitle: {
            fontSize: PixelPerfect(18),
            fontFamily: Fonts.medium,
            marginBottom: PixelPerfect(4),
            color: theme.babyBlue
        },
        sellerImage: { width: PixelPerfect(32), height: PixelPerfect(32), borderRadius: PixelPerfect(25), marginLeft: PixelPerfect(4) },

        sellerName: {
            fontSize: PixelPerfect(18),
            fontFamily: Fonts.medium,
            color: theme.black,
            textAlign: "right"
        },


        text1: {
            color: theme.currenctText,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            textAlign: "right"
        },


        sectionTitle: { fontSize: PixelPerfect(18), fontFamily: Fonts.medium, color: theme.babyBlue },
        quantityRow: { alignItems: "center" },
        qtyBtn: {
            width: PixelPerfect(40),
            height: PixelPerfect(40),
            backgroundColor: theme.textColor,
            borderRadius: PixelPerfect(8),
            marginHorizontal: PixelPerfect(10),
            justifyContent: "center",
            alignItems: "center"
        },
        qtyText: { color: theme.white, fontSize: 18 },
        qtyValue: { fontSize: PixelPerfect(32), fontFamily: Fonts.medium },
        note: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.textColor, marginTop: PixelPerfect(8) },
        note1: { textAlign: "right", fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.black, marginTop: PixelPerfect(8) },
        note2: { fontSize: PixelPerfect(10), fontFamily: Fonts.extraLight, color: theme.black, marginTop: PixelPerfect(2) },
        totalPrice: { fontSize: PixelPerfect(16), fontFamily: Fonts.medium, color: theme.textColor, marginTop: PixelPerfect(8) },
        totalPriceValue: { fontSize: PixelPerfect(14), fontFamily: Fonts.bold, color: theme.textColor, marginTop: PixelPerfect(8) },

        orderBtn: {
            backgroundColor: theme.babyBlue,
            borderRadius: PixelPerfect(8),
            padding: PixelPerfect(12),
            marginVertical: PixelPerfect(8),
            alignItems: "center",
        },
        orderBtnText: { color: theme.white, fontSize: PixelPerfect(16), fontFamily: Fonts.bold },
        description: { textAlign: "right", fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.regular, marginVertical: PixelPerfect(4) },

    });
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

    const pricePerUnit = 500;
    const minQty = 1;
    const maxQty = 1500;
    const [qty, setQty] = useState(1);
    console.log('==============item======================');
    console.log(item);
    console.log('====================================');

    const total = useMemo(() => pricePerUnit * qty, [pricePerUnit, qty]);

    const decrease = () => {
        setQty((prev) => {
            const next = prev - 1;
            if (next < minQty) {
                Alert.alert("تنبيه", `الحد الأدنى للكمية هو ${minQty}.`);
                return prev;
            }
            return next;
        });
    };

    const increase = () => {
        setQty((prev) => {
            const next = prev + 1;
            if (next > maxQty) {
                Alert.alert("تنبيه", `الحد الأقصى للكمية هو ${maxQty}.`);
                return prev;
            }
            return next;
        });
    };

    const onOrder = () => {

        Alert.alert(
            "تم إرسال الطلب",
            `لقد طلبت ${qty} ${item.unit} (السعر الكلي: ${total.toLocaleString()} جنيه).`
        );
    };

    const fullDate = item.endDate;
    const [date, time] = fullDate.split("T");
    return (
        <Container showHint={false}>
            <Content style={styles.formCon} noPadding >
                <View >
                    <Image source={item.paperPhoto} style={styles.productImage} resizeMode="contain" />

                    <View style={styles.info}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.priceText}>{item.categoryName + " " + item.paperName + " " + item.width + "جم " + item.paperSize}</Text>
                        <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                            <Text style={[styles.text1]}>{"(" + item.userRateCount+ ")"}</Text>
                            <View style={[layout.rowBox]}>
                                <Text style={{ color: theme.currenctText }}>{"⭐"}</Text>
                                <Text style={[styles.text1]}>{"(" + item.userRateCount+ ")"}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.sellerTitle}>معلومات البائع</Text>
                            <View style={styles.sellerRow}>
                                <Image
                                    source={{ uri: item.userImages }}
                                    style={styles.sellerImage}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sellerName}>{item.userName}</Text>

                                </View>
                                <View style={[layout.rowBox]}>
                                    <Text style={{ color: theme.currenctText }}>{"⭐"}</Text>
                                    <Text style={[styles.text1]}>{"(" + item.userRateAverage + ")"}</Text>
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

                                        <SellerBranches item={item} onPress={function (): void {
                                            throw new Error('Function not implemented.');
                                        }} />
                                        {/* } */}
                                    </>
                                );
                            }} />
                        {/* تحديد الكمية */}
                        <View>


                            <View style={[layout.rowBox, { justifyContent: "space-between", alignItems: "center" }]}>
                                <Text style={styles.sectionTitle}>حدد الكمية</Text>
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
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>اقل كمية للطلب</Text>
                                <Text style={styles.note1}>{item.min}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>تاريخ انتهاء العرض:</Text>
                                <Text style={styles.note1}>{date + " " + "او حتي نفاذ الكمية"}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>طرق الاستلام:</Text>
                                <Text style={styles.note1}>   {item.includeDelivery ? "متاح توصيل" : "غير متاح توصيل"}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.totalPrice}>اجمالي السعر:</Text>
                                <Text style={styles.totalPriceValue}>{item.price + "جنيها"}</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>{""}</Text>
                                <Text style={styles.note2}>غير شامل اي مصاريف اخري</Text>
                            </View>


                            <TouchableOpacity style={styles.orderBtn}>
                                <Text style={styles.orderBtnText}>إرسال الطلب</Text>
                            </TouchableOpacity>

                        </View>

                        {/* وصف المنتج */}
                        <View >
                            <Text style={styles.sectionTitle}>وصف المنتج</Text>
                            <Text style={styles.description}>
                                {item.description}
                            </Text>
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
                                <Text style={[styles.note1,{paddingBottom:PixelPerfect(8)}]}>{item.width + "جم "}</Text>
                            </View>

                        </View>
                    </View>
                </View>
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
            textAlign: "right",
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
            textAlign:"right"
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
        description: {textAlign:"right", fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.regular, marginVertical: PixelPerfect(4) },

    });
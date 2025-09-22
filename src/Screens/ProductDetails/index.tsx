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

type Props = {
    navigation: any
}
const Index = (props: Props) => {
    const {
        navigation
    } = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    const pricePerUnit = 500;
    const minQty = 2;
    const maxQty = 1500;
    const [qty, setQty] = useState(3);

    const product = {
        title: "ورق مرام 80جم",
        unit: "كرتونة",
        weight: "80 جرام/متر مربع",
        seller: "احمد محمد",
        location: "القاهرة، مصر الجديدة",
        description:
            "ورق طباعة ابيض نقي بجودة ممتازة، مناسب لجميع أنواع الطابعات. وزن 80 جرام وقياس A4.",
        image: require('../../Assets/Images/order-details.jpg'),
    };
    const [state, setstate] = useState({
        loading: false,
        items: [{ flag: false }, { flag: false }]

    });
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
            `لقد طلبت ${qty} ${product.unit} (السعر الكلي: ${total.toLocaleString()} جنيه).`
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}

                showsHorizontalScrollIndicator={false}>
                <View >
                    <Image source={product.image} style={styles.productImage} resizeMode="contain" />

                    <View style={styles.info}>
                        <Text style={styles.title}>{product.title}</Text>
                        <Text style={styles.priceText}>{product.unit}</Text>
                        <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                            <Text style={[styles.text1]}>{4}</Text>
                            <View style={[layout.rowBox]}>
                                <Text style={{ color: theme.currenctText }}>{"⭐"}</Text>
                                <Text style={[styles.text1]}>{"(" + 5 + ")"}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.sellerTitle}>معلومات البائع</Text>
                            <View style={styles.sellerRow}>
                                <Image
                                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                                    style={styles.sellerImage}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sellerName}>احمد محمد</Text>

                                </View>
                                <View style={[layout.rowBox]}>
                                    <Text style={{ color: theme.currenctText }}>{"⭐"}</Text>
                                    <Text style={[styles.text1]}>{"(" + 5 + ")"}</Text>
                                </View>
                            </View>

                        </View>

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            //   onRefresh={() =>{}}
                            //   refreshing={isFetching}
                            style={styles.list}
                            data={state.items}
                            keyExtractor={(items, index: number) => index.toString()}
                            // ItemSeparatorComponent={() => (state.loading ? null : <View style={styles.separator} />)}
                            renderItem={({ item }) => {
                                return (
                                    <>

                                        <SellerBranches loading={state.loading} onPress={function (): void {
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
                                    <TouchableOpacity style={styles.qtyBtn} >
                                        <Text style={styles.qtyText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.qtyValue}>{12}</Text>
                                    <TouchableOpacity style={styles.qtyBtn} >
                                        <Text style={styles.qtyText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>اقل كمية للطلب</Text>
                                <Text style={styles.note1}>2</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>تاريخ انتهاء العرض:</Text>
                                <Text style={styles.note1}>2025/09/25 او حتي نفاذ الكمية</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>طرق الاستلام:</Text>
                                <Text style={styles.note1}>متاح توصيل</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.totalPrice}>اجمالي السعر:</Text>
                                <Text style={styles.totalPriceValue}>1500 جنيها</Text>
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
                                ورق طباعة أبيض نقي بجودة ممتازة مناسب لجميع أنواع الطابعات.
                                يتميز بالسطح الأملس والمثالي للنسخ والطباعة...
                            </Text>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>النوع</Text>
                                <Text style={styles.note1}>مرام</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>الحجم</Text>
                                <Text style={styles.note1}>A4</Text>
                            </View>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.note}>الوزن</Text>
                                <Text style={styles.note1}>جرام/مترمربع</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>



    );
}
export default Index
const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
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
        },


        text1: {
            color: theme.currenctText,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
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
        note1: { fontSize: PixelPerfect(16), fontFamily: Fonts.regular, color: theme.black, marginTop: PixelPerfect(8) },
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
        description: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.regular, marginVertical: PixelPerfect(4) },

    });
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect } from '../../Constants/styleConstants';
import SellerBranches from '../../Components/Cards/SellerBranches';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Call2Icon, CancelIcon, CheckIcon } from '../../Assets/Svg';
type Props = {
    item: any, onAccept: any, onReject: any
}

const MyOrderItem = (props: Props) => {
    const {
        item, onAccept
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    const [state, setstate] = useState({
        loading: false,
        items: [{ flag: false }, { flag: false }]

    });
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <View style={styles.card}>

                    <View style={[layout.dirRow, styles.row]}>
                        <View style={styles.con1}>
                            <View style={[layout.dirRow, { justifyContent: "space-between", alignItems: "center" }]}>
                                <TouchableOpacity style={styles.statusBtn} onPress={() => { }}>
                                    <Text style={styles.statusText}>طلب مقبول</Text>

                                </TouchableOpacity>
                                <View style={[layout.rowBox, { alignItems: "center" }]}>
                                    <Image source={{ uri: "https://i.pravatar.cc/100" }} style={styles.avatar} />
                                    <Text style={styles.name}>مكتبة النور</Text>
                                </View>
                            </View>
                            <View style={styles.actions}>
                                <SellerBranches loading={state.loading} onPress={function (): void {
                                    throw new Error('Function not implemented.');
                                }} />
                            </View>
                            <Text style={styles.product}>ورق مرام 80جم</Text>



                            <View style={styles.actions}>
                                <Text style={styles.date}>التاريخ: </Text>
                                <Text style={styles.date1}>15 ديسمبر 2025</Text>
                            </View>

                            <View style={styles.actions}>
                                <Text style={styles.date}>الكمية: </Text>
                                <Text style={styles.date1}>15</Text>
                            </View>

                            <View style={styles.actions}>
                                <Text style={styles.date}>الاجمالي: </Text>
                                <Text style={styles.total}>1500 جنيها</Text>
                            </View>

                            <View style={[layout.dirRow, styles.actions]}>
                                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => onAccept(item)}>
                                    <View style={[styles.icon]}>
                                        <Call2Icon />
                                    </View>
                                    <Text style={styles.acceptText}>تواصل الان</Text>

                                </TouchableOpacity>

                            </View>

                            <View style={[layout.dirRow, styles.actions]}>

                                <TouchableOpacity style={[layout.rowBox, styles.receiveBtn]} onPress={() => onAccept(item)}>
                                     <View style={[styles.icon]}>
                                         <CheckIcon />
                                         </View>
                                   
                                    <Text style={styles.receiveText}>تم التسليم</Text>

                                </TouchableOpacity>
                            </View>

                             <View style={[layout.dirRow, styles.actions]}>

                                <TouchableOpacity style={[layout.rowBox, styles.cancelBtn]} onPress={() => onAccept(item)}>
                                      <View style={[styles.icon]}>
                                         <CancelIcon />
                                         </View>
                                    <Text style={styles.cancelText}>الغاء الطلب</Text>

                                </TouchableOpacity>
                            </View>

                            {/* وصف المنتج */}
                            <View >
                                <View style={styles.actions}>
                                    <Text style={styles.description}>وصف المنتج: </Text>
                                    <Text style={styles.description1}>ورق طباعة أبيض نقي بجودة ممتازة، مناسب لجميع أنواع الطابعات النافثة للحبر والليزر. العبوة تحتوي على 500 ورقة بحجم A4 قياسي. الورق مصنوع من ألياف طبيعية عالية الجودة مما يضمن طباعة واضحة ونتائج احترافية.</Text>
                                </View>
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

                            <Text style={styles.cancel}>تم الغاء الطلب بواسطه المشتري</Text>
                            {/*التقييم*/}
                            <Text style={styles.rate}>تقييمك للبائع : </Text>
                            <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                                <Text style={styles.rating}>{"(5)"} ⭐⭐⭐⭐ </Text>
                                <Text style={styles.dateRate}>18 مايو 2025</Text>

                            </View>

                            <Text style={styles.rateNote}>جودة ممتازة وسعر مناسب. الورق أبيض نقي والطباعة عليه واضحة جداً. أنصح بالشراء.</Text>
                        </View>
                    </View>



                    {/* <View style={[layout.dirRow, styles.actions]}>

                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => onAccept(item)}>
                    <Text style={styles.acceptText}>تواصل الان</Text>

                </TouchableOpacity>
            </View> */}
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

export default MyOrderItem

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        container: {
            flex: 1,

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
            backgroundColor: theme.green,
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
    });
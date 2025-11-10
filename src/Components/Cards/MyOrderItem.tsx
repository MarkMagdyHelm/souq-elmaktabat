import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { Call2Icon } from '../../Assets/Svg';
import { t } from 'i18next';
type Props = {
    item: any, onDetailsClick: any
}




const MyOrderItem = (props: Props) => {
    const {
        item, onDetailsClick
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir, item.status);
    const [show, setshow] = useState(false);
    const fullDate = item.date;
    const [date, time] = fullDate.split("T");
    return (
        <View style={styles.card}>

            <View style={[layout.dirRow, styles.row]}>
                <View style={styles.con1}>
                    <View style={[layout.dirRow, { justifyContent: "space-between", alignItems: "center" }]}>
                        <View style={styles.statusBtn}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>

                        <View style={[layout.rowBox, { alignItems: "center" }]}>
                            <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
                            <View style={[layout.flexStart, { paddingHorizontal: PixelPerfect(8) }]}>
                                <Text style={[layout.textAlign,styles.name]}>{item.userName}</Text>
                                <Text style={[layout.textAlign,styles.rating]}>⭐ {item.userRateAverage}</Text>
                            </View>
                        </View>
                    </View>


                    <View style={[layout.rowBox, styles.actions]}>
                        <Text style={[layout.textAlign,styles.product]}>{item.category + " " + item.paperName + " " + item.paperSize}</Text>


                    </View>

                    <Text style={[layout.textAlign,,styles.quantity]}>{t("date")} {date}  </Text>



                    <View style={[layout.rowBox, styles.actions]}>
                        <Text style={[layout.textAlign,styles.quantity]}>{t("quantity")} {item.quentity}</Text>
                        <Text style={[layout.textAlign,styles.price]}>{item.price} {t("pound")}</Text>
                    </View>

                </View>
            </View>



            <View style={[layout.dirRow, styles.actions]}>

                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => onDetailsClick(item)}>

                    <Text style={styles.acceptText}>{t("viewDetails")}</Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default MyOrderItem

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string, status: any) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(10),
            padding: PixelPerfect(12),
            marginVertical: PixelPerfect(8),
            borderWidth: PixelPerfect(1),
            borderColor: theme.grayLigth,
        },
        time: { fontSize: PixelPerfect(14), textAlign: "left", color: theme.deactive, fontFamily: Fonts.medium },
        row: { alignItems: "center" },
        avatar: { width: PixelPerfect(40), height: PixelPerfect(40), borderRadius: PixelPerfect(20) },
        name: { fontSize: PixelPerfect(18), fontFamily: Fonts.bold, color: theme.black },
        rating: { fontSize: PixelPerfect(12), color: theme.currenctText, paddingEnd: PixelPerfect(8) },
        product: { fontSize: PixelPerfect(14), marginTop: PixelPerfect(8), color: theme.babyBlue, fontFamily: Fonts.bold },
        quantity: { fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.medium },
        con1: { flex: 1, marginHorizontal: PixelPerfect(8) },
        price: { fontSize: PixelPerfect(14), color: theme.textColor, fontFamily: Fonts.bold },

        actions: { justifyContent: "space-between", marginTop: PixelPerfect(8) },
        acceptBtn: {
            flex: 1,
            marginLeft: PixelPerfect(5),
            backgroundColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },


        callBtn: {

            marginLeft: PixelPerfect(6),
            height: PixelPerfect(20),
            width: PixelPerfect(20),

        },

        statusBtn: {
            flex: 0.40,
            backgroundColor:
                status === "قيد الانتظار"
                    ? theme.currenctText
                    : status === "طلب مقبول"
                        ? theme.green
                        : status === "طلب ملغي"
                            ? theme.red
                            : status === "تم التسليم"
                                ? theme.textColor : status === "طلب منتهي" ? theme.deactive
                                    : theme.currenctText,

            borderRadius: PixelPerfect(4),
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
            fontFamily: Fonts.bold,
            fontSize: PixelPerfect(16),
            color: theme.white
        },
        statusText: {
            fontFamily: Fonts.medium,
            fontSize: PixelPerfect(14),
            color: theme.white
        },
        rejectText: { fontSize: PixelPerfect(16), color: theme.youtube, fontFamily: Fonts.bold, },
    });
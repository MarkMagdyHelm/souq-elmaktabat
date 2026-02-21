import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { PixelPerfect } from '../../Constants/styleConstants';
import { Call2Icon } from '../../Assets/Svg';
import { t } from 'i18next';
import Stars from '../../Helper/Stars';
import { timeAgo } from '../../Helper';
type Props = {
    item: any, onViewDetails: any
}

const SellesOrder = (props: Props) => {
    const {
        item, onViewDetails
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir,item.status);

  


    return (
        <View style={styles.card}>

            <View style={[layout.dirRow, styles.row]}>
                <View style={styles.con1}>
                    {/* user info */}
                    <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                        <View style={[layout.rowBox, { alignItems: "center" }]}>
                            <Image source={{ uri: item.userImages }} style={styles.avatar} />
                            <View style={[layout.flexStart, { paddingHorizontal: PixelPerfect(8) }]}>
                                <Text style={[layout.textAlign, styles.name]}>{item.userName}</Text>
                                <Stars rating={item.userRateAverage} rateCount={item.userRateCount} />
                            </View>
                        </View>
                        <Text style={[layout.textAlign, styles.time]}>{timeAgo(item.date)}</Text>
                    </View>
                    <View style={[layout.rowBox, styles.actions]}>
                        <Text style={[layout.textAlign, styles.product]}>{item.category + " " + item.paperName + " " + item.paperSize}</Text>
                        <TouchableOpacity style={styles.statusBtn}>
                            <Text style={[layout.textAlign, styles.acceptText]}>{item.status}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[layout.rowBox, styles.actions]}>
                        <Text style={[layout.textAlign, styles.quantity]}>{t("quantity")} {item.quentity + t("carton")}</Text>
                        <Text style={[layout.textAlign, styles.price]}>{item.price} {t("pound")}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Text style={[layout.textAlign, styles.quantity]}> {item.branch}</Text>

                    </View>
                </View>
            </View>



            <View style={[layout.dirRow, styles.actions]}>

                <TouchableOpacity style={[layout.rowBox, styles.acceptBtn]} onPress={() => onViewDetails()}>

                    <Text style={styles.acceptText}>{t("viewDetails")}</Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SellesOrder

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,status:string) =>
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
        name: {
            lineHeight: PixelPerfect(22),
            fontSize: PixelPerfect(18), fontFamily: Fonts.bold, color: theme.black
        },
        rating: { fontSize: PixelPerfect(12), color: theme.currenctText, paddingEnd: PixelPerfect(8) },
        product: { lineHeight: PixelPerfect(22), fontSize: PixelPerfect(14), marginTop: PixelPerfect(8), color: theme.babyBlue, fontFamily: Fonts.bold },
        quantity: {
            lineHeight: PixelPerfect(22),
            fontSize: PixelPerfect(14), color: theme.black, fontFamily: Fonts.medium
        },
        con1: { flex: 1, marginHorizontal: PixelPerfect(8) },
        price: { fontSize: PixelPerfect(14), color: theme.textColor, fontFamily: Fonts.bold },

        actions: { justifyContent: "space-between", marginVertical: PixelPerfect(2) },
        acceptBtn: {
            flex: 1,
            height: PixelPerfect(45),
            backgroundColor: theme.babyBlue,
            borderRadius: PixelPerfect(6),
            padding: PixelPerfect(10),
            alignItems: "center",
            justifyContent: "center"
        },
        icon: {
            paddingHorizontal: PixelPerfect(2)
        },



  

        statusBtn: {
            flex: 0.35,
            height: PixelPerfect(30),
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

        acceptText: {
            lineHeight: PixelPerfect(22),
            fontSize: PixelPerfect(16),
            fontFamily: Fonts.bold,
            color: theme.white
        },
    });
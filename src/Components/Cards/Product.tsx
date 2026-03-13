import { Image, Platform, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';
import { HeartIcon, RateIcone } from '../../Assets/Svg';
import { t } from 'i18next';
import { imageUrl } from '../../Constants/config';

type Props = {
    item: any,
    onPress: () => void,
    onFavPress: () => void,
    isOfffer: any
}

const Product = (props: Props) => {
    const {
        item,
        isOfffer,
        onPress,
        onFavPress
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.con]}>
                {<Pressable style={{ padding: 8 }} onPress={onFavPress}>
                    <HeartIcon style={styles.heart}
                        color={item.isFavourite ? theme.red : theme.white}
                    />
                </Pressable>
                }

                <Image source={{ uri: item.imageUrl }} resizeMode="contain" style={[styles.image]} />
                {item.type == 1 && <Text style={[layout.textAlign, styles.text]}>{item.categoryName + " " + item.name + " " + item.width + t("GM") + " " + item.paperSize}</Text>}
                {item.type == 2 && <Text style={[layout.textAlign, styles.text]}>{item.categoryName + " " + item.name}</Text>}
                {item.type == 3 && <Text style={[layout.textAlign, styles.text]}>{item.categoryName + " " + item.userName}</Text>}


                <View style={[layout.dirRow, styles.priceRateRow]}>
                    <View style={[layout.rowBox, { alignItems: "center" }]}>
                        <RateIcone />
                        <Text style={[layout.textAlign, styles.text1]}>{"(" + (item.userRateCount ?? item.rate ?? item.rates) + ")"}</Text>
                    </View>
                    {/* <Text style={[layout.textAlign, styles.price]}>{item.price + " " + t("pound")}</Text> */}

                    {(item.type == 2 || item.type == 1) && <Text style={[layout.textAlign, styles.price]}>{item.type == 2 ?
                        item.price + t("pound")
                        : item.price + t("pound")}</Text>}
                    <View>
                        {item.coloredPrice && <Text style={[layout.textAlign, styles.price]}>{item.coloredPrice + t("pound")}</Text>}
                        {item.nonColoredPrice && <Text style={[layout.textAlign, styles.price]}>{item.nonColoredPrice + t("pound")}</Text>}
                    </View>
                </View>
                {!isOfffer && <View style={[layout.rowBox, styles.con2]}>
                    <Image
                        source={{ uri: item.userImages }}
                        style={[styles.imageRound]}
                    />
                    <View style={{ marginHorizontal: PixelPerfect(4) }}>
                        <Text style={[layout.textAlign, styles.seller]}>{item.userName}</Text>
                        <Text style={[styles.text2]}>{item.countryName}</Text>
                    </View>
                </View>
                }
                <TouchableOpacity onPress={onPress}
                    style={[styles.con1]} >
                    <Text style={[styles.text3]}>{t("viewDetails")}</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default Product

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({

        con: {
            width: (phoneWidth - PixelPerfect(50)) / 2,
            minHeight: PixelPerfect(228),
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(12),
            padding: PixelPerfect(12),
            marginHorizontal: PixelPerfect(6),
            marginVertical: PixelPerfect(2),
            shadowColor: theme.black,
            shadowOpacity: PixelPerfect(0.05),
            shadowRadius: PixelPerfect(8),
            elevation: PixelPerfect(2),
        },

        con1: {
            height: PixelPerfect(36),
            backgroundColor: theme.active,
            paddingHorizontal: PixelPerfect(10),
            borderRadius: PixelPerfect(4),
            marginTop: PixelPerfect(10),
            justifyContent: "center",
            alignItems: "center",

        },
        con2: {
            alignItems: "center", marginTop: PixelPerfect(4)
        },

        image: {
            height: PixelPerfect(80),
            width: "100%",
            marginTop: PixelPerfect(10),
            resizeMode: "contain"
        },

        imageRound: {
            height: PixelPerfect(24),
            width: PixelPerfect(24),
            borderRadius: PixelPerfect(12),
            marginRight: PixelPerfect(4),
        },
        text: {
            lineHeight: PixelPerfect(20),
            color: theme.black,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            marginTop: PixelPerfect(6)
        },
        seller: {
            color: theme.black,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.regular,
            lineHeight: PixelPerfect(20)
        },
        priceRateRow: {
            justifyContent: 'space-between',
            marginTop: PixelPerfect(6),

        },
        price: {
            lineHeight: PixelPerfect(20),
            color: theme.textColor,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium
        },
        star: { color: '#FFA800', marginRight: PixelPerfect(2) },
        text1: {
            color: theme.deactive,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            marginTop: Platform.OS == "ios" ? 2 : 0
        },
        text2: {
            lineHeight: PixelPerfect(20),
            color: theme.textColor,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.extraLight,
        },
        text3: {
            color: theme.white,
            fontSize: PixelPerfect(14),
            lineHeight: PixelPerfect(28),
            fontFamily: Fonts.bold,
            alignItems: "center",
            alignContent: "center"
        },
        heart: {
            position: 'absolute',
            zIndex: 1,
            color: theme.active
        },
    });
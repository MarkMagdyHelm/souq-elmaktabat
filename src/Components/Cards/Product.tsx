import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeartIcon, RateIcone } from '../../Assets/Svg';
import { t } from 'i18next';

type Props = {
    item: any, onPress: () => void,
    onFavPress: () => void,
}

const Product = (props: Props) => {
    const {
        item,
        onPress,
        onFavPress
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);

    return (
        <Pressable
            onPress={onPress}
        >
            <View style={[styles.con]}>
                <Pressable style={{padding:8}} onPress={ onFavPress }>
                    <HeartIcon style={styles.heart} 
                    color={!item.isFavourite ?theme.white:theme.red}
                    />
                </Pressable>

                <Image source={{ uri: item.paperPhoto }} resizeMode="contain" style={[styles.image]} />
                <Text style={[layout.textAlign,styles.text]}>{item.categoryName + " " + item.paperName + " " + item.width + t("GM") + " " + item.paperSize}</Text>
                <View style={[layout.dirRow, styles.priceRateRow]}>
                    <View style={[layout.rowBox,{alignItems:"center"}]}>
                       <RateIcone/>
                        <Text style={[layout.textAlign,styles.text1]}>{"(" + item.userRateCount + ")"}</Text>
                    </View>
                    <Text style={[layout.textAlign,styles.price]}>{item.price + " " + t("pound")}</Text>
                </View>
                <View style={[layout.rowBox, styles.con2]}>
                    <Image
                        source={{ uri: item.userImages }}
                        style={[styles.imageRound]}
                    />
                    <View style={{ marginHorizontal: PixelPerfect(4) }}>
                        <Text style={[layout.textAlign,styles.seller]}>{item.userName}</Text>
                        <Text style={[styles.text2]}>{item.countryName}</Text>
                    </View>
                </View>
                <TouchableOpacity
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
            width: PixelPerfect(175),
            minHeight: PixelPerfect(228),
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(12),
            padding: PixelPerfect(12),
            marginHorizontal: PixelPerfect(6),
            marginVertical: PixelPerfect(2),
            shadowColor: theme.black,
            shadowOpacity: PixelPerfect(0.1),
            shadowRadius: PixelPerfect(8),
            elevation: PixelPerfect(2),
        },

        con1: {
            height: PixelPerfect(30),
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
            width: PixelPerfect(145),
            borderRadius: PixelPerfect(10),
            resizeMode: "cover"
        },

        imageRound: {
            height: PixelPerfect(24),
            width: PixelPerfect(24),
            borderRadius: PixelPerfect(12),
            marginRight: PixelPerfect(4),
        },
        text: {
            color: theme.active,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
            marginTop: PixelPerfect(6)
        },
        seller: {
            color: theme.active,
            fontSize: PixelPerfect(13),
            fontFamily: Fonts.medium,
            lineHeight:PixelPerfect(20)
        },
        priceRateRow: {
            justifyContent: 'space-between',
            marginTop: PixelPerfect(6),
           
        },
        price: {
            color: theme.active,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.bold
        },
        star: { color: '#FFA800', marginRight: PixelPerfect(2) },
        text1: {
            color: theme.deactive,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
          marginTop:Platform.OS=="ios"?2:0
        },
        text2: {
            color: theme.deactive,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.extraLight,
        },
        text3: {
            color: theme.white,
            fontSize: PixelPerfect(14),
            lineHeight:PixelPerfect(28),
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
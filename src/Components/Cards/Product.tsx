import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { ColorWithOpacity, Colors, PixelPerfect, phoneWidth } from '../../Constants/styleConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
    item: any, onPress: () => void,
}

const Product = (props: Props) => {
    const {
        item,
        onPress
    } = props;
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <Pressable
            onPress={onPress}
        >
            <View
                style={[styles.con]}
            >
                <Image source={{ uri: item.paperPhoto }} style={[styles.image]} />
                <Text style={[styles.text]}>{item.categoryName + " " + item.paperName + " " + item.width + "جم " + item.paperSize}</Text>
                <View style={[layout.rowBox, { justifyContent: "space-between" }]}>
                    <Text style={[styles.text1]}>{item.price + "جنيها"}</Text>
                    <View style={[layout.rowBox]}>
                        <Text>{"⭐"}</Text>
                        <Text style={[styles.text1]}>{"(" + item.userRateCount + ")"}</Text>
                    </View>
                </View>
                <View style={[layout.rowBox, styles.con2]}>
                    <Image
                        source={{ uri: item.userImages }}
                        style={[styles.imageRound]}
                    />
                    <View style={{ marginHorizontal: PixelPerfect(4) }}>
                        <Text style={[styles.text]}>{item.userName}</Text>
                        <Text style={[styles.text2]}>{item.countryName}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.con1]}
                >
                    <Text style={[styles.text3]}>عرض التفاصيل</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default Product

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({

        con: {
            width: PixelPerfect(163),
            height: PixelPerfect(228),
            backgroundColor: theme.white,
            borderRadius: PixelPerfect(12),
            margin: PixelPerfect(8),
            padding: PixelPerfect(8),
            shadowColor: theme.black,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },

        con1: {
            backgroundColor: "#007bff",
            padding: PixelPerfect(6),
            borderRadius: PixelPerfect(8),
            marginTop: PixelPerfect(8),
            alignContent: "center",
            alignItems: "center"
        },
        con2: {
            alignItems: "center", marginTop: PixelPerfect(4)
        },

        image: {
            height: PixelPerfect(80),
            width: PixelPerfect(143),
            borderRadius: PixelPerfect(10),
            resizeMode: "contain"
        },

        imageRound: {
            height: PixelPerfect(24),
            width: PixelPerfect(24),
            borderRadius: PixelPerfect(12),
            marginRight: PixelPerfect(4),
        },
        text: {
            color: theme.black,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
        },
        text1: {
            color: theme.gray,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.medium,
        },
        text2: {
            color: theme.black,
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.extraLight,
        },
        text3: {
            color: theme.white,
            fontSize: PixelPerfect(14),
            fontFamily: Fonts.bold,
            alignItems: "center",
            alignContent: "center"
        },
    });
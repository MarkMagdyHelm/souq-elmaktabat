import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { IFont, ITheme } from '../../Constants/interfaces'
import { ThemeContext } from '../../Constants/theming'
import { Colors, phoneWidth, PixelPerfect } from '../../Constants/styleConstants'
import { t } from 'i18next'
import { AddressIcon, NotificationIcon } from '../../Assets/Svg'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = { item?: any, onPress: () => void, selected?: boolean,
    viewRadio?: boolean,backgroundColor:""
 }
const SellerBranches = (props: Props) => {
    const { item, onPress, selected,viewRadio ,backgroundColor} = props
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir,backgroundColor);

    const scaleAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;
    // 🔹 Update animation on change
    useEffect(() => {
        console.log('selected changed:', selected);
        Animated.spring(scaleAnim, {
            toValue: selected ? 1 : 0,
            useNativeDriver: true,
            speed: 12,
            bounciness: 8,
        }).start();
    }, [selected]);
    return (
        <Pressable onPress={onPress}
         style={[layout.rowBox, styles.container]}>
            <View style={[styles.con]}>
                <View style={[layout.rowBox, styles.bodyCon]}>
                    <View style={styles.iconCon}>
                        <AddressIcon color={Colors.white} />
                    </View>
                    <Text style={[layout.textAlign, styles.textTitle]}>
                        {item?.country + "/" + item?.region }</Text>
                </View>
                <Text style={[layout.textAlign, styles.textBody]}>{item?.name??item?.street}</Text>
            </View>
            {/* 🔘 Radio Button Animated */}
            {viewRadio && <View style={styles.radioOuter}>
                {selected && (
                    <Animated.View
                        style={[
                            styles.radioInner,
                            {
                                transform: [{ scale: scaleAnim }],
                                opacity: scaleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                                       backgroundColor: selected ? theme.textColor : 'transparent',
                            },
                        ]}
                    />
                )}
            </View>}
        </Pressable>
    )
}
export default SellerBranches
const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,backgroundColor:string) => StyleSheet.create({
    container:{ justifyContent: 'space-between',backgroundColor: backgroundColor, alignItems: 'center' },
    con: { paddingVertical: PixelPerfect(4) },
    iconCon: {
        width: PixelPerfect(24),
        height: PixelPerfect(24), alignItems: "center", justifyContent: "center"
    },
    bodyCon: { alignContent: "center", alignItems: "center" },
    textTitle: {     lineHeight:PixelPerfect(25),fontFamily: Fonts.regular, color: theme.black, fontSize: PixelPerfect(16), marginHorizontal: PixelPerfect(5) },
    textBody: {    lineHeight:PixelPerfect(25), fontFamily: Fonts.extraLight, color: theme.black, fontSize: PixelPerfect(14), marginVertical: PixelPerfect(4) },
    radioOuter: {
        width: PixelPerfect(22),
        height: PixelPerfect(22),
        lineHeight:PixelPerfect(25),
        borderRadius: PixelPerfect(22),
        borderWidth: 2,
        borderColor: theme.textColor,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: PixelPerfect(12),
        height: PixelPerfect(12),
        borderRadius: PixelPerfect(12),
        backgroundColor: theme.textColor,
    }
});
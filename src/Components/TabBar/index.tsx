import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../Constants/theming';
import { IFont, ITheme } from '../../Constants/interfaces';
import { Colors, PixelPerfect } from '../../Constants/styleConstants';
import { t } from 'i18next';
import { CartIcon, HomeIcon, OrdersIcon, ProfileIcon } from '../../Assets/Svg';
import { useRoute } from '@react-navigation/native';

type Props = {

}

const index = (props: Props) => {
    const route = useRoute();
    const { Fonts, dir, layout, theme, dark } = useContext(ThemeContext);
    const styles = useStyles(Fonts, theme, dark, dir);
    return (
        <View style={[layout.rowBox, styles.containner]}>
            <Pressable style={styles.tapcon}>
                <HomeIcon color={route.name === "Home" ? theme.mainColor : theme.inputTextColor} />
                <Text style={[styles.tabText, { color: route.name === "Home" ? theme.mainColor : theme.inputTextColor }]}>{t('Home')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon}>
                <OrdersIcon color={route.name === "Orders" ? theme.mainColor : theme.inputTextColor}>
                    <View style={styles.wedgit} />
                </OrdersIcon>
                <Text style={[styles.tabText, { color: route.name === "Orders" ? theme.mainColor : theme.inputTextColor }]}>{t('Orders')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon}>
                <CartIcon color={route.name === "Cart" ? theme.mainColor : theme.inputTextColor} >
                <View style={[styles.wedgit,{top:0}]} />
                </CartIcon>
                <Text style={[styles.tabText, { color: route.name === "Cart" ? theme.mainColor : theme.inputTextColor }]}>{t('Cart')}</Text>
            </Pressable>
            <Pressable style={styles.tapcon}>
                <ProfileIcon color={route.name === "Profile" ? theme.mainColor : theme.inputTextColor} />
                <Text style={[styles.tabText, { color: route.name === "Profile" ? theme.mainColor : theme.inputTextColor }]}>{t('Profile')}</Text>
            </Pressable>
        </View>
    )
}

export default index

const useStyles = (Fonts: IFont, theme: ITheme, darkmode: boolean, dir: string,) =>
    StyleSheet.create({
        containner: {
            alignItems: "center",
            flex: 0.08,
            backgroundColor: Colors.white
        },
        tapcon: {
            flex: 1 / 4,
            alignItems: "center",
            justifyContent: "center",
        },
        tabText: {
            paddingTop: PixelPerfect(5),
            fontSize: PixelPerfect(12),
            fontFamily: Fonts.regular,
        },
        wedgit: {
            width: 7,
            height: 7,
            backgroundColor: "red",
            borderRadius: 3.5,
            top: 11,
            left: 13
        }
    });